import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, RotateCcw, Compass, Eye, Sparkles } from 'lucide-react';
import { LabId } from '../../types/physics';

interface LabDockProps {
  activeLab: LabId;
  labState: any;
  onUpdateParams: (params: any) => void;
  onAction: (action: string) => void;
  onReset: () => void;
  onCameraPreset?: (preset: string) => void;
}

export const LabDock: React.FC<LabDockProps> = ({
  activeLab,
  labState,
  onUpdateParams,
  onAction,
  onReset,
  onCameraPreset,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-20 w-[94vw] max-w-[960px] transition-all duration-300 pointer-events-auto"
      style={{
        transform: isCollapsed ? 'translate(-50%, calc(100% - 38px))' : 'translate(-50%, 0)',
      }}
    >
      {/* Collapse Toggle Handle */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1 rounded-t-lg bg-slate-900/95 border-t border-x border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white shadow-lg cursor-pointer select-none transition-colors"
          aria-label={isCollapsed ? 'Show Lab Controls Dock' : 'Hide Lab Controls Dock'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Lab Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
              <span>Hide Controls (Full View)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-none text-slate-200">
        {activeLab === 'projectile' && (
          <div className="space-y-3">
            {/* Top row: controls and actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAction('fire')}
                  disabled={labState?.isPlaying}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Launch Cannon</span>
                </button>
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-lg text-sm transition-all cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Gravity Environment Presets */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 mr-1">Gravity:</span>
                {[
                  { name: 'Earth', g: 9.8 },
                  { name: 'Moon', g: 1.62 },
                  { name: 'Mars', g: 3.71 },
                  { name: 'Jupiter', g: 24.79 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onUpdateParams({ gravity: item.g })}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                      Math.abs((labState?.gravity || 9.8) - item.g) < 0.1
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {item.name} ({item.g})
                  </button>
                ))}
              </div>

              {/* Camera Presets */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 mr-1">Camera:</span>
                {['default', 'side', 'top', 'target'].map((cam) => (
                  <button
                    key={cam}
                    onClick={() => onCameraPreset?.(cam)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs capitalize transition-colors"
                  >
                    {cam}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row: Interactive sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Launch Velocity (v₀):</span>
                  <span className="font-semibold text-amber-400">{labState?.velocity || 24} m/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={labState?.velocity || 24}
                  onChange={(e) => onUpdateParams({ velocity: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Launch Angle (θ):</span>
                  <span className="font-semibold text-sky-400">{labState?.angle || 45}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="85"
                  step="1"
                  value={labState?.angle || 45}
                  onChange={(e) => onUpdateParams({ angle: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Target Distance:</span>
                  <span className="font-semibold text-emerald-400">{labState?.targetDistance || 45} m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="75"
                  step="1"
                  value={labState?.targetDistance || 45}
                  onChange={(e) => onUpdateParams({ targetDistance: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeLab === 'optics' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Material Presets:</span>
                {[
                  { name: 'Water', n: 1.33 },
                  { name: 'Acrylic', n: 1.49 },
                  { name: 'Crown Glass', n: 1.52 },
                  { name: 'Flint Glass', n: 1.66 },
                  { name: 'Diamond', n: 2.42 },
                ].map((mat) => (
                  <button
                    key={mat.name}
                    onClick={() => onUpdateParams({ n2: mat.n, medium2Name: `${mat.name} (n=${mat.n})` })}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer font-medium ${
                      Math.abs((labState?.n2 || 1.52) - mat.n) < 0.02
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {mat.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() =>
                    onUpdateParams({
                      laserWavelength: labState?.laserWavelength === 'red' ? 'green' : 'red',
                    })
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: labState?.laserWavelength === 'red' ? '#ef4444' : '#10b981' }}
                  />
                  <span>{labState?.laserWavelength === 'red' ? '650nm Red' : '532nm Green'}</span>
                </button>

                <button
                  onClick={() => onUpdateParams({ showNormalLine: !labState?.showNormalLine })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    labState?.showNormalLine ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Normal Line: {labState?.showNormalLine ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Angle of Incidence (θ₁ from Normal):</span>
                  <span className="font-semibold text-rose-400">{labState?.incidentAngle || 35}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={labState?.incidentAngle || 35}
                  onChange={(e) => onUpdateParams({ incidentAngle: Number(e.target.value) })}
                  className="w-full accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Refractive Index (n₂):</span>
                  <span className="font-semibold text-sky-400">{(labState?.n2 || 1.52).toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.00"
                  max="2.50"
                  step="0.01"
                  value={labState?.n2 || 1.52}
                  onChange={(e) =>
                    onUpdateParams({
                      n2: Number(e.target.value),
                      medium2Name: `Custom Medium (n=${Number(e.target.value).toFixed(2)})`,
                    })
                  }
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeLab === 'pendulum' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAction('toggle')}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-all cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{labState?.isPlaying ? 'Pause' : 'Oscillate'}</span>
                </button>
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-lg text-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 mr-1">Gravity:</span>
                {[
                  { name: 'Earth', g: 9.8 },
                  { name: 'Moon', g: 1.62 },
                  { name: 'Mars', g: 3.71 },
                  { name: 'Jupiter', g: 24.79 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onUpdateParams({ gravity: item.g })}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                      Math.abs((labState?.gravity || 9.8) - item.g) < 0.1
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Suspension Length (L):</span>
                  <span className="font-semibold text-amber-400">{(labState?.length || 1.8).toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={labState?.length || 1.8}
                  onChange={(e) => onUpdateParams({ length: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Release Angle (θ₀):</span>
                  <span className="font-semibold text-sky-400">{labState?.initialAngle || 30}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={labState?.initialAngle || 30}
                  onChange={(e) => onUpdateParams({ initialAngle: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Air Damping:</span>
                  <span className="font-semibold text-emerald-400">
                    {labState?.damping === 0 ? 'Frictionless' : `${(labState?.damping || 0.05).toFixed(2)}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.20"
                  step="0.01"
                  value={labState?.damping || 0.05}
                  onChange={(e) => onUpdateParams({ damping: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeLab === 'lorentz' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Particle:</span>
                <button
                  onClick={() => onUpdateParams({ particleType: 'electron' })}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    labState?.particleType === 'electron'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Electron (e⁻)
                </button>
                <button
                  onClick={() => onUpdateParams({ particleType: 'proton' })}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    labState?.particleType === 'proton'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Proton (p⁺)
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => onUpdateParams({ showFieldLines: !labState?.showFieldLines })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    labState?.showFieldLines ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  B-Field Vectors: {labState?.showFieldLines ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => onUpdateParams({ showVectors: !labState?.showVectors })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    labState?.showVectors ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  RHR Vectors (v, B, F): {labState?.showVectors ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Magnetic Field (B):</span>
                  <span className="font-semibold text-emerald-400">{(labState?.bField || 0.35).toFixed(2)} Tesla</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.8"
                  step="0.02"
                  value={labState?.bField || 0.35}
                  onChange={(e) => onUpdateParams({ bField: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Initial Speed (v):</span>
                  <span className="font-semibold text-sky-400">{(labState?.velocity || 3.5).toFixed(1)} × 10⁶ m/s</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.2"
                  value={labState?.velocity || 3.5}
                  onChange={(e) => onUpdateParams({ velocity: Number(e.target.value) })}
                  className="w-full accent-sky-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Pitch Angle (Helix Drift):</span>
                  <span className="font-semibold text-amber-400">{labState?.pitchAngle || 0}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={labState?.pitchAngle || 0}
                  onChange={(e) => onUpdateParams({ pitchAngle: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
