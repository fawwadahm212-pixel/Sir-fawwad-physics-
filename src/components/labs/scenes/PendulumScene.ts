import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createPbrRenderer,
  setupStudioLighting,
  createContactShadowTexture,
  createLaboratoryFloor,
  isSoftwareGl,
} from '../threeUtils';
import { calculatePendulumPeriod, calculateMechanicalEnergy } from '../../../physics/math';

export interface PendulumLabState {
  length: number; // meters (1.0 to 3.0)
  mass: number; // kg
  initialAngle: number; // degrees
  gravity: number; // m/s^2
  damping: number; // air drag
  isPlaying: boolean;
  currentAngle: number;
  angularVelocity: number;
}

export class PendulumScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  // Scene elements
  private standGroup: THREE.Group = new THREE.Group();
  private swingGroup: THREE.Group = new THREE.Group();
  private stringMesh!: THREE.Mesh;
  private bobMesh!: THREE.Mesh;
  private vectorGroup: THREE.Group = new THREE.Group();
  private eqDashedLine!: THREE.Line;

  public state: PendulumLabState = {
    length: 1.8,
    mass: 0.5,
    initialAngle: 30,
    gravity: 9.8,
    damping: 0.05,
    isPlaying: true,
    currentAngle: (30 * Math.PI) / 180,
    angularVelocity: 0,
  };

  public onStateUpdate?: (state: PendulumLabState, metrics: any) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = createPbrRenderer(canvas);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);

    const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 10, 18);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = !isSoftwareGl;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 5, 0);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.update();

    setupStudioLighting(this.scene, this.renderer);
    this.scene.add(createLaboratoryFloor(40));

    this.buildLaboratoryStand();
    this.buildPendulumMechanism();
    this.scene.add(this.vectorGroup);

    this.startLoop();
  }

  private buildLaboratoryStand() {
    // 1. Triangular Cast-Iron Base
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.35, 24);
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.7,
    });
    const base = new THREE.Mesh(baseGeo, ironMat);
    base.position.y = 0.175;
    base.receiveShadow = !isSoftwareGl;
    base.castShadow = !isSoftwareGl;
    this.standGroup.add(base);

    // 2. Vertical Support Pillar (Polished Chrome Steel)
    const poleGeo = new THREE.CylinderGeometry(0.18, 0.18, 8.5, 20);
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.2,
      metalness: 0.9,
    });
    const pole = new THREE.Mesh(poleGeo, steelMat);
    pole.position.set(-1.2, 4.25, 0);
    pole.castShadow = !isSoftwareGl;
    this.standGroup.add(pole);

    // 3. Horizontal Cantilever Arm
    const armGeo = new THREE.BoxGeometry(2.4, 0.3, 0.3);
    const arm = new THREE.Mesh(armGeo, ironMat);
    arm.position.set(-0.2, 8.2, 0);
    this.standGroup.add(arm);

    // 4. Pivot Clamp & Bearing Housing with degree dial
    const clampGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.9,
    });
    const clamp = new THREE.Mesh(clampGeo, brassMat);
    clamp.rotation.x = Math.PI / 2;
    clamp.position.set(0.8, 8.2, 0);
    this.standGroup.add(clamp);

    // Degree scale semi-circle
    const dialGeo = new THREE.RingGeometry(0.7, 1.4, 32, 1, 0, Math.PI);
    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      side: THREE.DoubleSide,
      roughness: 0.5,
    });
    const dial = new THREE.Mesh(dialGeo, dialMat);
    dial.position.set(0.8, 8.2, 0.35);
    this.standGroup.add(dial);

    // 5. Contact shadow
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(256),
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    this.standGroup.add(shadow);

    // 6. Equilibrium reference dashed line
    const eqPoints = [new THREE.Vector3(0.8, 8.2, 0), new THREE.Vector3(0.8, 2.0, 0)];
    const eqGeo = new THREE.BufferGeometry().setFromPoints(eqPoints);
    const eqMat = new THREE.LineDashedMaterial({
      color: 0x475569,
      dashSize: 0.3,
      gapSize: 0.2,
    });
    this.eqDashedLine = new THREE.Line(eqGeo, eqMat);
    this.eqDashedLine.computeLineDistances();
    this.standGroup.add(this.eqDashedLine);

    this.scene.add(this.standGroup);
  }

  private buildPendulumMechanism() {
    // Pivot at (0.8, 8.2, 0)
    this.swingGroup.position.set(0.8, 8.2, 0);

    // High-tensile string
    const stringGeo = new THREE.CylinderGeometry(0.02, 0.02, this.state.length * 2, 8);
    const stringMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    this.stringMesh = new THREE.Mesh(stringGeo, stringMat);
    this.stringMesh.position.y = -(this.state.length * 2) / 2;
    this.swingGroup.add(this.stringMesh);

    // Turned Solid Brass Bob
    const bobGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const brassBobMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.22,
    });
    this.bobMesh = new THREE.Mesh(bobGeo, brassBobMat);
    this.bobMesh.castShadow = !isSoftwareGl;
    this.bobMesh.position.y = -this.state.length * 2;
    this.swingGroup.add(this.bobMesh);

    // Accent equator ring on bob
    const accentGeo = new THREE.TorusGeometry(0.52, 0.04, 12, 32);
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.8 });
    const accent = new THREE.Mesh(accentGeo, accentMat);
    accent.rotation.x = Math.PI / 2;
    accent.position.y = -this.state.length * 2;
    this.swingGroup.add(accent);

    this.scene.add(this.swingGroup);
  }

  public setParameters(params: Partial<PendulumLabState>) {
    Object.assign(this.state, params);

    if (params.initialAngle !== undefined) {
      this.state.currentAngle = (params.initialAngle * Math.PI) / 180;
      this.state.angularVelocity = 0;
    }

    if (params.length !== undefined) {
      const visualLength = this.state.length * 2;
      this.stringMesh.scale.set(1, visualLength / 3.6, 1);
      this.stringMesh.position.y = -visualLength / 2;
      this.bobMesh.position.y = -visualLength;
    }
  }

  public reset() {
    this.state.currentAngle = (this.state.initialAngle * Math.PI) / 180;
    this.state.angularVelocity = 0;
    this.state.isPlaying = true;
  }

  public togglePlay() {
    this.state.isPlaying = !this.state.isPlaying;
  }

  private updateVectors(theta: number) {
    this.vectorGroup.clear();

    const visualLength = this.state.length * 2;
    const bobX = 0.8 + visualLength * Math.sin(theta);
    const bobY = 8.2 - visualLength * Math.cos(theta);
    const origin = new THREE.Vector3(bobX, bobY, 0);

    // 1. Gravity Vector (Downwards - Purple)
    const gDir = new THREE.Vector3(0, -1, 0);
    const gArrow = new THREE.ArrowHelper(gDir, origin, 1.8, 0xa855f7, 0.35, 0.2);
    this.vectorGroup.add(gArrow);

    // 2. Tension Vector (Along string towards pivot - Cyan)
    const pivot = new THREE.Vector3(0.8, 8.2, 0);
    const tensionDir = pivot.clone().sub(origin).normalize();
    const tensionArrow = new THREE.ArrowHelper(tensionDir, origin, 2.2, 0x06b6d4, 0.35, 0.2);
    this.vectorGroup.add(tensionArrow);

    // 3. Restoring Force (Tangential - Amber)
    if (Math.abs(theta) > 0.02) {
      const tangentDir = new THREE.Vector3(-Math.cos(theta), -Math.sin(theta), 0).normalize();
      if (theta > 0) tangentDir.negate();
      const restoringMag = Math.min(Math.abs(Math.sin(theta)) * 2.5, 2.5);
      const restoringArrow = new THREE.ArrowHelper(tangentDir, origin, restoringMag, 0xf59e0b, 0.3, 0.18);
      this.vectorGroup.add(restoringArrow);
    }
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

      if (this.state.isPlaying) {
        // Runge-Kutta 4th order or Semi-Implicit Euler for stable pendulum simulation
        // theta'' = -(g/L)*sin(theta) - damping*theta'
        const alpha = -(this.state.gravity / this.state.length) * Math.sin(this.state.currentAngle) - this.state.damping * this.state.angularVelocity;
        this.state.angularVelocity += alpha * dt;
        this.state.currentAngle += this.state.angularVelocity * dt;

        this.swingGroup.rotation.z = -this.state.currentAngle;
        this.updateVectors(this.state.currentAngle);

        const theoreticalPeriod = calculatePendulumPeriod(this.state.length, this.state.gravity);
        const linearVelocity = this.state.angularVelocity * this.state.length;
        const height = this.state.length * (1 - Math.cos(this.state.currentAngle));
        const energies = calculateMechanicalEnergy(
          this.state.mass,
          linearVelocity,
          height,
          this.state.gravity
        );

        if (this.onStateUpdate) {
          this.onStateUpdate(this.state, {
            theoreticalPeriod,
            linearVelocity: Number(linearVelocity.toFixed(2)),
            currentAngleDeg: Number(((this.state.currentAngle * 180) / Math.PI).toFixed(1)),
            ...energies,
          });
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
