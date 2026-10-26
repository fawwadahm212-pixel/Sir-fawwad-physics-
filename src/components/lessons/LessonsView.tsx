import React, { useState } from 'react';
import { LESSONS_DATA } from '../../data/lessonsData';
import { Lesson, LabId } from '../../types/physics';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Calculator,
  Box,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import {
  calculateProjectileMetrics,
  calculateRefractionAngle,
  calculatePendulumPeriod,
  calculateMechanicalEnergy,
} from '../../physics/math';

interface LessonsViewProps {
  completedLessonIds: string[];
  onToggleLessonCompleted: (lessonId: string) => void;
  onLaunchLab: (labId: LabId) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  completedLessonIds,
  onToggleLessonCompleted,
  onLaunchLab,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS_DATA[0].id);
  const [microAnswer, setMicroAnswer] = useState<number | null>(null);
  const [showMicroExplanation, setShowMicroExplanation] = useState(false);

  // Embedded Mini Calculator States
  const [projV, setProjV] = useState(25);
  const [projAngle, setProjAngle] = useState(45);
  const [projG, setProjG] = useState(9.8);

  const [snellN1, setSnellN1] = useState(1.0);
  const [snellN2, setSnellN2] = useState(1.5);
  const [snellAngle, setSnellAngle] = useState(30);

  const [pendL, setPendL] = useState(1.5);
  const [pendG, setPendG] = useState(9.8);

  const [energyM, setEnergyM] = useState(2.0);
  const [energyV, setEnergyV] = useState(8.0);
  const [energyH, setEnergyH] = useState(3.0);

  const currentLesson =
    LESSONS_DATA.find((l) => l.id === selectedLessonId) || LESSONS_DATA[0];

  const isCompleted = completedLessonIds.includes(currentLesson.id);

  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id);
    setMicroAnswer(null);
    setShowMicroExplanation(false);
  };

  const handleMicroOptionClick = (index: number) => {
    setMicroAnswer(index);
    setShowMicroExplanation(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100">
      {/* Left Sidebar: Curriculum Directory */}
      <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Curriculum Units
          </h2>
          <p className="text-xs text-slate-400">Sir Fawwad's Structured Notes</p>
        </div>

        <nav className="space-y-2">
          {LESSONS_DATA.map((lesson) => {
            const isDone = completedLessonIds.includes(lesson.id);
            const isSelected = lesson.id === selectedLessonId;

            return (
              <button
                key={lesson.id}
                onClick={() => handleSelectLesson(lesson.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500/50 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider">
                    {lesson.unitTitle.split(':')[0]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className="text-[10px] text-slate-400">{lesson.readTime}</span>
                  </div>
                </div>

                <div className="font-semibold text-sm leading-snug line-clamp-1">
                  {lesson.title}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {lesson.level}
                  </span>
                  {lesson.relatedLabId && (
                    <span className="flex items-center gap-1 text-amber-400">
                      <Box className="w-3 h-3" />
                      3D Lab
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content: Lesson Reader */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        {/* Lesson Header */}
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20">
              {currentLesson.unitTitle}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleLessonCompleted(currentLesson.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
              </button>

              {currentLesson.relatedLabId && (
                <button
                  onClick={() => onLaunchLab(currentLesson.relatedLabId!)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>Launch 3D Lab</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {currentLesson.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {currentLesson.summary}
          </p>
        </div>

        {/* Sir Fawwad's Pro Tip Box */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 md:p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Sir Fawwad's Exam Strategy</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {currentLesson.sirFawwadTip}
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {currentLesson.sections.map((sec, idx) => (
            <section key={idx} className="space-y-3">
              <h3 className="text-lg font-bold text-sky-300 tracking-tight">
                {sec.heading}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {sec.content}
              </p>

              {sec.formula && (
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-center text-sm md:text-base text-amber-300 shadow-inner">
                  {sec.formula}
                </div>
              )}

              {sec.variables && (
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Variable Definitions & SI Units:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {sec.variables.map((v, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-300">
                        <span className="font-mono text-sky-400 font-semibold">{v.symbol}:</span>
                        <span>{v.name}</span>
                        <span className="text-slate-400 font-mono">({v.unit})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Common Traps & Exam Pitfalls */}
        <div className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Exam Traps (Avoid Losing Marks!)</span>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-slate-300">
            {currentLesson.commonPitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Embedded Interactive Formula Calculator */}
        {currentLesson.calculator && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm md:text-base">
                  {currentLesson.calculator.title}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Live Mathematical Sandbox</span>
            </div>

            {currentLesson.calculator.type === 'projectile' && (() => {
              const res = calculateProjectileMetrics({
                initialVelocity: projV,
                angleDegrees: projAngle,
                gravity: projG,
              });
              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Speed (v₀): {projV} m/s</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={projV}
                        onChange={(e) => setProjV(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Angle (θ): {projAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="85"
                        value={projAngle}
                        onChange={(e) => setProjAngle(Number(e.target.value))}
                        className="w-full accent-sky-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Gravity (g): {projG} m/s²</span>
                      </div>
                      <select
                        value={projG}
                        onChange={(e) => setProjG(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-slate-200"
                      >
                        <option value="9.8">Earth (9.8 m/s²)</option>
                        <option value="1.62">Moon (1.62 m/s²)</option>
                        <option value="3.71">Mars (3.71 m/s²)</option>
                        <option value="24.79">Jupiter (24.79 m/s²)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-center">
                    <div>
                      <div className="text-slate-400 text-[10px]">Range (R)</div>
                      <div className="text-amber-400 font-bold text-sm md:text-base">{res.horizontalRange} m</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Apex Height (H)</div>
                      <div className="text-sky-400 font-bold text-sm md:text-base">{res.maxHeight} m</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Flight Time (T)</div>
                      <div className="text-emerald-400 font-bold text-sm md:text-base">{res.timeOfFlight} s</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {currentLesson.calculator.type === 'snell' && (() => {
              const res = calculateRefractionAngle(snellN1, snellN2, snellAngle);
              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Index n₁: {snellN1.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.05"
                        value={snellN1}
                        onChange={(e) => setSnellN1(Number(e.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Index n₂: {snellN2.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.05"
                        value={snellN2}
                        onChange={(e) => setSnellN2(Number(e.target.value))}
                        className="w-full accent-sky-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Incident Angle (θ₁): {snellAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="85"
                        value={snellAngle}
                        onChange={(e) => setSnellAngle(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-center">
                    <div>
                      <div className="text-slate-400 text-[10px]">Refracted Angle (θ₂)</div>
                      <div className="text-sky-400 font-bold text-sm md:text-base">
                        {res.isTotalInternalReflection ? 'T.I.R. (No refraction)' : `${res.refractedAngle}°`}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Critical Angle (θc)</div>
                      <div className="text-amber-400 font-bold text-sm md:text-base">
                        {res.criticalAngle ? `${res.criticalAngle}°` : 'None (n₁ ≤ n₂)'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {currentLesson.calculator.type === 'pendulum' && (() => {
              const t = calculatePendulumPeriod(pendL, pendG);
              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>String Length (L): {pendL.toFixed(1)} m</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={pendL}
                        onChange={(e) => setPendL(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Gravity (g): {pendG} m/s²</span>
                      </div>
                      <select
                        value={pendG}
                        onChange={(e) => setPendG(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-slate-200"
                      >
                        <option value="9.8">Earth (9.8 m/s²)</option>
                        <option value="1.62">Moon (1.62 m/s²)</option>
                        <option value="3.71">Mars (3.71 m/s²)</option>
                        <option value="24.79">Jupiter (24.79 m/s²)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-center">
                    <div>
                      <div className="text-slate-400 text-[10px]">Oscillation Period (T)</div>
                      <div className="text-amber-400 font-bold text-sm md:text-base">{t} seconds</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Frequency (f = 1/T)</div>
                      <div className="text-sky-400 font-bold text-sm md:text-base">{(1 / t).toFixed(3)} Hz</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {currentLesson.calculator.type === 'energy' && (() => {
              const energy = calculateMechanicalEnergy(energyM, energyV, energyH, 9.8);
              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Mass (m): {energyM} kg</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="10"
                        step="0.5"
                        value={energyM}
                        onChange={(e) => setEnergyM(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Speed (v): {energyV} m/s</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={energyV}
                        onChange={(e) => setEnergyV(Number(e.target.value))}
                        className="w-full accent-sky-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Height (h): {energyH} m</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.5"
                        value={energyH}
                        onChange={(e) => setEnergyH(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-center">
                    <div>
                      <div className="text-slate-400 text-[10px]">Kinetic Energy (KE)</div>
                      <div className="text-emerald-400 font-bold text-sm md:text-base">{energy.kineticEnergy} J</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Potential Energy (PE)</div>
                      <div className="text-sky-400 font-bold text-sm md:text-base">{energy.potentialEnergy} J</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Total Energy (E)</div>
                      <div className="text-amber-400 font-bold text-sm md:text-base">{energy.totalEnergy} J</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Check Your Understanding Micro-Quiz */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Check Your Understanding</span>
          </div>

          <p className="font-semibold text-sm md:text-base text-slate-100">
            {currentLesson.checkUnderstanding.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentLesson.checkUnderstanding.options.map((opt, i) => {
              const isSelected = microAnswer === i;
              const isCorrect = i === currentLesson.checkUnderstanding.correctAnswer;
              let btnClass = 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80';

              if (showMicroExplanation) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-500/20 border-rose-500/60 text-rose-300 line-through';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleMicroOptionClick(i)}
                  className={`p-3 rounded-xl border text-left text-xs md:text-sm transition-all cursor-pointer ${btnClass}`}
                >
                  <span className="font-mono text-slate-400 mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showMicroExplanation && (
            <div
              className={`p-3.5 rounded-xl border text-xs md:text-sm leading-relaxed ${
                microAnswer === currentLesson.checkUnderstanding.correctAnswer
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="font-bold mb-1">
                {microAnswer === currentLesson.checkUnderstanding.correctAnswer
                  ? '✓ Spot on!'
                  : '💡 Sir Fawwad’s Explanation:'}
              </div>
              {currentLesson.checkUnderstanding.explanation}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
