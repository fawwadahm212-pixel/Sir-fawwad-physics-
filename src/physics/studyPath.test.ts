import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePersonalizedStudyPlan, normalizeUnit } from './studyPath';
import { StudentProgress, QuizQuestion, Lesson } from '../types/physics';

const MOCK_QUESTIONS: Record<string, QuizQuestion[]> = {
  'quiz-kinematics': [
    {
      id: 'k1',
      unit: 'Kinematics',
      topic: 'Projectile Range',
      difficulty: 'Easy',
      question: 'Range Q1',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 1,
      explanation: 'Explanation',
    },
    {
      id: 'k2',
      unit: 'Kinematics',
      topic: 'Time of Flight',
      difficulty: 'Medium',
      question: 'Flight Q2',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'Explanation',
    },
  ],
  'quiz-optics': [
    {
      id: 'o1',
      unit: 'Optics',
      topic: 'Snell’s Law',
      difficulty: 'Easy',
      question: 'Snell Q1',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'Explanation',
    },
    {
      id: 'o2',
      unit: 'Optics',
      topic: 'Critical Angle & TIR',
      difficulty: 'Medium',
      question: 'TIR Q2',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'Explanation',
    },
  ],
};

const MOCK_LESSONS: Lesson[] = [
  {
    id: 'lesson-projectile',
    unitId: 'unit-1',
    unitTitle: 'Unit 1: Kinematics',
    title: 'Kinematics Lesson',
    level: 'High School',
    readTime: '8 min',
    summary: 'Summary',
    sections: [],
    sirFawwadTip: 'Tip',
    commonPitfalls: [],
    checkUnderstanding: { question: 'Q', options: ['A'], correctAnswer: 0, explanation: 'Exp' },
  },
  {
    id: 'lesson-optics',
    unitId: 'unit-2',
    unitTitle: 'Unit 2: Optics',
    title: 'Optics Lesson',
    level: 'High School',
    readTime: '10 min',
    summary: 'Summary',
    sections: [],
    sirFawwadTip: 'Tip',
    commonPitfalls: [],
    checkUnderstanding: { question: 'Q', options: ['A'], correctAnswer: 0, explanation: 'Exp' },
  },
];

test('Unit Normalization identifies core syllabus domains', () => {
  assert.equal(normalizeUnit('2D Kinematics'), 'Kinematics');
  assert.equal(normalizeUnit('Geometric Optics & Refraction'), 'Optics');
  assert.equal(normalizeUnit('Harmonic Oscillations & Energy'), 'Oscillations');
  assert.equal(normalizeUnit('Electromagnetism & Lorentz'), 'Electromagnetism');
});

test('Personalized Study Plan identifies weak areas and creates High priority remediation', () => {
  const progress: StudentProgress = {
    completedLessons: ['lesson-projectile'],
    quizScores: {},
    questionAttempts: {
      k1: { questionId: 'k1', unit: 'Kinematics', topic: 'Projectile Range', isCorrect: true, timestamp: '' },
      k2: { questionId: 'k2', unit: 'Kinematics', topic: 'Time of Flight', isCorrect: true, timestamp: '' },
      o1: { questionId: 'o1', unit: 'Optics', topic: 'Snell’s Law', isCorrect: false, timestamp: '' },
      o2: { questionId: 'o2', unit: 'Optics', topic: 'Critical Angle & TIR', isCorrect: false, timestamp: '' },
    },
    labsExplored: ['projectile'],
    bookmarkedFormulas: [],
  };

  const plan = generatePersonalizedStudyPlan(progress, MOCK_QUESTIONS, MOCK_LESSONS);

  // Kinematics should be 100% Mastered, Optics should be 0% Needs Review
  assert.equal(plan.topicBreakdown.Kinematics.scorePct, 100);
  assert.equal(plan.topicBreakdown.Kinematics.status, 'Mastered');
  assert.equal(plan.topicBreakdown.Optics.scorePct, 0);
  assert.equal(plan.topicBreakdown.Optics.status, 'Needs Review');
  assert.ok(plan.topicBreakdown.Optics.weakTopics.includes('Snell’s Law'));

  // Top recommendation should be High priority for Optics
  const topRec = plan.recommendations.find((r) => r.unit === 'Optics');
  assert.ok(topRec, 'Must have a recommendation for Optics');
  assert.equal(topRec?.priority, 'High');

  // Tailored quiz questions should contain questions from the weak unit (Optics)
  assert.ok(plan.tailoredQuizQuestions.length > 0);
  assert.equal(plan.tailoredQuizQuestions[0].unit, 'Optics');
});

test('Personalized Study Plan provides sensible defaults for a brand new student', () => {
  const progress: StudentProgress = {
    completedLessons: [],
    quizScores: {},
    questionAttempts: {},
    labsExplored: [],
    bookmarkedFormulas: [],
  };

  const plan = generatePersonalizedStudyPlan(progress, MOCK_QUESTIONS, MOCK_LESSONS);
  assert.equal(plan.diagnosticCompleted, false);
  assert.ok(plan.recommendations.length > 0);
  assert.ok(plan.tailoredQuizQuestions.length > 0);
});
