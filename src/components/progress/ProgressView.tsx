import React from 'react';
import { StudentProgress, LabId } from '../../types/physics';
import { LESSONS_DATA } from '../../data/lessonsData';
import { QUIZ_CATEGORIES } from '../../data/quizzesData';
import {
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Box,
  RotateCcw,
  Sparkles,
  Zap,
  Target,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { NavTab } from '../Navbar';

interface ProgressViewProps {
  progress: StudentProgress;
  onResetProgress: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onLaunchLab: (labId: LabId) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onResetProgress,
  onNavigateTab,
  onLaunchLab,
}) => {
  const totalLessons = LESSONS_DATA.length;
  const completedLessons = progress.completedLessons.length;
  const lessonPct = Math.round((completedLessons / totalLessons) * 100);

  const quizScores = Object.values(progress.quizScores);
  const totalQuizzesAttempted = quizScores.length;
  const averageQuizPct =
    totalQuizzesAttempted > 0
      ? Math.round(
          quizScores.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) /
            totalQuizzesAttempted
        )
      : 0;

  // Badges logic
  const badges = [
    {
      id: 'b-first-lesson',
      title: 'First Step into Physics',
      description: 'Completed your first theoretical lesson',
      unlocked: completedLessons >= 1,
      icon: BookOpen,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      id: 'b-mechanics-master',
      title: 'Galilean Trajectory Ace',
      description: 'Achieved ≥80% on Kinematics Quiz',
      unlocked:
        (progress.quizScores['quiz-kinematics']?.score || 0) /
          (progress.quizScores['quiz-kinematics']?.total || 1) >=
        0.8,
      icon: Target,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'b-optics-pro',
      title: 'Snell’s Disciple',
      description: 'Achieved ≥80% on Optics Quiz',
      unlocked:
        (progress.quizScores['quiz-optics']?.score || 0) /
          (progress.quizScores['quiz-optics']?.total || 1) >=
        0.8,
      icon: Compass,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'b-board-exam',
      title: 'Sir Fawwad Board Certified',
      description: 'Passed the Full Comprehensive Board Exam',
      unlocked: (progress.quizScores['quiz-comprehensive']?.score || 0) >= 7,
      icon: Award,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Student Academic Portfolio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              My Learning Mastery & Badges
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time records of lessons completed, laboratory inquiries, and quiz evaluations.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all progress and quiz records?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-xl text-xs transition-colors self-start cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Records</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Lessons Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Curriculum Lessons</span>
              <BookOpen className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-white">
              {completedLessons} / {totalLessons}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${lessonPct}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between">
              <span>{lessonPct}% Completed</span>
              <button
                onClick={() => onNavigateTab('lessons')}
                className="text-sky-400 hover:underline font-semibold"
              >
                Go to Lessons →
              </button>
            </div>
          </div>

          {/* Quizzes Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Quiz Average</span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-amber-400">
              {totalQuizzesAttempted > 0 ? `${averageQuizPct}%` : '—'}
            </div>
            <div className="text-[11px] text-slate-400">
              {totalQuizzesAttempted} of {QUIZ_CATEGORIES.length} assessments completed
            </div>
            <button
              onClick={() => onNavigateTab('quizzes')}
              className="text-[11px] text-amber-400 hover:underline font-semibold block pt-1"
            >
              Take Practice Exam →
            </button>
          </div>

          {/* 3D Labs Explored */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>3D Virtual Labs</span>
              <Box className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
              4 Labs Ready
            </div>
            <div className="text-[11px] text-slate-400">
              Kinematics, Optics, SHM, Electromagnetism
            </div>
            <button
              onClick={() => onNavigateTab('labs')}
              className="text-[11px] text-emerald-400 hover:underline font-semibold block pt-1"
            >
              Open 3D Labs →
            </button>
          </div>
        </div>

        {/* Physics Mastery Badges */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-lg text-white">Physics Achievements</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b) => {
              const Icon = b.icon;

              return (
                <div
                  key={b.id}
                  className={`border rounded-2xl p-4 flex items-center gap-4 transition-all ${
                    b.unlocked
                      ? 'bg-slate-900 border-slate-700/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/40 opacity-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                      b.unlocked ? b.color : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-white leading-tight">{b.title}</h3>
                      {b.unlocked && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Launch Recommendations */}
        <div className="bg-gradient-to-r from-sky-950/40 to-indigo-950/40 border border-sky-800/40 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base">Recommended Practice from Sir Fawwad</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            "Physics is best understood by combining rigorous mathematical derivation with visual intuition. Test your projectile equations in the 3D Ballistics Lab, then consolidate your knowledge in the practice quiz!"
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onLaunchLab('projectile')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Launch 3D Cannon Lab</span>
            </button>

            <button
              onClick={() => onNavigateTab('quizzes')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Take Full Mock Exam</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
