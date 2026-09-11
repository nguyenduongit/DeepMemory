import { SessionAnswer } from './training-types';

/**
 * Calculate percentage accuracy (0 to 100)
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total <= 0) return 0;
  const acc = (correct / total) * 100;
  return Math.round(acc * 10) / 10;
}

/**
 * Calculate average reaction time in milliseconds
 */
export function calculateAverageReaction(answers: SessionAnswer[]): number {
  if (!answers || answers.length === 0) return 0;
  const total = answers.reduce((sum, a) => sum + (a.reactionMs || 0), 0);
  return Math.round(total / answers.length);
}

/**
 * Generate best time record key (Rule: only compare sessions with identical conditions)
 */
export function generateBestTimeKey(
  moduleId: string,
  modeId: string,
  groupId: string = 'default',
  questionCount: number
): string {
  return `${moduleId}__${modeId}__${groupId}__${questionCount}`;
}

export function requiresPerfectAccuracyForRecord(moduleId: string, modeId: string): boolean {
  return (
    (moduleId === 'memory-cards' && modeId === 'deck-order') ||
    (moduleId === 'memory-number-sequence' && modeId === 'number-recall')
  );
}
