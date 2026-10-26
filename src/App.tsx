import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ThreeLabContainer } from './components/labs/ThreeLabContainer';
import { LessonsView } from './components/lessons/LessonsView';
import { QuizzesView, CustomQuizConfig } from './components/quizzes/QuizzesView';
import { StudyPathView } from './components/studypath/StudyPathView';
import { FormulasView } from './components/formulas/FormulasView';
import { ProgressView } from './components/progress/ProgressView';
import { LabId, StudentProgress, QuizQuestion, QuestionAttempt } from './types/physics';

const STORAGE_KEY = 'sir_fawwad_physics_portal_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('labs');
  const [currentLab, setCurrentLab] = useState<LabId>('projectile');
  const [customQuizConfig, setCustomQuizConfig] = useState<CustomQuizConfig | null>(null);

  // Student progress loaded from localStorage
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      completedLessons: ['lesson-projectile'],
      quizScores: {},
      questionAttempts: {},
      labsExplored: ['projectile'],
      bookmarkedFormulas: ['f-projectile-range', 'f-snell'],
    };
  });

  // Save to localStorage whenever progress updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const handleToggleLessonCompleted = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: exists
          ? prev.completedLessons.filter((id) => id !== lessonId)
          : [...prev.completedLessons, lessonId],
      };
    });
  };

  const handleSaveQuizScore = (quizId: string, score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: {
          score,
          total,
          date: new Date().toISOString(),
        },
      },
    }));
  };

  const handleRecordAttempts = (attempts: QuestionAttempt[]) => {
    setProgress((prev) => {
      const updatedAttempts = { ...(prev.questionAttempts || {}) };
      attempts.forEach((att) => {
        updatedAttempts[att.questionId] = att;
      });
      return {
        ...prev,
        questionAttempts: updatedAttempts,
      };
    });
  };

  const handleStartCustomQuiz = (
    title: string,
    description: string,
    questions: QuizQuestion[]
  ) => {
    setCustomQuizConfig({
      id: `custom-booster-${Date.now()}`,
      title,
      description,
      questions,
      timeLimitMinutes: Math.max(5, Math.ceil(questions.length * 2)),
    });
    setCurrentTab('quizzes');
  };

  const handleClearCustomQuiz = () => {
    setCustomQuizConfig(null);
  };

  const handleToggleBookmark = (formulaId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedFormulas.includes(formulaId);
      return {
        ...prev,
        bookmarkedFormulas: exists
          ? prev.bookmarkedFormulas.filter((id) => id !== formulaId)
          : [...prev.bookmarkedFormulas, formulaId],
      };
    });
  };

  const handleLaunchLab = (labId: LabId) => {
    setCurrentLab(labId);
    setCurrentTab('labs');
    if (!progress.labsExplored.includes(labId)) {
      setProgress((prev) => ({
        ...prev,
        labsExplored: [...prev.labsExplored, labId],
      }));
    }
  };

  const handleOpenLessonForLab = (labId: LabId) => {
    setCurrentTab('lessons');
  };

  const handleResetProgress = () => {
    const fresh: StudentProgress = {
      completedLessons: [],
      quizScores: {},
      questionAttempts: {},
      labsExplored: [],
      bookmarkedFormulas: [],
    };
    setProgress(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab !== 'quizzes') {
            setCustomQuizConfig(null);
          }
          setCurrentTab(tab);
        }}
        progressSummary={{
          completedLessonsCount: progress.completedLessons.length,
          quizzesCompletedCount: Object.keys(progress.quizScores).length,
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 relative overflow-x-hidden">
        {currentTab === 'labs' && (
          <ThreeLabContainer
            initialLab={currentLab}
            onOpenLessonForLab={handleOpenLessonForLab}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsView
            completedLessonIds={progress.completedLessons}
            onToggleLessonCompleted={handleToggleLessonCompleted}
            onLaunchLab={handleLaunchLab}
          />
        )}

        {currentTab === 'quizzes' && (
          <QuizzesView
            onSaveQuizScore={handleSaveQuizScore}
            onRecordAttempts={handleRecordAttempts}
            savedScores={progress.quizScores}
            customQuizConfig={customQuizConfig}
            onClearCustomQuiz={handleClearCustomQuiz}
          />
        )}

        {currentTab === 'studypath' && (
          <StudyPathView
            progress={progress}
            onNavigateTab={setCurrentTab}
            onLaunchLab={handleLaunchLab}
            onStartCustomQuiz={handleStartCustomQuiz}
          />
        )}

        {currentTab === 'formulas' && (
          <FormulasView
            bookmarkedIds={progress.bookmarkedFormulas}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            progress={progress}
            onResetProgress={handleResetProgress}
            onNavigateTab={setCurrentTab}
            onLaunchLab={handleLaunchLab}
          />
        )}
      </main>
    </div>
  );
}
