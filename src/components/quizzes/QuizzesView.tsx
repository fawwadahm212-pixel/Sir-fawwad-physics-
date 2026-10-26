import React, { useState, useEffect } from 'react';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../../data/quizzesData';
import { QuizCategory, QuizQuestion, QuestionAttempt } from '../../types/physics';
import {
  HelpCircle,
  Clock,
  Award,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface CustomQuizConfig {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
}

interface QuizzesViewProps {
  onSaveQuizScore: (quizId: string, score: number, total: number) => void;
  onRecordAttempts?: (attempts: QuestionAttempt[]) => void;
  savedScores: Record<string, { score: number; total: number; date: string }>;
  customQuizConfig?: CustomQuizConfig | null;
  onClearCustomQuiz?: () => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({
  onSaveQuizScore,
  onRecordAttempts,
  savedScores,
  customQuizConfig,
  onClearCustomQuiz,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(() => {
    if (customQuizConfig) {
      return {
        id: customQuizConfig.id,
        title: customQuizConfig.title,
        description: customQuizConfig.description,
        questionCount: customQuizConfig.questions.length,
        timeLimitMinutes: customQuizConfig.timeLimitMinutes || 10,
        badge: 'Tailored Booster',
      };
    }
    return null;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStepByStep, setShowStepByStep] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() =>
    customQuizConfig ? (customQuizConfig.timeLimitMinutes || 10) * 60 : 0
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Sync customQuizConfig if it changes
  useEffect(() => {
    if (customQuizConfig) {
      setSelectedCategory({
        id: customQuizConfig.id,
        title: customQuizConfig.title,
        description: customQuizConfig.description,
        questionCount: customQuizConfig.questions.length,
        timeLimitMinutes: customQuizConfig.timeLimitMinutes || 10,
        badge: 'Tailored Booster',
      });
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowHint(false);
      setIsSubmitted(false);
      setSecondsRemaining((customQuizConfig.timeLimitMinutes || 10) * 60);
      setIsTimerRunning(true);
    }
  }, [customQuizConfig]);

  const currentQuestions: QuizQuestion[] =
    selectedCategory?.id === customQuizConfig?.id && customQuizConfig
      ? customQuizConfig.questions
      : selectedCategory
      ? QUIZ_QUESTIONS[selectedCategory.id] || []
      : [];

  const currentQ = currentQuestions[currentIndex];

  // Initialize quiz
  const handleStartQuiz = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowHint(false);
    setIsSubmitted(false);
    setShowStepByStep(false);
    setSecondsRemaining(category.timeLimitMinutes * 60);
    setIsTimerRunning(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!selectedCategory || isSubmitted || !isTimerRunning || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedCategory, isSubmitted, isTimerRunning, secondsRemaining]);

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    const score = calculateScore();
    const total = currentQuestions.length;
    if (selectedCategory) {
      onSaveQuizScore(selectedCategory.id, score, total);

      // Record granular question attempts for the study path analyzer
      const newAttempts: QuestionAttempt[] = currentQuestions.map((q, idx) => ({
        questionId: q.id,
        unit: q.unit,
        topic: q.topic,
        isCorrect: selectedAnswers[idx] === q.correctIndex,
        timestamp: new Date().toISOString(),
      }));
      onRecordAttempts?.(newAttempts);

      if (score / total >= 0.75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Category Selection View
  if (!selectedCategory) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 md:p-8 text-slate-100">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Practice Testing & Assessment</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Sir Fawwad Physics Exam Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Select a focused topic quiz or challenge yourself with the comprehensive high school board mock exam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUIZ_CATEGORIES.map((cat) => {
              const previousRecord = savedScores[cat.id];
              const pct = previousRecord
                ? Math.round((previousRecord.score / previousRecord.total) * 100)
                : null;

              return (
                <div
                  key={cat.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-sky-500/5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {cat.badge}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {cat.timeLimitMinutes} min
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-sky-300 transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <div>
                      {previousRecord ? (
                        <span className="text-xs font-semibold text-emerald-400">
                          Best: {pct}% ({previousRecord.score}/{previousRecord.total})
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Not attempted yet</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartQuiz(cat)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>Start Quiz</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. Quiz In-Progress or Results View
  const score = calculateScore();
  const total = currentQuestions.length;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Header Bar */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                onClearCustomQuiz?.();
              }}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Back to Categories
            </button>
            <span className="text-slate-700">|</span>
            <span className="font-semibold text-white">{selectedCategory.title}</span>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 font-mono px-2.5 py-1 rounded ${
                  secondsRemaining < 60
                    ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Screen if Submitted */}
        {isSubmitted ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 text-center space-y-4 shadow-xl">
              <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 mb-2">
                <Award className="w-10 h-10" />
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Quiz Completed!
              </h2>

              <div className="flex items-center justify-center gap-6">
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold text-amber-400">
                    {pct}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Overall Mastery</div>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div>
                  <div className="text-3xl md:text-4xl font-extrabold text-sky-400">
                    {score} / {total}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Correct Answers</div>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-md mx-auto pt-2">
                {pct >= 90
                  ? '🌟 Outstanding! You have master-level intuition for these physics principles.'
                  : pct >= 70
                  ? '👍 Solid performance! Review Sir Fawwad’s explanations below to iron out remaining details.'
                  : '📚 Good effort. Review the formulas and try the 3D interactive labs to visualize these concepts before retaking.'}
              </p>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => handleStartQuiz(selectedCategory)}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    onClearCustomQuiz?.();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Choose Another Quiz
                </button>
              </div>
            </div>

            {/* Question Review List */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-white">Question Review & Solutions</h3>
              {currentQuestions.map((q, qIdx) => {
                const userAns = selectedAnswers[qIdx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`bg-slate-900 border rounded-2xl p-5 space-y-3 ${
                      isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400">Question {qIdx + 1}</span>
                      <span
                        className={`flex items-center gap-1 font-bold ${
                          isCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Correct (+1)
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    <p className="font-semibold text-white text-sm md:text-base">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isCorrectOption = oIdx === q.correctIndex;
                        const isUserOption = oIdx === userAns;

                        let style = 'bg-slate-800/60 border-slate-700/60 text-slate-300';
                        if (isCorrectOption) {
                          style = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold';
                        } else if (isUserOption && !isCorrectOption) {
                          style = 'bg-rose-500/20 border-rose-500/60 text-rose-300 line-through';
                        }

                        return (
                          <div key={oIdx} className={`p-2.5 rounded-lg border ${style}`}>
                            <span className="font-mono mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    {/* Sir Fawwad's Explanation */}
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                      <div className="font-bold text-sky-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sir Fawwad's Step-by-Step Solution:</span>
                      </div>
                      <p className="leading-relaxed">{q.explanation}</p>
                      {q.formulaUsed && (
                        <div className="font-mono text-amber-300 text-[11px] pt-1">
                          Key Equation: {q.formulaUsed}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Question Flow */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  Question {currentIndex + 1} of {total}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold">
                  {currentQ.difficulty}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {currentQ.topic}
              </span>
              <h2 className="text-base md:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-700/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint Drawer */}
            {currentQ.hint && (
              <div>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Need a hint?</span>
                  </button>
                ) : (
                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Hint: </span>
                      {currentQ.hint}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setShowHint(false);
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < total - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
                      setShowHint(false);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-1.5 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Submit & Finish</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
