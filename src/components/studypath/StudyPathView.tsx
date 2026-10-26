import React, { useMemo } from 'react';
import { StudentProgress, LabId, QuizQuestion } from '../../types/physics';
import { LESSONS_DATA } from '../../data/lessonsData';
import { QUIZ_QUESTIONS } from '../../data/quizzesData';
import { generatePersonalizedStudyPlan } from '../../physics/studyPath';
import {
  Compass,
  Sparkles,
  Target,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Box,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Zap,
} from 'lucide-react';
import { NavTab } from '../Navbar';

interface StudyPathViewProps {
  progress: StudentProgress;
  onNavigateTab: (tab: NavTab) => void;
  onLaunchLab: (labId: LabId) => void;
  onStartCustomQuiz: (title: string, description: string, questions: QuizQuestion[]) => void;
}

export const StudyPathView: React.FC<StudyPathViewProps> = ({
  progress,
  onNavigateTab,
  onLaunchLab,
  onStartCustomQuiz,
}) => {
  const plan = useMemo(
    () => generatePersonalizedStudyPlan(progress, QUIZ_QUESTIONS, LESSONS_DATA),
    [progress]
  );

  const handleLaunchBoosterQuiz = () => {
    onStartCustomQuiz(
      'Personalized Weak-Area Booster Quiz',
      'Customized assessment targeted at your identified focus areas to close concept gaps.',
      plan.tailoredQuizQuestions
    );
  };

  const handleLaunchDiagnostic = () => {
    // Generate a 4-question balanced diagnostic (1 from each core domain)
    const diagnosticQuestions: QuizQuestion[] = [
      QUIZ_QUESTIONS['quiz-kinematics'][0],
      QUIZ_QUESTIONS['quiz-optics'][0],
      QUIZ_QUESTIONS['quiz-energy-shm'][0],
      QUIZ_QUESTIONS['quiz-em'][0],
    ];
    onStartCustomQuiz(
      'Baseline Physics Diagnostic Check',
      'Rapid 4-question assessment to calibrate your personalized curriculum focus.',
      diagnosticQuestions
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Adaptive Academic Guidance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Personalized Study Path & Diagnostics
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Sir Fawwad's algorithmic learning advisor analyzing your quiz mistakes and lesson progress.
            </p>
          </div>

          <button
            onClick={handleLaunchDiagnostic}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-sky-400 hover:text-sky-300 font-semibold rounded-xl text-xs transition-colors self-start cursor-pointer shadow-sm"
          >
            <Activity className="w-4 h-4" />
            <span>Run Quick Diagnostic (4 Qs)</span>
          </button>
        </div>

        {/* Hero Assessment & Readiness Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase tracking-wider">
                  {plan.masteryLabel}
                </span>
                {plan.diagnosticCompleted ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Calibrated with your test history</span>
                  </span>
                ) : (
                  <span className="text-xs text-amber-400 font-medium">
                    Initial Baseline (Complete quizzes for deeper insights)
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                {plan.overallReadinessPct >= 80
                  ? 'High School Board Exam Preparedness: Strong'
                  : plan.overallReadinessPct >= 60
                  ? 'Physics Concept Progression: On Track with Focus Areas'
                  : 'Foundational Review Needed: Strengthen Mechanics & Optics'}
              </h2>

              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {plan.overallReadinessPct >= 80
                  ? 'Your quantitative reasoning and vector analysis are performing at exam-distinction level. Concentrate on multi-step synthesis and timing in the mock exam.'
                  : 'Based on your latest assessments, Sir Fawwad has pinpointed specific concept bottlenecks. Reviewing the recommended notes and 3D simulations below will raise your problem-solving accuracy.'}
              </p>
            </div>

            {/* Readiness Dial */}
            <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 md:p-5 shrink-0 self-start md:self-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      plan.overallReadinessPct >= 80
                        ? 'text-emerald-400'
                        : plan.overallReadinessPct >= 60
                        ? 'text-sky-400'
                        : 'text-amber-400'
                    }
                    strokeDasharray={`${plan.overallReadinessPct}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold text-white">
                    {plan.overallReadinessPct}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Readiness Score
                </div>
                <div className="text-xs text-slate-300 mt-0.5">High School Exam Metric</div>
              </div>
            </div>
          </div>

          {/* Targeted Booster Quiz Banner */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-white">
                  Tailored Weak-Area Booster Quiz Ready
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {plan.tailoredQuizQuestions.length} Questions
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Custom test bank selected specifically to address your current difficulty topics.
              </p>
            </div>

            <button
              onClick={handleLaunchBoosterQuiz}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg active:scale-95 cursor-pointer shrink-0"
            >
              <span>Launch Booster Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Topic Health Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h2 className="font-bold text-lg text-white">Curriculum Topic Health Matrix</h2>
            </div>
            <span className="text-xs text-slate-400">Evaluated against high school exam standards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(plan.topicBreakdown).map((topic) => {
              const statusColors = {
                'Needs Review': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
                Developing: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                Proficient: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
                Mastered: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              };

              return (
                <div
                  key={topic.unit}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {topic.unit}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          statusColors[topic.status]
                        }`}
                      >
                        {topic.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-2xl font-extrabold text-white">
                        {topic.totalAttempted > 0 ? `${topic.scorePct}%` : '—'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {topic.totalAttempted > 0
                          ? `${topic.totalAttempted} Qs attempted`
                          : 'Not assessed yet'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          topic.status === 'Mastered'
                            ? 'bg-emerald-500'
                            : topic.status === 'Proficient'
                            ? 'bg-sky-500'
                            : topic.status === 'Needs Review'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${topic.scorePct || 25}%` }}
                      />
                    </div>

                    {/* Weak topics tags if any */}
                    {topic.weakTopics.length > 0 && (
                      <div className="pt-2 space-y-1">
                        <span className="text-[10px] text-rose-400 font-semibold block">
                          Identified Deficits:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {topic.weakTopics.map((w, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onNavigateTab('lessons')}
                      className="text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                    >
                      Notes →
                    </button>
                    <button
                      onClick={() => {
                        const labMap: Record<string, LabId> = {
                          Kinematics: 'projectile',
                          Optics: 'optics',
                          Oscillations: 'pendulum',
                          Electromagnetism: 'lorentz',
                        };
                        onLaunchLab(labMap[topic.unit] || 'projectile');
                      }}
                      className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      3D Lab →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prioritized Action Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-lg text-white">
              Sir Fawwad's Recommended Next Steps
            </h2>
          </div>

          <div className="space-y-3">
            {plan.recommendations.map((rec, idx) => {
              const priorityBadge =
                rec.priority === 'High'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : rec.priority === 'Medium'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityBadge}`}>
                        {rec.priority} Priority
                      </span>
                      <span className="font-bold text-white text-base">{rec.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rec.targetLabId && (
                        <button
                          onClick={() => onLaunchLab(rec.targetLabId!)}
                          className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>3D Lab</span>
                        </button>
                      )}

                      <button
                        onClick={() => onNavigateTab('lessons')}
                        className="flex items-center gap-1 px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Lesson</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{rec.reason}</p>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec.sirFawwadAdvice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
