import { describe, it, expect } from 'vitest';
import { generateDistractors, areAnswersEqual } from '../distractor-generator';
import { numberImageToNumberMode, numberNumberToImageMode } from '../../../modules/numbers/training-modes';
import { numberMemoryItems } from '../../../modules/numbers/data';

describe('Distractor Generator', () => {
  it('should generate exactly 3 distractors', () => {
    const currentItem = numberMemoryItems[5]; // 05 Quả táo
    const distractors = generateDistractors(numberMemoryItems, currentItem, numberImageToNumberMode, 3);

    expect(distractors).toHaveLength(3);
  });

  it('should not include the correct answer among distractors', () => {
    const currentItem = numberMemoryItems[5]; // 05
    const correctAnswer = numberImageToNumberMode.getCorrectAnswer(currentItem);

    for (let i = 0; i < 20; i++) {
      const distractors = generateDistractors(numberMemoryItems, currentItem, numberImageToNumberMode, 3);
      const containsCorrect = distractors.some((d) => areAnswersEqual(d, correctAnswer));
      expect(containsCorrect).toBe(false);
    }
  });

  it('should generate all unique distractors without duplicates', () => {
    const currentItem = numberMemoryItems[10];
    const distractors = generateDistractors(numberMemoryItems, currentItem, numberImageToNumberMode, 3);

    // Check pairwise uniqueness
    expect(areAnswersEqual(distractors[0], distractors[1])).toBe(false);
    expect(areAnswersEqual(distractors[0], distractors[2])).toBe(false);
    expect(areAnswersEqual(distractors[1], distractors[2])).toBe(false);
  });

  it('should work correctly for image distractors in Mode B (Number -> Image)', () => {
    const currentItem = numberMemoryItems[2];
    const distractors = generateDistractors(numberMemoryItems, currentItem, numberNumberToImageMode, 3);

    expect(distractors).toHaveLength(3);
    distractors.forEach((d) => {
      expect(d.type).toBe('image');
      if (d.type === 'image') {
        expect(d.src).not.toBe(currentItem.imageUrl);
      }
    });
  });
});
