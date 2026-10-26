import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const isSoftwareGl = (() => {
  if (typeof document === 'undefined') return true;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
})();

export function createPbrRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
    alpha: false,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const w = canvas.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
  const h = canvas.clientHeight || (typeof window !== 'undefined' ? window.innerHeight - 64 : 720);
  renderer.setSize(w, h, false);

  return renderer;
}

export function setupStudioLighting(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void {
  // Studio Environment Map via PMREMGenerator
  try {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();
  } catch (err) {
    console.warn('RoomEnvironment generation fallback', err);
  }

  // Warm Directional Key Light
  const keyLight = new THREE.DirectionalLight(0xfffaed, 3.0);
  keyLight.position.set(15, 25, 20);
  keyLight.castShadow = !isSoftwareGl;
  scene.add(keyLight);

  // Cool Hemisphere Fill Light
  const hemiLight = new THREE.HemisphereLight(0xcfd8dc, 0x1e293b, 2.0);
  scene.add(hemiLight);

  // Soft Ambient Fill Light
  const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambLight);

  // Gentle distance fog that does NOT darken the foreground apparatus
  scene.fog = new THREE.Fog(0x090d16, 45, 160);
}

/**
 * Creates a soft radial contact shadow texture procedurally
 */
export function createContactShadowTexture(size: number = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.05,
    size / 2,
    size / 2,
    size * 0.48
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.4)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural laboratory floor with calibrated grid markings
 */
export function createLaboratoryFloor(size: number = 60): THREE.Group {
  const floorGroup = new THREE.Group();

  // Subtle dark studio base floor
  const floorGeo = new THREE.PlaneGeometry(size, size);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.85,
    metalness: 0.2,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = !isSoftwareGl;
  floorGroup.add(floorMesh);

  // Precision measurement grid
  const gridHelper = new THREE.GridHelper(size, 60, 0x38bdf8, 0x1e293b);
  gridHelper.position.y = 0.005; // avoid z-fighting
  floorGroup.add(gridHelper);

  return floorGroup;
}
