import {
  StudentProgress,
  QuizQuestion,
  Lesson,
  PersonalizedStudyPlan,
  TopicMastery,
  StudyPathRecommendation,
} from '../types/physics';

export const CORE_UNITS = [
  'Kinematics',
  'Optics',
  'Oscillations',
  'Electromagnetism',
] as const;

export type CoreUnit = (typeof CORE_UNITS)[number];

const UNIT_TO_LESSON_MAP: Record<string, string> = {
  Kinematics: 'lesson-projectile',
  Optics: 'lesson-optics',
  Oscillations: 'lesson-pendulum',
  Energy: 'lesson-pendulum',
  Electromagnetism: 'lesson-lorentz',
};

const UNIT_TO_LAB_MAP: Record<string, 'projectile' | 'optics' | 'pendulum' | 'lorentz'> = {
  Kinematics: 'projectile',
  Optics: 'optics',
  Oscillations: 'pendulum',
  Energy: 'pendulum',
  Electromagnetism: 'lorentz',
};

/**
 * Normalizes question unit strings to core curriculum units
 */
export function normalizeUnit(rawUnit: string): CoreUnit {
  const lower = rawUnit.toLowerCase();
  if (lower.includes('kinematic') || lower.includes('mechanic')) return 'Kinematics';
  if (lower.includes('optic') || lower.includes('wave')) return 'Optics';
  if (lower.includes('oscillation') || lower.includes('energy') || lower.includes('shm'))
    return 'Oscillations';
  if (lower.includes('electromagnet') || lower.includes('magnetic'))
    return 'Electromagnetism';
  return 'Kinematics';
}

/**
 * Analyzes student performance and generates a personalized study path
 */
