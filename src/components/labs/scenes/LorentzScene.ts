import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createPbrRenderer,
  setupStudioLighting,
  createContactShadowTexture,
  createLaboratoryFloor,
  isSoftwareGl,
} from '../threeUtils';
import { calculateCyclotronRadius } from '../../../physics/math';

export interface LorentzLabState {
  bField: number; // Tesla (0.0 to 0.8)
  velocity: number; // × 10^6 m/s (1.0 to 6.0)
  particleType: 'electron' | 'proton';
  pitchAngle: number; // degrees (0 for circle, >0 for helix)
  showFieldLines: boolean;
  showVectors: boolean;
}

export class LorentzScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  // Scene elements
  private apparatusGroup: THREE.Group = new THREE.Group();
  private beamLine!: THREE.Line;
  private particleMesh!: THREE.Mesh;
  private fieldLinesGroup: THREE.Group = new THREE.Group();
  private vectorGroup: THREE.Group = new THREE.Group();
  private animProgress: number = 0;

  public state: LorentzLabState = {
    bField: 0.35,
    velocity: 3.5,
    particleType: 'electron',
    pitchAngle: 0,
    showFieldLines: true,
    showVectors: true,
  };

  public onStateUpdate?: (state: LorentzLabState, metrics: any) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = createPbrRenderer(canvas);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);

    const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(12, 10, 16);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = !isSoftwareGl;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 3.5, 0);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.update();

    setupStudioLighting(this.scene, this.renderer);
    this.scene.add(createLaboratoryFloor(40));

    this.buildHelmholtzApparatus();
    this.scene.add(this.fieldLinesGroup);
    this.scene.add(this.vectorGroup);

    this.buildParticleBeam();
    this.updateSimulation();

    this.startLoop();
  }

  private buildHelmholtzApparatus() {
    // 1. Mahogany / Cast-iron Lab Base
    const baseGeo = new THREE.BoxGeometry(10, 0.4, 7);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.7,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.2;
    base.receiveShadow = !isSoftwareGl;
    this.apparatusGroup.add(base);

    // 2. Twin Helmholtz Coils (Circular copper wire coils spaced by radius R)
    const coilRadius = 3.5;
    const coilZOffset = 1.75;
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // copper tone
      roughness: 0.3,
      metalness: 0.9,
    });
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.8,
    });

    [-coilZOffset, coilZOffset].forEach((zPos) => {
      // Copper coil ring
      const torusGeo = new THREE.TorusGeometry(coilRadius, 0.25, 16, 48);
      const coil = new THREE.Mesh(torusGeo, coilMat);
      coil.position.set(0, 3.5, zPos);
      coil.castShadow = !isSoftwareGl;
      this.apparatusGroup.add(coil);

      // Support pillar for each coil
      const pillarGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.5, 12);
      const pillar = new THREE.Mesh(pillarGeo, frameMat);
      pillar.position.set(0, 1.75, zPos);
      this.apparatusGroup.add(pillar);
    });

    // 3. Spherical Evacuated Glass Bulb
    const bulbGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const bulbMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: isSoftwareGl ? 0 : 0.92,
      opacity: isSoftwareGl ? 0.3 : 1,
      transparent: true,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      ior: 1.45,
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 3.5, 0);
    this.apparatusGroup.add(bulb);

    // 4. Electron Gun Emitter Assembly
    const gunGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.9 });
    const gun = new THREE.Mesh(gunGeo, brassMat);
    gun.rotation.z = Math.PI / 2;
    gun.position.set(-2.8, 3.5, 0);
    this.apparatusGroup.add(gun);

    // 5. Contact shadow
    const shadowGeo = new THREE.PlaneGeometry(12, 10);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(256),
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    this.apparatusGroup.add(shadow);

    this.scene.add(this.apparatusGroup);
  }

  private buildParticleBeam() {
    // Glowing electron path line
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
    });
    this.beamLine = new THREE.Line(lineGeo, lineMat);
    this.scene.add(this.beamLine);

    // Lead particle sphere
    const partGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const partMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.particleMesh = new THREE.Mesh(partGeo, partMat);
    this.scene.add(this.particleMesh);
  }

  public updateSimulation() {
    const { bField, velocity, particleType, pitchAngle, showFieldLines, showVectors } = this.state;

    // Electron: q = -1, m = 1
    // Proton: q = +1, m = 1836 (scaled for visual laboratory display)
    const qSign = particleType === 'electron' ? -1 : 1;
    const visualScaleFactor = particleType === 'electron' ? 0.35 : 0.8;

    // Radius calculation
    const radius = bField > 0.01 ? (velocity / (bField * 4.5)) * visualScaleFactor : 50;

    // Build glowing trajectory points
    const points: THREE.Vector3[] = [];
    const numPoints = 120;
    const startX = -2.2;
    const startY = 3.5;
    const startZ = 0;

    const pitchRad = (pitchAngle * Math.PI) / 180;
    const zDriftSpeed = Math.sin(pitchRad) * 0.04;

    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 3.5; // up to ~1.75 loops

      if (bField <= 0.01) {
        // Straight line if no magnetic field
        points.push(new THREE.Vector3(startX + i * 0.05, startY, startZ + i * zDriftSpeed));
      } else {
        // Circular / Helical deflection
        // Center of curvature is offset along Y
        const centerY = startY + qSign * radius;
        const angle = t * qSign;
        const x = startX + radius * Math.sin(angle);
        const y = centerY - radius * Math.cos(angle);
        const z = startZ + t * zDriftSpeed;

        // Clip if outside glass bulb
        const distFromCenter = Math.sqrt(x * x + (y - 3.5) * (y - 3.5) + z * z);
        if (distFromCenter < 3.0) {
          points.push(new THREE.Vector3(x, y, z));
        }
      }
    }

    if (points.length < 2) {
      points.push(new THREE.Vector3(startX, startY, startZ));
      points.push(new THREE.Vector3(startX + 1, startY, startZ));
    }

    this.beamLine.geometry.dispose();
    this.beamLine.geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Update Field lines
    this.fieldLinesGroup.clear();
    if (showFieldLines && bField > 0.02) {
      for (let ix = -1.5; ix <= 1.5; ix += 1.5) {
        for (let iy = 2.0; iy <= 5.0; iy += 1.5) {
          const arrowDir = new THREE.Vector3(0, 0, 1);
          const arrowOrigin = new THREE.Vector3(ix, iy, -1.8);
          const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, 3.6, 0x10b981, 0.35, 0.2);
          this.fieldLinesGroup.add(arrow);
        }
      }
    }

    // Update real physics metrics
    const realMass = particleType === 'electron' ? 9.109e-31 : 1.672e-27;
    const realCharge = 1.602e-19;
    const realRadius = calculateCyclotronRadius(
      realMass,
      velocity * 1e6,
      realCharge,
      Math.max(bField, 0.001)
    );

    if (this.onStateUpdate) {
      this.onStateUpdate(this.state, {
        visualRadius: Number(radius.toFixed(2)),
        realRadiusMeters: realRadius,
        lorentzForce: Number((realCharge * velocity * 1e6 * bField).toExponential(3)),
      });
    }
  }

  public setParameters(params: Partial<LorentzLabState>) {
    Object.assign(this.state, params);
    this.updateSimulation();
  }

  private startLoop() {
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.isDestroyed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (this.isDestroyed) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Animate particle moving along beam path
      this.animProgress = (this.animProgress + dt * 1.5) % 1.0;
      const positions = this.beamLine.geometry.attributes.position;
      if (positions && positions.count > 1) {
        const index = Math.floor(this.animProgress * (positions.count - 1));
        const px = positions.getX(index);
        const py = positions.getY(index);
        const pz = positions.getZ(index);
        this.particleMesh.position.set(px, py, pz);

        // Update Right Hand Rule vector helpers at current particle position
        if (this.state.showVectors) {
          this.vectorGroup.clear();
          const pOrigin = new THREE.Vector3(px, py, pz);

          // Velocity vector v (tangent)
          const nextIndex = Math.min(index + 1, positions.count - 1);
          const vDir = new THREE.Vector3(
            positions.getX(nextIndex) - px,
            positions.getY(nextIndex) - py,
            positions.getZ(nextIndex) - pz
          ).normalize();
          if (vDir.length() > 0.01) {
            const vArrow = new THREE.ArrowHelper(vDir, pOrigin, 1.2, 0x38bdf8, 0.3, 0.15);
            this.vectorGroup.add(vArrow);

            // B-field vector (along +Z)
            const bDir = new THREE.Vector3(0, 0, 1);
            const bArrow = new THREE.ArrowHelper(bDir, pOrigin, 1.2, 0x10b981, 0.3, 0.15);
            this.vectorGroup.add(bArrow);

            // Force vector F = q(v x B)
            const fDir = new THREE.Vector3().crossVectors(vDir, bDir).normalize();
            if (this.state.particleType === 'electron') fDir.negate();
            const fArrow = new THREE.ArrowHelper(fDir, pOrigin, 1.2, 0xef4444, 0.3, 0.15);
            this.vectorGroup.add(fArrow);
          }
        }
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    tick();
  }

  public resize(width: number, height: number) {
    if (this.isDestroyed || width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  public destroy() {
    this.isDestroyed = true;
    if (isSoftwareGl) {
      clearTimeout(this.frameId);
    } else {
      cancelAnimationFrame(this.frameId);
    }
    this.controls.dispose();
    this.renderer.dispose();
  }
}
