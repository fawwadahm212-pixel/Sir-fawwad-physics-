/**
 * Pure physics calculations and mathematical formulas for high school physics
 * Decoupled from UI and Three.js rendering for testability and accuracy.
 */

export interface ProjectileParams {
  initialVelocity: number; // m/s
  angleDegrees: number; // degrees
  gravity: number; // m/s^2
  initialHeight?: number; // meters
}

export interface ProjectileMetrics {
  timeOfFlight: number; // seconds
  maxHeight: number; // meters
  horizontalRange: number; // meters
  finalVelocity: number; // m/s
}

/**
 * Calculate projectile motion trajectory metrics
 */
export function calculateProjectileMetrics(params: ProjectileParams): ProjectileMetrics {
  const { initialVelocity, angleDegrees, gravity, initialHeight = 0 } = params;
  if (gravity <= 0) throw new Error('Gravity must be positive');
  if (initialVelocity < 0) throw new Error('Initial velocity cannot be negative');

  const angleRad = (angleDegrees * Math.PI) / 180;
  const v0x = initialVelocity * Math.cos(angleRad);
  const v0y = initialVelocity * Math.sin(angleRad);

  // Vertical displacement: y = y0 + v0y*t - 0.5*g*t^2 = 0
  // 0.5*g*t^2 - v0y*t - y0 = 0
  const discriminant = v0y * v0y + 2 * gravity * initialHeight;
  const timeOfFlight = (v0y + Math.sqrt(Math.max(0, discriminant))) / gravity;

  // Max height above ground: y_max = y0 + (v0y^2) / (2*g)
  const maxHeight = initialHeight + (v0y * v0y) / (2 * gravity);

  // Horizontal range: x = v0x * t
  const horizontalRange = v0x * timeOfFlight;

  // Final vertical velocity: vy = v0y - g*t
  const vyFinal = v0y - gravity * timeOfFlight;
  const finalVelocity = Math.sqrt(v0x * v0x + vyFinal * vyFinal);

  return {
    timeOfFlight: Number(timeOfFlight.toFixed(2)),
    maxHeight: Number(maxHeight.toFixed(2)),
    horizontalRange: Number(horizontalRange.toFixed(2)),
    finalVelocity: Number(finalVelocity.toFixed(2)),
  };
}

/**
 * Get position (x, y) of projectile at elapsed time t
 */
export function getProjectilePositionAt(params: ProjectileParams, t: number): { x: number; y: number; vx: number; vy: number } {
  const { initialVelocity, angleDegrees, gravity, initialHeight = 0 } = params;
  const angleRad = (angleDegrees * Math.PI) / 180;
  const v0x = initialVelocity * Math.cos(angleRad);
  const v0y = initialVelocity * Math.sin(angleRad);

  const x = v0x * t;
  const y = Math.max(0, initialHeight + v0y * t - 0.5 * gravity * t * t);
  const vx = v0x;
  const vy = v0y - gravity * t;

  return { x, y, vx, vy };
}

/**
 * Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
 * Returns refracted angle in degrees, or null if total internal reflection occurs
 */
export function calculateRefractionAngle(
  n1: number,
  n2: number,
  incidentAngleDegrees: number
): { refractedAngle: number | null; isTotalInternalReflection: boolean; criticalAngle: number | null } {
  if (n1 <= 0 || n2 <= 0) throw new Error('Refractive indices must be positive');

  const theta1Rad = (incidentAngleDegrees * Math.PI) / 180;
  const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);

  let criticalAngle: number | null = null;
  if (n1 > n2) {
    criticalAngle = Number(((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(2));
  }

  if (sinTheta2 > 1.0) {
    return {
      refractedAngle: null,
      isTotalInternalReflection: true,
      criticalAngle,
    };
  }

  const theta2Rad = Math.asin(sinTheta2);
  const refractedAngle = Number(((theta2Rad * 180) / Math.PI).toFixed(2));

  return {
    refractedAngle,
    isTotalInternalReflection: false,
    criticalAngle,
  };
}

/**
 * Simple Harmonic Motion Pendulum Period
 * T = 2 * pi * sqrt(L / g)
 */
export function calculatePendulumPeriod(lengthMeters: number, gravity: number): number {
  if (lengthMeters <= 0 || gravity <= 0) throw new Error('Length and gravity must be positive');
  const period = 2 * Math.PI * Math.sqrt(lengthMeters / gravity);
  return Number(period.toFixed(3));
}

/**
 * Mechanical Energy Calculations
 */
export function calculateMechanicalEnergy(
  massKg: number,
  velocityMs: number,
  heightMeters: number,
  gravity: number = 9.8
): { kineticEnergy: number; potentialEnergy: number; totalEnergy: number } {
  if (massKg < 0) throw new Error('Mass cannot be negative');
  const ke = 0.5 * massKg * velocityMs * velocityMs;
  const pe = massKg * gravity * heightMeters;
  return {
    kineticEnergy: Number(ke.toFixed(2)),
    potentialEnergy: Number(pe.toFixed(2)),
    totalEnergy: Number((ke + pe).toFixed(2)),
  };
}

/**
 * Lorentz Force deflection radius of a charged particle in a magnetic field
 * r = (m * v) / (|q| * B)
 */
export function calculateCyclotronRadius(
  massKg: number,
  velocityMs: number,
  chargeCoulombs: number,
  bFieldTesla: number
): number {
  const q = Math.abs(chargeCoulombs);
  if (q === 0 || bFieldTesla === 0) return Infinity;
  const radius = (massKg * velocityMs) / (q * bFieldTesla);
  return Number(radius.toFixed(4));
}
