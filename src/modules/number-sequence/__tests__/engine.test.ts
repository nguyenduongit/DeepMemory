import { describe, expect, it } from 'vitest';
import {
  generateDigitSequence,
  sanitizeDigitInput,
  scoreDigitRecall,
} from '../engine';

describe('number sequence engine', () => {
  it('generates the requested number of digits including leading zeroes', () => {
    const values = [0.01, 0.19, 0.29, 0.99];
    let index = 0;
    expect(generateDigitSequence(4, () => values[index++])).toBe('0129');
    expect(generateDigitSequence(0)).toBe('');
  });

  it('keeps only digits and respects the challenge length', () => {
    expect(sanitizeDigitInput('12 3a-456', 5)).toBe('12345');
  });

  it('scores positions, first error, longest streak and accuracy', () => {
    expect(scoreDigitRecall('1234567890', '1230567899', 4200)).toEqual({
      correctCount: 8,
      firstErrorIndex: 3,
      longestStreak: 5,
      accuracy: 80,
      durationMs: 4200,
    });
    expect(scoreDigitRecall('1234', '1234', 1000).accuracy).toBe(100);
  });
});
