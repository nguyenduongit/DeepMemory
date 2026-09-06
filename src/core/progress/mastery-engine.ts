import { ItemProgress, MasteryLevel } from './progress-types';

/**
 * Determine mastery level from numeric mastery score (0-100)
 */
export function getMasteryLevel(score: number): MasteryLevel {
  if (score >= 80) return 'mastered';
  if (score >= 50) return 'familiar';
  if (score >= 25) return 'learning';
  return 'new';
}

/**
 * Calculate mastery score (0-100) based on accuracy, repetition count, and response speed
 */
export function calculateMasteryScore(
  seenCount: number,
  correctCount: number,
  averageReactionMs?: number
): number {
  if (seenCount <= 0) return 0;

  const rawAccuracy = correctCount / seenCount; // 0 to 1

  // 1. Accuracy weight: up to 70 points
  const accuracyPoints = rawAccuracy * 70;

  // 2. Repetition weight: up to 20 points (caps at 5 practice repetitions)
  const repetitionPoints = Math.min(seenCount, 5) * 4;

  // 3. Speed bonus: up to 10 points
  let speedBonus = 0;
  if (averageReactionMs && averageReactionMs > 0) {
    if (averageReactionMs <= 1200) {
      speedBonus = 10;
    } else if (averageReactionMs <= 2000) {
      speedBonus = 5;
    }
  }

  // If wrong more than correct, reduce score
  const score = Math.round(accuracyPoints + repetitionPoints + speedBonus);
  return Math.max(0, Math.min(100, score));
}

/**
 * Update an individual item's progress with a new answer result
 */
export function updateItemProgressRecord(
  existing: ItemProgress | undefined,
  moduleId: string,
  itemId: string,
  isCorrect: boolean,
  reactionMs: number
): ItemProgress {
  const seenCount = (existing?.seenCount || 0) + 1;
  const correctCount = (existing?.correctCount || 0) + (isCorrect ? 1 : 0);
  const wrongCount = (existing?.wrongCount || 0) + (isCorrect ? 0 : 1);
  const accuracy = Math.round((correctCount / seenCount) * 100);

  // Moving average reaction time
  const prevAvg = existing?.averageReactionMs || reactionMs;
  const averageReactionMs = Math.round((prevAvg * (seenCount - 1) + reactionMs) / seenCount);

  const masteryScore = calculateMasteryScore(seenCount, correctCount, averageReactionMs);
  const masteryLevel = getMasteryLevel(masteryScore);

  return {
    moduleId,
    itemId,
    seenCount,
    correctCount,
    wrongCount,
    accuracy,
    averageReactionMs,
    masteryScore,
    masteryLevel,
    lastPracticedAt: new Date().toISOString(),
  };
}
