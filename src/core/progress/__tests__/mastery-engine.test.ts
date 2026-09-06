import { describe, it, expect } from 'vitest';
import { getMasteryLevel, calculateMasteryScore, updateItemProgressRecord } from '../mastery-engine';

describe('Mastery Engine (Section 40)', () => {
  it('should categorize mastery scores into correct levels', () => {
    expect(getMasteryLevel(0)).toBe('new');
    expect(getMasteryLevel(24)).toBe('new');

    expect(getMasteryLevel(25)).toBe('learning');
    expect(getMasteryLevel(49)).toBe('learning');

    expect(getMasteryLevel(50)).toBe('familiar');
    expect(getMasteryLevel(79)).toBe('familiar');

    expect(getMasteryLevel(80)).toBe('mastered');
    expect(getMasteryLevel(100)).toBe('mastered');
  });

  it('should calculate mastery score properly', () => {
    // 0 repetitions -> score 0
    expect(calculateMasteryScore(0, 0)).toBe(0);

    // 5 correct out of 5 with fast reaction time
    const perfectScore = calculateMasteryScore(5, 5, 800);
    expect(perfectScore).toBe(100); // 70 (accuracy) + 20 (reps) + 10 (speed)
    expect(getMasteryLevel(perfectScore)).toBe('mastered');

    // 1 correct out of 4 (25% acc) with slow reaction time
    const lowScore = calculateMasteryScore(4, 1, 2500);
    expect(lowScore).toBeLessThan(40);
    expect(getMasteryLevel(lowScore)).toBe('learning');
  });

  it('should update item progress record accurately across sessions', () => {
    let progress = updateItemProgressRecord(undefined, 'numbers-00-99', 'number-05', true, 900);
    expect(progress.seenCount).toBe(1);
    expect(progress.correctCount).toBe(1);
    expect(progress.wrongCount).toBe(0);
    expect(progress.accuracy).toBe(100);

    // Second practice wrong
    progress = updateItemProgressRecord(progress, 'numbers-00-99', 'number-05', false, 1500);
    expect(progress.seenCount).toBe(2);
    expect(progress.correctCount).toBe(1);
    expect(progress.wrongCount).toBe(1);
    expect(progress.accuracy).toBe(50);
  });
});
