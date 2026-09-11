import { describe, expect, it } from 'vitest';
import { scoreRecall, shuffleCards } from '../engine';
import { MemoryCardItem } from '../types';

const cards = ['a', 'b', 'c'].map((id, sortOrder) => ({ id, sortOrder } as MemoryCardItem));

describe('memory cards engine', () => {
  it('shuffles without changing the source array', () => {
    const source = [...cards];
    expect(shuffleCards(source, () => 0).map((card) => card.id)).toEqual(['b', 'c', 'a']);
    expect(source).toEqual(cards);
  });

  it('scores positions, first error and longest streak', () => {
    const result = scoreRecall(cards, [cards[0], cards[2], cards[1]], 1234);
    expect(result).toMatchObject({
      correctCount: 1,
      firstErrorIndex: 1,
      longestStreak: 1,
      accuracy: 33,
      durationMs: 1234,
    });
  });

  it('accepts a perfect recall', () => {
    expect(scoreRecall(cards, cards, 500).firstErrorIndex).toBeNull();
    expect(scoreRecall(cards, cards, 500).accuracy).toBe(100);
  });
});
