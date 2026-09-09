import { describe, expect, it } from 'vitest';
import { generateQuestions } from '../../../core/training/question-generator';
import { chemicalElements } from '../data';
import { periodicTableModule } from '../module';

describe('periodic table module', () => {
  it('contains all 118 elements with unique atomic numbers, symbols and IDs', () => {
    expect(chemicalElements).toHaveLength(118);
    expect(new Set(chemicalElements.map((item) => item.atomicNumber)).size).toBe(118);
    expect(new Set(chemicalElements.map((item) => item.symbol)).size).toBe(118);
    expect(new Set(chemicalElements.map((item) => item.id)).size).toBe(118);
    expect(chemicalElements[0]).toMatchObject({ atomicNumber: 1, symbol: 'H' });
    expect(chemicalElements[117]).toMatchObject({ atomicNumber: 118, symbol: 'Og' });
  });

  it('generates four unique answers for every training mode', () => {
    for (const mode of periodicTableModule.trainingModes) {
      const questions = generateQuestions(periodicTableModule, {
        modeId: mode.id,
        groupId: 'first-20',
        questionCount: 10,
        order: 'sequential',
      });

      expect(questions).toHaveLength(10);
      for (const question of questions) {
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options.map((option) => JSON.stringify(option.content))).size).toBe(4);
      }
    }
  });

  it('keeps category training usable inside a single-category group', () => {
    const questions = generateQuestions(periodicTableModule, {
      modeId: 'symbol-to-category',
      groupId: 'noble-gases',
      questionCount: 'all',
      order: 'sequential',
    });

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every((question) => question.options.length === 4)).toBe(true);
  });
});
