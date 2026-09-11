import { NumberSequenceResult } from './types';

export function generateDigitSequence(
  length: number,
  random: () => number = Math.random,
): string {
  if (!Number.isInteger(length) || length <= 0) return '';
  return Array.from({ length }, () => Math.floor(random() * 10).toString()).join('');
}

export function sanitizeDigitInput(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, Math.max(0, maxLength));
}

export function splitDigitSequence(sequence: string, chunkSize: number): string[] {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) return [sequence];
  const chunks: string[] = [];
  for (let index = 0; index < sequence.length; index += chunkSize) {
    chunks.push(sequence.slice(index, index + chunkSize));
  }
  return chunks;
}

export function scoreDigitRecall(
  expected: string,
  recalled: string,
  durationMs: number,
): NumberSequenceResult {
  let correctCount = 0;
  let firstErrorIndex: number | null = null;
  let longestStreak = 0;
  let currentStreak = 0;

  for (let index = 0; index < expected.length; index += 1) {
    if (recalled[index] === expected[index]) {
      correctCount += 1;
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      if (firstErrorIndex === null) firstErrorIndex = index;
      currentStreak = 0;
    }
  }

  const accuracy = expected.length === 0
    ? 0
    : Math.round((correctCount / expected.length) * 1000) / 10;

  return {
    correctCount,
    firstErrorIndex,
    longestStreak,
    accuracy,
    durationMs,
  };
}
