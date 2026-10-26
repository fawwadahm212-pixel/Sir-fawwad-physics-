import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createPbrRenderer,
  setupStudioLighting,
  createContactShadowTexture,
  createLaboratoryFloor,
  isSoftwareGl,
} from '../threeUtils';
import { calculateRefractionAngle } from '../../../physics/math';

export interface OpticsLabState {
  incidentAngle: number; // degrees
  n1: number; // medium 1 refractive index
  n2: number; // medium 2 refractive index
  medium1Name: string;
  medium2Name: string;
  laserWavelength: 'red' | 'green';
  showNormalLine: boolean;
  prismShape: 'block' | 'prism';
}

export class OpticsScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  // Scene groups
  private benchGroup: THREE.Group = new THREE.Group();
  private laserGroup: THREE.Group = new THREE.Group();
  private sampleMesh!: THREE.Mesh;
  private raysGroup: THREE.Group = new THREE.Group();
  private normalLineGroup: THREE.Group = new THREE.Group();
  private stageGroup: THREE.Group = new THREE.Group();

  public state: OpticsLabState = {
    incidentAngle: 35,
    n1: 1.0, // Air
    n2: 1.52, // Crown Glass
    medium1Name: 'Air (n=1.00)',
    medium2Name: 'Crown Glass (n=1.52)',
    laserWavelength: 'red',
    showNormalLine: true,
    prismShape: 'block',
  };

  public onStateUpdate?: (state: OpticsLabState, result: any) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = createPbrRenderer(canvas);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);

    const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 16, 24);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = !isSoftwareGl;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 2.5, 0);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.update();

    setupStudioLighting(this.scene, this.renderer);
    this.scene.add(createLaboratoryFloor(50));

    this.buildOpticalBench();
    this.buildSampleMedium();
    this.scene.add(this.raysGroup);
    this.scene.add(this.normalLineGroup);

    this.updateOpticalSimulation();
    this.startLoop();
  }

  private buildOpticalBench() {
    // 1. Triangular Optical Rail (aluminum extrusion profile)
    const railGeo = new THREE.BoxGeometry(22, 0.6, 1.8);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.85,
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.y = 1.0;
    rail.castShadow = !isSoftwareGl;
    rail.receiveShadow = !isSoftwareGl;
    this.benchGroup.add(rail);

    // 2. Heavy support feet on left & right
    const footGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.7, 16);
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.6,
    });
    const footLeft = new THREE.Mesh(footGeo, ironMat);
    footLeft.position.set(-8.5, 0.35, 0);
    this.benchGroup.add(footLeft);

    const footRight = new THREE.Mesh(footGeo, ironMat);
    footRight.position.set(8.5, 0.35, 0);
    this.benchGroup.add(footRight);

    // 3. Central Rotatable Protractor Stage
    const stageBaseGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.3, 36);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.4,
      metalness: 0.85,
    });
    const stageBase = new THREE.Mesh(stageBaseGeo, brassMat);
    stageBase.position.y = 1.45;
    this.stageGroup.add(stageBase);

    // Protractor ring with degrees markings
    const ringGeo = new THREE.RingGeometry(2.8, 4.1, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 1.61;
    this.stageGroup.add(ring);

    this.benchGroup.add(this.stageGroup);

    // 4. Laser Emitter Assembly
    this.buildLaserEmitter();

    // 5. Contact shadow
    const shadowGeo = new THREE.PlaneGeometry(24, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(256),
      transparent: true,
      depthWrite: false,
      opacity: 0.6,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    this.benchGroup.add(shadow);

    this.scene.add(this.benchGroup);
  }

  private buildLaserEmitter() {
    this.laserGroup.position.set(-7, 2.8, 0);

    // Emitter body
    const bodyGeo = new THREE.BoxGeometry(2.5, 1.2, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.8,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = !isSoftwareGl;
    this.laserGroup.add(body);

    // Heat sink cooling fins
    const finMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    for (let i = -0.8; i <= 0.8; i += 0.4) {
      const finGeo = new THREE.BoxGeometry(0.08, 1.4, 1.35);
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.x = i;
      this.laserGroup.add(fin);
    }

    // Brass laser aperture
    const nozzGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.6, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.2 });
    const nozz = new THREE.Mesh(nozzGeo, brassMat);
    nozz.rotation.z = -Math.PI / 2;
    nozz.position.x = 1.5;
    this.laserGroup.add(nozz);

    // Vertical mounting clamp
    const clampGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.8, 12);
    const clampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const clamp = new THREE.Mesh(clampGeo, clampMat);
    clamp.position.y = -1.2;
    this.laserGroup.add(clamp);

    this.scene.add(this.laserGroup);
  }

  private buildSampleMedium() {
    // Semi-circular or rectangular glass block
    const shapeGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.2, 32, 1, false, 0, Math.PI);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: isSoftwareGl ? 0 : 0.92,
      opacity: isSoftwareGl ? 0.45 : 1,
      transparent: true,
      ior: this.state.n2,
      roughness: 0.04,
      metalness: 0.05,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0xdbeafe),
      attenuationDistance: 4.0,
    });

    this.sampleMesh = new THREE.Mesh(shapeGeo, glassMat);
    this.sampleMesh.rotation.y = -Math.PI / 2;
    this.sampleMesh.position.set(0, 2.2, 0);
    this.scene.add(this.sampleMesh);
  }

  public updateOpticalSimulation() {
    const { incidentAngle, n1, n2, laserWavelength, showNormalLine } = this.state;
    const result = calculateRefractionAngle(n1, n2, incidentAngle);

    // Update glass material IOR
    if (this.sampleMesh && this.sampleMesh.material instanceof THREE.MeshPhysicalMaterial) {
      this.sampleMesh.material.ior = n2;
      this.sampleMesh.material.needsUpdate = true;
    }

    // Laser Beam Color
    const beamColor = laserWavelength === 'red' ? 0xef4444 : 0x10b981;

    // Reposition laser emitter along a circular arc matching incident angle
    const radius = 7;
    const theta1Rad = (incidentAngle * Math.PI) / 180;
    // Incident ray hits interface at (0, 2.2, 0)
    const laserX = -radius * Math.sin(theta1Rad);
    const laserZ = radius * Math.cos(theta1Rad);
    this.laserGroup.position.set(laserX, 2.2, laserZ);
    this.laserGroup.lookAt(0, 2.2, 0);

    // Clear previous rays
    this.raysGroup.clear();
    this.normalLineGroup.clear();

    // 1. Incident Ray Line
    const incPoints = [new THREE.Vector3(laserX, 2.2, laserZ), new THREE.Vector3(0, 2.2, 0)];
    const incGeo = new THREE.BufferGeometry().setFromPoints(incPoints);
    const incMat = new THREE.LineBasicMaterial({ color: beamColor, linewidth: 3 });
    const incLine = new THREE.Line(incGeo, incMat);
    this.raysGroup.add(incLine);

    // 2. Reflected Ray (Always exists according to Fresnel reflections)
    // Reflected angle equals incident angle
    const reflX = radius * Math.sin(theta1Rad);
    const reflZ = radius * Math.cos(theta1Rad);
    const reflPoints = [new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(reflX, 2.2, reflZ)];
    const reflGeo = new THREE.BufferGeometry().setFromPoints(reflPoints);
    const reflMat = new THREE.LineBasicMaterial({
      color: beamColor,
      transparent: true,
      opacity: result.isTotalInternalReflection ? 1.0 : 0.35,
      linewidth: result.isTotalInternalReflection ? 3 : 1.5,
    });
    const reflLine = new THREE.Line(reflGeo, reflMat);
    this.raysGroup.add(reflLine);

    // 3. Refracted Ray (if not Total Internal Reflection)
    if (!result.isTotalInternalReflection && result.refractedAngle !== null) {
      const theta2Rad = (result.refractedAngle * Math.PI) / 180;
      const refrX = radius * 0.7 * Math.sin(theta2Rad);
      const refrZ = -radius * 0.7 * Math.cos(theta2Rad);
      const refrPoints = [new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(refrX, 2.2, refrZ)];
      const refrGeo = new THREE.BufferGeometry().setFromPoints(refrPoints);
      const refrMat = new THREE.LineBasicMaterial({
        color: beamColor,
        linewidth: 2.5,
      });
      const refrLine = new THREE.Line(refrGeo, refrMat);
      this.raysGroup.add(refrLine);
    }

    // 4. Normal line (perpendicular to interface: along Z axis at origin)
    if (showNormalLine) {
      const normalPoints = [new THREE.Vector3(0, 2.2, 5.5), new THREE.Vector3(0, 2.2, -5.5)];
      const normalGeo = new THREE.BufferGeometry().setFromPoints(normalPoints);
      const normalMat = new THREE.LineDashedMaterial({
        color: 0x94a3b8,
        dashSize: 0.3,
        gapSize: 0.15,
        linewidth: 1.5,
      });
      const normalLine = new THREE.Line(normalGeo, normalMat);
      normalLine.computeLineDistances();
      this.normalLineGroup.add(normalLine);
    }

    if (this.onStateUpdate) {
      this.onStateUpdate(this.state, result);
    }
  }

  public setParameters(params: Partial<OpticsLabState>) {
    Object.assign(this.state, params);
    this.updateOpticalSimulation();
  }

  public setMedium(mediumName: string, index: number) {
    this.state.n2 = index;
    this.state.medium2Name = `${mediumName} (n=${index.toFixed(2)})`;
    this.updateOpticalSimulation();
  }

  public setCameraPreset(preset: 'perspective' | 'top' | 'close') {
    switch (preset) {
      case 'perspective':
        this.camera.position.set(0, 16, 24);
        this.controls.target.set(0, 2.5, 0);
        break;
      case 'top':
        this.camera.position.set(0, 25, 0.1);
        this.controls.target.set(0, 2.2, 0);
        break;
      case 'close':
        this.camera.position.set(-4, 6, 8);
        this.controls.target.set(0, 2.2, 0);
        break;
    }
    this.controls.update();
  }

  private startLoop() {
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
