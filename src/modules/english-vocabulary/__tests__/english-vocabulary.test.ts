import { describe, expect, it } from 'vitest';
import { generateQuestions } from '../../../core/training/question-generator';
import { englishVocabulary } from '../data';
import { englishVocabularyTestModule } from '../../../test/module-fixtures';

describe('English vocabulary module', () => {
  it('contains 200 complete and unique A1-A2 words with reserved image paths', () => {
    expect(englishVocabulary).toHaveLength(200);
    expect(new Set(englishVocabulary.map((item) => item.id)).size).toBe(200);
    expect(new Set(englishVocabulary.map((item) => item.word)).size).toBe(200);
    expect(englishVocabulary.filter((item) => item.level === 'A1')).toHaveLength(100);
    expect(englishVocabulary.filter((item) => item.level === 'A2')).toHaveLength(100);

    for (const item of englishVocabulary) {
      expect(item.pronunciation).toMatch(/^\/.+\/$/);
      expect(item.vietnameseMeaning).not.toBe('');
      expect(item.example).not.toBe('');
      expect(item.exampleTranslation).not.toBe('');
      expect(item.imagePath).toBe(`${item.id}.webp`);
    }
  });

  it('provides twenty topic groups of ten words and one complete group', () => {
    expect(englishVocabularyTestModule.groups).toHaveLength(21);
    for (const group of englishVocabularyTestModule.groups?.slice(0, 20) ?? []) {
      expect(englishVocabulary.filter(group.filter)).toHaveLength(10);
    }
    const allGroup = englishVocabularyTestModule.groups?.find((group) => group.id === 'all');
    expect(allGroup && englishVocabulary.filter(allGroup.filter)).toHaveLength(200);
  });

  it('generates four unique choices for every training mode', () => {
    for (const mode of englishVocabularyTestModule.trainingModes) {
      const questions = generateQuestions(englishVocabularyTestModule, {
        modeId: mode.id,
        groupId: 'all',
        questionCount: 20,
        order: 'sequential',
      });

      expect(questions).toHaveLength(20);
      for (const question of questions) {
        expect(question.options).toHaveLength(4);
        expect(new Set(question.options.map((option) => JSON.stringify(option.content))).size).toBe(4);
      }
    }
  });
});
