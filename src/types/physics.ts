export type LabId = 'projectile' | 'optics' | 'pendulum' | 'lorentz';

export interface LessonMicroQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  unitTitle: string;
  title: string;
  level: 'High School' | 'AP / Honors' | 'O/A Level';
  readTime: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    formula?: string;
    variables?: { symbol: string; name: string; unit: string }[];
  }[];
  sirFawwadTip: string;
  commonPitfalls: string[];
  relatedLabId?: LabId;
  calculator?: {
    type: 'projectile' | 'snell' | 'pendulum' | 'energy';
    title: string;
    description: string;
  };
  checkUnderstanding: LessonMicroQuiz;
}

export interface QuizQuestion {
  id: string;
  unit: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaUsed?: string;
  hint?: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  timeLimitMinutes: number;
  badge: string;
}

export interface FormulaItem {
  id: string;
  category: string;
  name: string;
  latex: string;
  variables: { symbol: string; meaning: string; unit: string }[];
  description: string;
  derivationSummary?: string;
}

export interface QuestionAttempt {
  questionId: string;
  unit: string;
  topic: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface TopicMastery {
  unit: string;
  scorePct: number;
  totalAttempted: number;
  status: 'Needs Review' | 'Developing' | 'Proficient' | 'Mastered';
  weakTopics: string[];
  strongTopics: string[];
}

export interface StudyPathRecommendation {
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  reason: string;
  unit: string;
  suggestedActionType: 'lesson' | 'lab' | 'custom_quiz';
  targetId?: string;
  targetLabId?: LabId;
  sirFawwadAdvice: string;
}

export interface PersonalizedStudyPlan {
  overallReadinessPct: number;
  masteryLabel: string;
  topicBreakdown: Record<string, TopicMastery>;
  recommendations: StudyPathRecommendation[];
  tailoredQuizQuestions: QuizQuestion[];
  diagnosticCompleted: boolean;
}

export interface StudentProgress {
  completedLessons: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  questionAttempts?: Record<string, QuestionAttempt>;
  labsExplored: string[];
  bookmarkedFormulas: string[];
}
