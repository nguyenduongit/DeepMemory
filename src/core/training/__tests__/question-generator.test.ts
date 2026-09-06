import { describe, it, expect } from 'vitest';
import { generateQuestions } from '../question-generator';
import { numbersModule } from '../../../modules/numbers';

describe('Question Generator', () => {
  it('should generate 10 questions when questionCount is 10', () => {
    const questions = generateQuestions(numbersModule, {
      modeId: 'image-to-number',
      groupId: '00-09',
      questionCount: 10,
      order: 'random',
    });

    expect(questions).toHaveLength(10);
  });

  it('should generate all questions for a group when questionCount is all', () => {
    const questions = generateQuestions(numbersModule, {
      modeId: 'image-to-number',
      groupId: '00-09',
      questionCount: 'all',
      order: 'sequential',
    });

    expect(questions).toHaveLength(10);
  });

  it('should ensure every question has exactly 4 options with exactly 1 correct answer', () => {
    const questions = generateQuestions(numbersModule, {
      modeId: 'image-to-number',
      groupId: '00-99',
      questionCount: 20,
      order: 'random',
    });

    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      const correctOptions = q.options.filter((o) => o.isCorrect);
      const wrongOptions = q.options.filter((o) => !o.isCorrect);

      expect(correctOptions).toHaveLength(1);
      expect(wrongOptions).toHaveLength(3);
    }
  });

  it('should distribute correct answer across different option positions', () => {
    const questions = generateQuestions(numbersModule, {
      modeId: 'image-to-number',
      groupId: '00-99',
      questionCount: 50,
      order: 'random',
    });

    const positions = questions.map((q) => q.options.findIndex((o) => o.isCorrect));
    const uniquePositions = new Set(positions);

    // Across 50 questions, correct answer should appear in all 4 positions (0, 1, 2, 3)
    expect(uniquePositions.size).toBe(4);
  });
});
