import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createPbrRenderer,
  setupStudioLighting,
  createContactShadowTexture,
  createLaboratoryFloor,
  isSoftwareGl,
} from '../threeUtils';
import { calculateProjectileMetrics, getProjectilePositionAt } from '../../../physics/math';

export interface ProjectileLabState {
  velocity: number;
  angle: number;
  gravity: number;
  airResistance: boolean;
  isPlaying: boolean;
  elapsedTime: number;
  hasLanded: boolean;
  targetDistance: number;
}

export class ProjectileScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  // Scene objects
  private cannonGroup: THREE.Group = new THREE.Group();
  private barrelGroup: THREE.Group = new THREE.Group();
  private projectileMesh: THREE.Mesh;
  private trajectoryLine: THREE.Line;
  private targetGroup: THREE.Group = new THREE.Group();
  private vectorArrowGroup: THREE.Group = new THREE.Group();

  // State
  public state: ProjectileLabState = {
    velocity: 24,
    angle: 45,
    gravity: 9.8,
    airResistance: false,
    isPlaying: false,
    elapsedTime: 0,
    hasLanded: false,
    targetDistance: 45,
  };

  public onStateUpdate?: (state: ProjectileLabState, metrics: any) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = createPbrRenderer(canvas);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);

    const aspect = (canvas.clientWidth || window.innerWidth) / Math.max(canvas.clientHeight || (window.innerHeight - 64), 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 250);
    this.camera.position.set(22, 14, 38);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = !isSoftwareGl;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(22, 6, 0);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.update();

    setupStudioLighting(this.scene, this.renderer);
    this.scene.add(createLaboratoryFloor(80));

    // Build procedural 3D Cannon assembly (10 distinct parts)
    this.buildProceduralCannon();

    // Build Projectile ball
    const ballGeo = new THREE.SphereGeometry(0.4, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    });
    this.projectileMesh = new THREE.Mesh(ballGeo, ballMat);
    this.projectileMesh.castShadow = !isSoftwareGl;
    this.projectileMesh.visible = false;
    this.scene.add(this.projectileMesh);

    // Build Trajectory guide line with bright visible material
    const trajGeo = new THREE.BufferGeometry();
    const trajMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 3,
    });
    this.trajectoryLine = new THREE.Line(trajGeo, trajMat);
    this.scene.add(this.trajectoryLine);

    // Build target apparatus
    this.buildTarget(this.state.targetDistance);

    // Build Vector Arrows
    this.scene.add(this.vectorArrowGroup);

    this.updateCannonRotation();
    this.updateTrajectoryPrediction();

    this.startLoop();
  }

  private buildProceduralCannon() {
    // 1. Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.4, 32);
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.85,
    });
    const baseMesh = new THREE.Mesh(baseGeo, ironMat);
    baseMesh.position.y = 0.2;
    baseMesh.receiveShadow = !isSoftwareGl;
    baseMesh.castShadow = !isSoftwareGl;
    this.cannonGroup.add(baseMesh);

    // 2. Turntable dial ring with brass accents
    const dialGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.15, 32);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.9,
    });
    const dialMesh = new THREE.Mesh(dialGeo, brassMat);
    dialMesh.position.y = 0.45;
    this.cannonGroup.add(dialMesh);

    // 3. Left Stanchion / bracket
    const stanchionGeo = new THREE.BoxGeometry(0.5, 2.2, 1.2);
    const leftStanchion = new THREE.Mesh(stanchionGeo, ironMat);
    leftStanchion.position.set(0, 1.5, 1.0);
    leftStanchion.castShadow = !isSoftwareGl;
    this.cannonGroup.add(leftStanchion);

    // 4. Right Stanchion / bracket
    const rightStanchion = new THREE.Mesh(stanchionGeo, ironMat);
    rightStanchion.position.set(0, 1.5, -1.0);
    rightStanchion.castShadow = !isSoftwareGl;
    this.cannonGroup.add(rightStanchion);

    // 5. Trunnion pivot bushings
    const bushingGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.6, 16);
    const bushingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.95,
    });
    const bushing = new THREE.Mesh(bushingGeo, bushingMat);
    bushing.rotation.x = Math.PI / 2;
    bushing.position.set(0, 2.1, 0);
    this.cannonGroup.add(bushing);

    // 6. Elevation handwheel on side
    const wheelGeo = new THREE.TorusGeometry(0.4, 0.08, 12, 24);
    const wheel = new THREE.Mesh(wheelGeo, brassMat);
    wheel.position.set(0, 2.1, 1.35);
    wheel.rotation.y = Math.PI / 2;
    this.cannonGroup.add(wheel);

    // --- Barrel Assembly (pivots with elevation angle) ---
    this.barrelGroup.position.set(0, 2.1, 0);

    // 7. Main tapered barrel
    const barrelGeo = new THREE.CylinderGeometry(0.45, 0.65, 3.8, 28);
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.85,
    });
    const mainBarrel = new THREE.Mesh(barrelGeo, steelMat);
    // Cylinder by default extends along Y. We rotate it so it points along +X
    mainBarrel.rotation.z = -Math.PI / 2;
    mainBarrel.position.x = 1.6;
    mainBarrel.castShadow = !isSoftwareGl;
    this.barrelGroup.add(mainBarrel);

    // 8. Reinforcement rings
    const ringGeo = new THREE.TorusGeometry(0.62, 0.09, 12, 24);
    const ring1 = new THREE.Mesh(ringGeo, brassMat);
    ring1.rotation.y = Math.PI / 2;
    ring1.position.x = 0.6;
    this.barrelGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, brassMat);
    ring2.rotation.y = Math.PI / 2;
    ring2.position.x = 2.4;
    this.barrelGroup.add(ring2);

    // 9. Flared muzzle collar
    const muzzleGeo = new THREE.CylinderGeometry(0.55, 0.46, 0.4, 24);
    const muzzle = new THREE.Mesh(muzzleGeo, brassMat);
    muzzle.rotation.z = -Math.PI / 2;
    muzzle.position.x = 3.4;
    this.barrelGroup.add(muzzle);

    // 10. Contact Shadow plane beneath cannon
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(256),
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    this.cannonGroup.add(shadowMesh);

    this.cannonGroup.add(this.barrelGroup);
    this.cannonGroup.position.set(0, 0, 0);
    this.scene.add(this.cannonGroup);
  }

  private buildTarget(distance: number) {
    this.targetGroup.clear();

    // Target Stand base
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 24);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8,
      metalness: 0.5,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.1;
    this.targetGroup.add(base);

    // Concentric Bullseye Rings (Outer Red, Mid White, Inner Red, Yellow Center)
    const bullseyeGeo = new THREE.RingGeometry(0.1, 1.5, 32);
    const bullseyeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.5,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const bullseye = new THREE.Mesh(bullseyeGeo, bullseyeMat);
    bullseye.rotation.x = -Math.PI / 2;
    bullseye.position.y = 0.22;
    this.targetGroup.add(bullseye);

    const innerRingGeo = new THREE.RingGeometry(0.1, 0.9, 32);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.23;
    this.targetGroup.add(innerRing);

    const centerBullGeo = new THREE.CircleGeometry(0.35, 32);
    const centerBullMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const centerBull = new THREE.Mesh(centerBullGeo, centerBullMat);
    centerBull.rotation.x = -Math.PI / 2;
    centerBull.position.y = 0.24;
    this.targetGroup.add(centerBull);

    // Flag mast
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.5, 12);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.3,
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 1.85, 0);
    this.targetGroup.add(pole);

    // Pennant Flag
    const flagGeo = new THREE.PlaneGeometry(0.9, 0.6);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      roughness: 0.6,
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.45, 3.3, 0);
    this.targetGroup.add(flag);

    this.targetGroup.position.set(distance, 0, 0);
    this.scene.add(this.targetGroup);
  }

  public setTargetDistance(distance: number) {
    this.state.targetDistance = Math.max(5, Math.min(80, distance));
    this.targetGroup.position.x = this.state.targetDistance;
  }

  private updateCannonRotation() {
    const angleRad = (this.state.angle * Math.PI) / 180;
    this.barrelGroup.rotation.z = angleRad;
  }

  public updateTrajectoryPrediction() {
    this.updateCannonRotation();

    const metrics = calculateProjectileMetrics({
      initialVelocity: this.state.velocity,
      angleDegrees: this.state.angle,
      gravity: this.state.gravity,
      initialHeight: 2.1,
    });

    // Compute 60 points along the predicted arc
    const points: THREE.Vector3[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (metrics.timeOfFlight * i) / steps;
      const pos = getProjectilePositionAt(
        {
          initialVelocity: this.state.velocity,
          angleDegrees: this.state.angle,
          gravity: this.state.gravity,
          initialHeight: 2.1,
        },
        t
      );
      points.push(new THREE.Vector3(pos.x, pos.y, 0));
    }

    this.trajectoryLine.geometry.dispose();
    this.trajectoryLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.trajectoryLine.computeLineDistances();

    if (this.onStateUpdate) {
      this.onStateUpdate(this.state, metrics);
    }
  }

  public fire() {
    this.state.isPlaying = true;
    this.state.elapsedTime = 0;
    this.state.hasLanded = false;
    this.projectileMesh.visible = true;
    this.updateTrajectoryPrediction();
  }

  public reset() {
    this.state.isPlaying = false;
    this.state.elapsedTime = 0;
    this.state.hasLanded = false;
    this.projectileMesh.visible = false;
    this.vectorArrowGroup.clear();
    this.updateTrajectoryPrediction();
  }

  public setParameters(params: Partial<ProjectileLabState>) {
    Object.assign(this.state, params);
    this.updateTrajectoryPrediction();
  }

  public setCameraPreset(preset: 'default' | 'side' | 'top' | 'target') {
    switch (preset) {
      case 'default':
        this.camera.position.set(22, 16, 32);
        this.controls.target.set(18, 4, 0);
        break;
      case 'side':
        this.camera.position.set(22, 10, 48);
        this.controls.target.set(22, 6, 0);
        break;
      case 'top':
        this.camera.position.set(25, 45, 0.1);
        this.controls.target.set(25, 0, 0);
        break;
      case 'target':
        this.camera.position.set(this.state.targetDistance - 8, 5, 8);
        this.controls.target.set(this.state.targetDistance, 1, 0);
        break;
    }
    this.controls.update();
  }

  private updateVectors(pos: { x: number; y: number; vx: number; vy: number }) {
    this.vectorArrowGroup.clear();

    const origin = new THREE.Vector3(pos.x, pos.y, 0);

    // Total Velocity Vector (Amber/Orange)
    const vel = new THREE.Vector3(pos.vx, pos.vy, 0);
    const speed = vel.length();
    if (speed > 0.1) {
      const velArrow = new THREE.ArrowHelper(
        vel.clone().normalize(),
        origin,
        Math.min(speed * 0.2, 5),
        0xf59e0b,
        0.5,
        0.3
      );
      this.vectorArrowGroup.add(velArrow);
    }

    // Horizontal vx Vector (Cyan)
    const vxDir = new THREE.Vector3(1, 0, 0);
    const vxArrow = new THREE.ArrowHelper(vxDir, origin, pos.vx * 0.15, 0x06b6d4, 0.4, 0.25);
    this.vectorArrowGroup.add(vxArrow);

    // Vertical vy Vector (Green/Red)
    if (Math.abs(pos.vy) > 0.1) {
      const vyDir = new THREE.Vector3(0, pos.vy >= 0 ? 1 : -1, 0);
      const vyArrow = new THREE.ArrowHelper(
        vyDir,
        origin,
        Math.abs(pos.vy) * 0.15,
        pos.vy >= 0 ? 0x10b981 : 0xef4444,
        0.4,
        0.25
      );
      this.vectorArrowGroup.add(vyArrow);
    }

    // Gravity vector downwards (Purple)
    const gArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      origin,
      Math.min(this.state.gravity * 0.2, 3),
      0xa855f7,
      0.35,
      0.2
    );
    this.vectorArrowGroup.add(gArrow);
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
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (this.state.isPlaying && !this.state.hasLanded) {
        this.state.elapsedTime += dt;

        const metrics = calculateProjectileMetrics({
          initialVelocity: this.state.velocity,
          angleDegrees: this.state.angle,
          gravity: this.state.gravity,
          initialHeight: 2.1,
        });

        if (this.state.elapsedTime >= metrics.timeOfFlight) {
          this.state.elapsedTime = metrics.timeOfFlight;
          this.state.hasLanded = true;
          this.state.isPlaying = false;
        }

        const pos = getProjectilePositionAt(
          {
            initialVelocity: this.state.velocity,
            angleDegrees: this.state.angle,
            gravity: this.state.gravity,
            initialHeight: 2.1,
          },
          this.state.elapsedTime
        );

        this.projectileMesh.position.set(pos.x, pos.y, 0);
        this.updateVectors(pos);

        if (this.onStateUpdate) {
          this.onStateUpdate(this.state, metrics);
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
