import React, { useEffect, useRef, useState } from 'react';
import { LabId } from '../../types/physics';
import { ProjectileScene } from './scenes/ProjectileScene';
import { OpticsScene } from './scenes/OpticsScene';
import { PendulumScene } from './scenes/PendulumScene';
import { LorentzScene } from './scenes/LorentzScene';
import { LabDock } from './LabDock';
import { Activity, Target, Zap, Waves, Compass, Info, CheckCircle2 } from 'lucide-react';

interface ThreeLabContainerProps {
  initialLab?: LabId;
  onOpenLessonForLab?: (labId: LabId) => void;
}

export const ThreeLabContainer: React.FC<ThreeLabContainerProps> = ({
  initialLab = 'projectile',
  onOpenLessonForLab,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLab, setActiveLab] = useState<LabId>(initialLab);
  const activeSceneRef = useRef<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [labState, setLabState] = useState<any>(null);

  // Initialize and switch 3D scenes
  useEffect(() => {
    if (!canvasRef.current) return;

    // Clean up any existing scene
    if (activeSceneRef.current) {
      activeSceneRef.current.destroy();
      activeSceneRef.current = null;
    }

    const canvas = canvasRef.current;

    if (activeLab === 'projectile') {
      const scene = new ProjectileScene(canvas);
      scene.onStateUpdate = (state, metrics) => {
        setLabState({ ...state });
        setTelemetry({ ...metrics });
      };
      scene.updateTrajectoryPrediction();
      activeSceneRef.current = scene;
      setLabState({ ...scene.state });
    } else if (activeLab === 'optics') {
      const scene = new OpticsScene(canvas);
      scene.onStateUpdate = (state, result) => {
        setLabState({ ...state });
        setTelemetry({ ...result });
      };
      scene.updateOpticalSimulation();
      activeSceneRef.current = scene;
      setLabState({ ...scene.state });
    } else if (activeLab === 'pendulum') {
      const scene = new PendulumScene(canvas);
      scene.onStateUpdate = (state, metrics) => {
        setLabState({ ...state });
        setTelemetry({ ...metrics });
      };
      activeSceneRef.current = scene;
      setLabState({ ...scene.state });
    } else if (activeLab === 'lorentz') {
      const scene = new LorentzScene(canvas);
      scene.onStateUpdate = (state, metrics) => {
        setLabState({ ...state });
        setTelemetry({ ...metrics });
      };
      scene.updateSimulation();
      activeSceneRef.current = scene;
      setLabState({ ...scene.state });
    }

    const handleResize = () => {
      if (activeSceneRef.current && canvas.parentElement) {
        activeSceneRef.current.resize(
          canvas.parentElement.clientWidth,
          canvas.parentElement.clientHeight
        );
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (activeSceneRef.current) {
        activeSceneRef.current.destroy();
        activeSceneRef.current = null;
      }
    };
  }, [activeLab]);

  // Sync if initialLab prop changes
  useEffect(() => {
    if (initialLab && initialLab !== activeLab) {
      setActiveLab(initialLab);
    }
  }, [initialLab]);

  const handleUpdateParams = (params: any) => {
    if (activeSceneRef.current) {
      activeSceneRef.current.setParameters(params);
      setLabState({ ...activeSceneRef.current.state });
    }
  };

  const handleAction = (action: string) => {
    if (!activeSceneRef.current) return;
    if (activeLab === 'projectile' && action === 'fire') {
      activeSceneRef.current.fire();
    } else if (activeLab === 'pendulum' && action === 'toggle') {
      activeSceneRef.current.togglePlay();
    }
  };

  const handleReset = () => {
    if (activeSceneRef.current) {
      activeSceneRef.current.reset();
      setLabState({ ...activeSceneRef.current.state });
    }
  };

  const handleCameraPreset = (cam: string) => {
    if (activeSceneRef.current?.setCameraPreset) {
      activeSceneRef.current.setCameraPreset(cam);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Mount Container */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Top Left: Lab Switcher Tabs & Live Status */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg">
          <button
            onClick={() => setActiveLab('projectile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLab === 'projectile'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Projectile Lab</span>
          </button>

          <button
            onClick={() => setActiveLab('optics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLab === 'optics'
                ? 'bg-sky-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Optics & Snell's</span>
          </button>

          <button
            onClick={() => setActiveLab('pendulum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLab === 'pendulum'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>SHM Pendulum</span>
          </button>

          <button
            onClick={() => setActiveLab('lorentz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeLab === 'lorentz'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Lorentz Chamber</span>
          </button>
        </div>

        {/* Live Lab Description & Quick Lesson Link */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/85 border border-slate-800 rounded-lg text-xs text-slate-300 max-w-sm">
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">
            {activeLab === 'projectile' && '3D Ballistics: Parabolic motion & vector components'}
            {activeLab === 'optics' && 'Optics Bench: Snell refraction & Total Internal Reflection'}
            {activeLab === 'pendulum' && 'Harmonic Motion: Dynamic energy transformation (KE ↔ PE)'}
            {activeLab === 'lorentz' && 'Electromagnetism: Deflection radius in Helmholtz B-field'}
          </span>
          {onOpenLessonForLab && (
            <button
              onClick={() => onOpenLessonForLab(activeLab)}
              className="ml-auto text-sky-400 hover:text-sky-300 font-semibold underline shrink-0 cursor-pointer"
            >
              Read Notes
            </button>
          )}
        </div>
      </div>

      {/* Top Right: Live Telemetry & Vector Readouts */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto max-w-xs">
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-2 text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Live Telemetry HUD
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PHYSICS ENGINE ACTIVE
            </span>
          </div>

          {activeLab === 'projectile' && (
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Horizontal Range (R):</span>
                <span className="text-amber-400 font-bold">{telemetry?.horizontalRange ?? '—'} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Apex Height (H):</span>
                <span className="text-sky-400 font-bold">{telemetry?.maxHeight ?? '—'} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time of Flight (T):</span>
                <span className="text-slate-200 font-bold">{telemetry?.timeOfFlight ?? '—'} s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Impact Speed:</span>
                <span className="text-emerald-400 font-bold">{telemetry?.finalVelocity ?? '—'} m/s</span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                <span>Target: {labState?.targetDistance}m</span>
                <span className={Math.abs((telemetry?.horizontalRange || 0) - (labState?.targetDistance || 0)) < 2 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {Math.abs((telemetry?.horizontalRange || 0) - (labState?.targetDistance || 0)) < 2 ? '🎯 Bullseye!' : 'Adjust Angle/Velocity'}
                </span>
              </div>
            </div>
          )}

          {activeLab === 'optics' && (
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Incident Angle (θ₁):</span>
                <span className="text-rose-400 font-bold">{labState?.incidentAngle ?? '—'}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Refracted Angle (θ₂):</span>
                <span className="text-sky-400 font-bold">
                  {telemetry?.isTotalInternalReflection ? 'T.I.R. (No beam)' : `${telemetry?.refractedAngle ?? '—'}°`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medium Index (n₂):</span>
                <span className="text-amber-400 font-bold">{labState?.n2?.toFixed(2) ?? '—'}</span>
              </div>
              {telemetry?.criticalAngle && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Angle (θc):</span>
                  <span className="text-yellow-400 font-bold">{telemetry?.criticalAngle}°</span>
                </div>
              )}
              <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-300">
                Formula: <span className="text-sky-300">n₁ sin θ₁ = n₂ sin θ₂</span>
              </div>
            </div>
          )}

          {activeLab === 'pendulum' && (
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Theoretical Period (T):</span>
                <span className="text-amber-400 font-bold">{telemetry?.theoreticalPeriod ?? '—'} s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Angle (θ):</span>
                <span className="text-sky-400 font-bold">{telemetry?.currentAngleDeg ?? '—'}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bob Speed (v):</span>
                <span className="text-emerald-400 font-bold">{telemetry?.linearVelocity ?? '—'} m/s</span>
              </div>

              {/* Energy Conservation Bar */}
              <div className="pt-1.5 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-400">KE: {telemetry?.kineticEnergy ?? 0}J</span>
                  <span className="text-sky-400">PE: {telemetry?.potentialEnergy ?? 0}J</span>
                  <span className="text-slate-300 font-bold">Total: {telemetry?.totalEnergy ?? 0}J</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-75"
                    style={{
                      width: `${
                        telemetry?.totalEnergy > 0
                          ? Math.min(100, ((telemetry?.kineticEnergy || 0) / telemetry.totalEnergy) * 100)
                          : 0
                      }%`,
                    }}
                  />
                  <div
                    className="bg-sky-500 h-full transition-all duration-75"
                    style={{
                      width: `${
                        telemetry?.totalEnergy > 0
                          ? Math.min(100, ((telemetry?.potentialEnergy || 0) / telemetry.totalEnergy) * 100)
                          : 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeLab === 'lorentz' && (
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Magnetic Field (B):</span>
                <span className="text-emerald-400 font-bold">{labState?.bField?.toFixed(2) ?? '—'} T</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Velocity (v):</span>
                <span className="text-sky-400 font-bold">{labState?.velocity?.toFixed(1) ?? '—'} × 10⁶ m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cyclotron Radius:</span>
                <span className="text-amber-400 font-bold">
                  {telemetry?.realRadiusMeters
                    ? `${(telemetry.realRadiusMeters * 1000).toFixed(2)} mm`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lorentz Force (F_B):</span>
                <span className="text-rose-400 font-bold">{telemetry?.lorentzForce ?? '—'} N</span>
              </div>
              <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-300">
                Formula: <span className="text-cyan-300">r = mv / (qB)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Ergonomic Bottom Control Dock */}
      <LabDock
        activeLab={activeLab}
        labState={labState}
        onUpdateParams={handleUpdateParams}
        onAction={handleAction}
        onReset={handleReset}
        onCameraPreset={handleCameraPreset}
      />
    </div>
  );
};
