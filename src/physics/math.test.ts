import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProjectileMetrics,
  getProjectilePositionAt,
  calculateRefractionAngle,
  calculatePendulumPeriod,
  calculateMechanicalEnergy,
  calculateCyclotronRadius,
} from './math';

test('Projectile Metrics: 45 degree launch at 20 m/s on Earth (g=9.8)', () => {
  const metrics = calculateProjectileMetrics({
    initialVelocity: 20,
    angleDegrees: 45,
    gravity: 9.8,
  });

  // Range for 45 deg = v^2 / g = 400 / 9.8 ≈ 40.82m
  assert.ok(Math.abs(metrics.horizontalRange - 40.82) < 0.1);
  // Time of flight = 2 * v0y / g = 2 * (20 * sin(45)) / 9.8 ≈ 2.89s
  assert.ok(Math.abs(metrics.timeOfFlight - 2.89) < 0.1);
  // Max height = v0y^2 / (2*g) = (200) / 19.6 ≈ 10.20m
  assert.ok(Math.abs(metrics.maxHeight - 10.2) < 0.1);
});

test('Projectile Position: reaches ground after time of flight', () => {
  const params = { initialVelocity: 25, angleDegrees: 60, gravity: 9.8 };
  const metrics = calculateProjectileMetrics(params);
  const posAtEnd = getProjectilePositionAt(params, metrics.timeOfFlight);
  assert.ok(posAtEnd.y <= 0.05);
});

test('Snell\'s Law: Air to Glass (n1=1.0, n2=1.5, angle=30°)', () => {
  const result = calculateRefractionAngle(1.0, 1.5, 30);
  assert.equal(result.isTotalInternalReflection, false);
  // 1.0 * sin(30°) = 0.5. sin(theta2) = 0.5 / 1.5 = 1/3 ≈ 0.3333. asin(1/3) ≈ 19.47°
  assert.ok(Math.abs(result.refractedAngle! - 19.47) < 0.1);
});

test('Snell\'s Law: Total Internal Reflection from Glass to Air (n1=1.5, n2=1.0, angle=60°)', () => {
  const result = calculateRefractionAngle(1.5, 1.0, 60);
  assert.equal(result.isTotalInternalReflection, true);
  assert.equal(result.refractedAngle, null);
  // Critical angle = asin(1 / 1.5) ≈ 41.81°
  assert.ok(Math.abs(result.criticalAngle! - 41.81) < 0.1);
});

test('Pendulum Period: 1 meter on Earth (g=9.8)', () => {
  // T = 2 * pi * sqrt(1 / 9.8) ≈ 2.007s
  const period = calculatePendulumPeriod(1.0, 9.8);
  assert.ok(Math.abs(period - 2.007) < 0.02);
});

test('Mechanical Energy Conservation', () => {
  const energy = calculateMechanicalEnergy(2.0, 10.0, 5.0, 9.8);
  // KE = 0.5 * 2 * 100 = 100 J
  // PE = 2 * 9.8 * 5 = 98 J
  // Total = 198 J
  assert.equal(energy.kineticEnergy, 100);
  assert.equal(energy.potentialEnergy, 98);
  assert.equal(energy.totalEnergy, 198);
});

test('Lorentz Deflection Radius', () => {
  // Electron: m = 9.11e-31, q = 1.6e-19, v = 1e6, B = 0.01 T
  const radius = calculateCyclotronRadius(9.11e-31, 1e6, 1.6e-19, 0.01);
  assert.ok(radius > 0);
});
