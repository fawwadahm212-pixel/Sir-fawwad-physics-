import React from 'react';
import { Atom, Box, BookOpen, HelpCircle, FileText, Award, Sparkles, Compass } from 'lucide-react';

export type NavTab = 'labs' | 'lessons' | 'quizzes' | 'studypath' | 'formulas' | 'progress';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  progressSummary: {
    completedLessonsCount: number;
    quizzesCompletedCount: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  progressSummary,
}) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between text-slate-100 z-30 sticky top-0">
      {/* Brand & Teacher Title */}
      <div
        onClick={() => onSelectTab('labs')}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/10">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Atom className="w-5 h-5 text-sky-400 group-hover:rotate-45 transition-transform duration-500" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
              Sir Fawwad
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              PHYSICS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            High School & AP Interactive Portal
          </p>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="flex items-center gap-1 md:gap-1.5">
        <button
          onClick={() => onSelectTab('labs')}
          className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'labs'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span className="hidden md:inline">3D Virtual Labs</span>
          <span className="md:hidden">3D Labs</span>
        </button>

        <button
          onClick={() => onSelectTab('lessons')}
          className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'lessons'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Lessons</span>
        </button>

        <button
          onClick={() => onSelectTab('quizzes')}
          className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'quizzes'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Quizzes</span>
        </button>

        {/* Personalized Study Path Tab */}
        <button
          onClick={() => onSelectTab('studypath')}
          className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'studypath'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
              : 'text-amber-300/90 hover:text-amber-200 hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Study Path</span>
        </button>

        <button
          onClick={() => onSelectTab('formulas')}
          className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'formulas'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden lg:inline">Formula Vault</span>
          <span className="lg:hidden">Formulas</span>
        </button>

        <button
          onClick={() => onSelectTab('progress')}
          className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer ${
            currentTab === 'progress'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span className="hidden lg:inline">My Progress</span>
          <span className="lg:hidden">Progress</span>
        </button>
      </nav>

      {/* Student Activity Badge */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {progressSummary.completedLessonsCount} Lessons | {progressSummary.quizzesCompletedCount} Quizzes Passed
          </span>
        </div>
      </div>
    </header>
  );
};
