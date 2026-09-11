import { MemoryCardItem, RecallResult } from './types';

export function shuffleCards<T>(items: T[], random: () => number = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createMemorySequence(items: MemoryCardItem[], length: number): MemoryCardItem[] {
  return shuffleCards(items).slice(0, Math.min(length, items.length));
}

export function scoreRecall(
  expected: MemoryCardItem[],
  recalled: MemoryCardItem[],
  durationMs: number,
): RecallResult {
  let correctCount = 0;
  let longestStreak = 0;
  let currentStreak = 0;
  let firstErrorIndex: number | null = null;

  expected.forEach((card, index) => {
    if (recalled[index]?.id === card.id) {
      correctCount += 1;
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      if (firstErrorIndex === null) firstErrorIndex = index;
      currentStreak = 0;
    }
  });

  return {
    correctCount,
    firstErrorIndex,
    longestStreak,
    accuracy: expected.length === 0 ? 0 : Math.round((correctCount / expected.length) * 100),
    durationMs,
  };
}
