import { describe, it, expect } from 'vitest';
import {
  calculateAccuracy,
  calculateAverageReaction,
  generateBestTimeKey,
  requiresPerfectAccuracyForRecord,
} from '../scoring';

describe('Scoring & Best Time Rules (Section 70, 71, 72)', () => {
  it('should calculate accuracy percentage rounded to 1 decimal place', () => {
    expect(calculateAccuracy(47, 50)).toBe(94);
    expect(calculateAccuracy(1, 3)).toBe(33.3);
    expect(calculateAccuracy(0, 10)).toBe(0);
    expect(calculateAccuracy(10, 10)).toBe(100);
  });

  it('should calculate average reaction time correctly', () => {
    const answers = [
      { questionId: '1', itemId: '1', selectedOptionId: 'a', correctOptionId: 'a', isCorrect: true, reactionMs: 800 },
      { questionId: '2', itemId: '2', selectedOptionId: 'b', correctOptionId: 'b', isCorrect: true, reactionMs: 900 },
      { questionId: '3', itemId: '3', selectedOptionId: 'c', correctOptionId: 'c', isCorrect: true, reactionMs: 1000 },
    ];
    expect(calculateAverageReaction(answers)).toBe(900);
  });

  it('best time key must include moduleId, modeId, groupId, and questionCount (Section 70)', () => {
    const key = generateBestTimeKey('numbers-00-99', 'image-to-number', '00-99', 100);
    expect(key).toBe('numbers-00-99__image-to-number__00-99__100');

    const key10 = generateBestTimeKey('numbers-00-99', 'image-to-number', '00-99', 10);
    // Keys must not be equal when questionCount differs (Section 70: không được so 10 câu với 100 câu)
    expect(key).not.toBe(key10);
  });

  it('requires perfect recall for ordered card and number sequence records', () => {
    expect(requiresPerfectAccuracyForRecord('memory-cards', 'deck-order')).toBe(true);
    expect(requiresPerfectAccuracyForRecord('memory-number-sequence', 'number-recall')).toBe(true);
    expect(requiresPerfectAccuracyForRecord('numbers-00-99', 'image-to-number')).toBe(false);
  });
});