export function generatePersonalizedStudyPlan(
  progress: StudentProgress,
  allQuestionsMap: Record<string, QuizQuestion[]>,
  allLessons: Lesson[]
): PersonalizedStudyPlan {
  const attempts = progress.questionAttempts || {};
  const quizScores = progress.quizScores || {};
  const completedLessons = progress.completedLessons || [];

  // Flatten all questions for reference
  const allQuestionsList: QuizQuestion[] = Object.values(allQuestionsMap).flat();

  // Deduplicate questions by ID
  const uniqueQuestionsMap = new Map<string, QuizQuestion>();
  allQuestionsList.forEach((q) => {
    if (!uniqueQuestionsMap.has(q.id)) {
      uniqueQuestionsMap.set(q.id, q);
    }
  });

  // Track counts per unit
  const unitStats: Record<
    CoreUnit,
    { correct: number; total: number; weakTopics: Set<string>; strongTopics: Set<string> }
  > = {
    Kinematics: { correct: 0, total: 0, weakTopics: new Set(), strongTopics: new Set() },
    Optics: { correct: 0, total: 0, weakTopics: new Set(), strongTopics: new Set() },
    Oscillations: { correct: 0, total: 0, weakTopics: new Set(), strongTopics: new Set() },
    Electromagnetism: { correct: 0, total: 0, weakTopics: new Set(), strongTopics: new Set() },
  };

  // 1. Process granular question attempts if available
  Object.values(attempts).forEach((att) => {
    const unit = normalizeUnit(att.unit);
    unitStats[unit].total += 1;
    if (att.isCorrect) {
      unitStats[unit].correct += 1;
      unitStats[unit].strongTopics.add(att.topic);
    } else {
      unitStats[unit].weakTopics.add(att.topic);
    }
  });

  // 2. If no granular attempts recorded yet, infer from completed quiz category scores
  if (Object.keys(attempts).length === 0) {
    if (quizScores['quiz-kinematics']) {
      unitStats.Kinematics.total += quizScores['quiz-kinematics'].total;
      unitStats.Kinematics.correct += quizScores['quiz-kinematics'].score;
    }
    if (quizScores['quiz-optics']) {
      unitStats.Optics.total += quizScores['quiz-optics'].total;
      unitStats.Optics.correct += quizScores['quiz-optics'].score;
    }
    if (quizScores['quiz-energy-shm']) {
      unitStats.Oscillations.total += quizScores['quiz-energy-shm'].total;
      unitStats.Oscillations.correct += quizScores['quiz-energy-shm'].score;
    }
    if (quizScores['quiz-em']) {
      unitStats.Electromagnetism.total += quizScores['quiz-em'].total;
      unitStats.Electromagnetism.correct += quizScores['quiz-em'].score;
    }
  }

  // 3. Compute topic breakdown
  const topicBreakdown: Record<string, TopicMastery> = {};
  let totalScoreSum = 0;
  let totalUnitsEvaluated = 0;

  CORE_UNITS.forEach((unit) => {
    const stats = unitStats[unit];
    const scorePct =
      stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    let status: TopicMastery['status'] = 'Developing';
    if (stats.total === 0) {
      status = 'Developing';
    } else if (scorePct >= 85) {
      status = 'Mastered';
    } else if (scorePct >= 70) {
      status = 'Proficient';
    } else {
      status = 'Needs Review';
    }

    if (stats.total > 0) {
      totalScoreSum += scorePct;
      totalUnitsEvaluated++;
    }

    topicBreakdown[unit] = {
      unit,
      scorePct,
      totalAttempted: stats.total,
      status,
      weakTopics: Array.from(stats.weakTopics),
      strongTopics: Array.from(stats.strongTopics),
    };
  });

  // Calculate overall readiness
  const hasHistory = totalUnitsEvaluated > 0;
  const overallReadinessPct = hasHistory
    ? Math.round(totalScoreSum / totalUnitsEvaluated)
    : 45; // baseline starting score

  let masteryLabel = 'Foundational Explorer';
  if (overallReadinessPct >= 90) {
    masteryLabel = 'Board Exam Master';
  } else if (overallReadinessPct >= 75) {
    masteryLabel = 'Advanced Problem Solver';
  } else if (overallReadinessPct >= 60) {
    masteryLabel = 'Developing Physicist';
  }

  // 4. Generate prioritized recommendations
  const recommendations: StudyPathRecommendation[] = [];

  // Sort units by lowest performance first
  const sortedUnits = [...CORE_UNITS].sort((a, b) => {
    const aStats = topicBreakdown[a];
    const bStats = topicBreakdown[b];
    // If not attempted, treat as moderate priority
    const aVal = aStats.totalAttempted > 0 ? aStats.scorePct : 65;
    const bVal = bStats.totalAttempted > 0 ? bStats.scorePct : 65;
    return aVal - bVal;
  });

  sortedUnits.forEach((unit) => {
    const mastery = topicBreakdown[unit];
    const lessonId = UNIT_TO_LESSON_MAP[unit];
    const labId = UNIT_TO_LAB_MAP[unit];
    const isLessonDone = completedLessons.includes(lessonId);

    if (mastery.totalAttempted > 0 && mastery.scorePct < 70) {
      // High priority recommendation for struggling topics
      const topicDetail =
        mastery.weakTopics.length > 0
          ? `Focus on: ${mastery.weakTopics.join(', ')}.`
          : 'Score is under 70%.';

      recommendations.push({
        priority: 'High',
        unit,
        title: `Remediate ${unit} Concept Deficits`,
        reason: `${topicDetail} Revisit core derivations before your exam.`,
        suggestedActionType: 'lesson',
        targetId: lessonId,
        targetLabId: labId,
        sirFawwadAdvice: `Sir Fawwad suggests: Don't memorize steps. Open the 3D ${unit} Lab to visualize the vectors and parameters in motion, then re-test with the tailored quiz!`,
      });
    } else if (!isLessonDone) {
      // Recommended uncompleted lesson
      recommendations.push({
        priority: mastery.totalAttempted > 0 ? 'Medium' : 'High',
        unit,
        title: `Study Unit: ${unit}`,
        reason: 'Lesson notes not yet marked as completed.',
        suggestedActionType: 'lesson',
        targetId: lessonId,
        targetLabId: labId,
        sirFawwadAdvice: `Sir Fawwad suggests: Review Sir Fawwad's notes on ${unit} and test the interactive calculator inside the lesson.`,
      });
    } else if (mastery.scorePct >= 85) {
      // Low priority maintenance recommendation
      recommendations.push({
        priority: 'Low',
        unit,
        title: `Maintain Mastery: ${unit}`,
        reason: `Excellent track record (${mastery.scorePct}%).`,
        suggestedActionType: 'custom_quiz',
        targetLabId: labId,
        sirFawwadAdvice: `Sir Fawwad suggests: You've mastered ${unit}! Keep sharp by attempting challenging multi-step questions in the Mock Exam.`,
      });
    }
  });

  // Ensure at least 2 recommendations exist
  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'Medium',
      unit: 'Kinematics',
      title: 'Full Board Exam Preparation',
      reason: 'Take the comprehensive mock board exam to benchmark overall readiness.',
      suggestedActionType: 'custom_quiz',
      targetLabId: 'projectile',
      sirFawwadAdvice:
        'Sir Fawwad suggests: Timed practice under exam conditions is the best predictor of success.',
    });
  }

  // 5. Select Tailored Practice Quiz Questions
  // Determine weak units or weak topics
  const weakUnits = CORE_UNITS.filter((u) => topicBreakdown[u].scorePct < 75);
  const targetUnits = weakUnits.length > 0 ? weakUnits : CORE_UNITS;

  // Filter pool of questions matching target units
  const pool = Array.from(uniqueQuestionsMap.values()).filter((q) => {
    const qUnit = normalizeUnit(q.unit);
    return targetUnits.includes(qUnit);
  });

  // Prioritize questions from weak topics or challenging difficulty
  pool.sort((a, b) => {
    const aUnit = normalizeUnit(a.unit);
    const bUnit = normalizeUnit(b.unit);
    const aIsWeakTopic = topicBreakdown[aUnit].weakTopics.includes(a.topic) ? 1 : 0;
    const bIsWeakTopic = topicBreakdown[bUnit].weakTopics.includes(b.topic) ? 1 : 0;
    return bIsWeakTopic - aIsWeakTopic;
  });

  // Pick top 5 tailored questions
  const tailoredQuizQuestions = pool.slice(0, 5);

  return {
    overallReadinessPct,
    masteryLabel,
    topicBreakdown,
    recommendations: recommendations.slice(0, 4),
    tailoredQuizQuestions:
      tailoredQuizQuestions.length > 0
        ? tailoredQuizQuestions
        : Array.from(uniqueQuestionsMap.values()).slice(0, 5),
    diagnosticCompleted: hasHistory,
  };
}
