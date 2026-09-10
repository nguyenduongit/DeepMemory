import { describe, expect, it } from 'vitest';
import { generateQuestions } from '../../../core/training/question-generator';
import { englishVocabulary } from '../data';
import { englishVocabularyModule } from '../module';

describe('English vocabulary module', () => {
  it('contains 100 complete and unique A1 words with reserved image paths', () => {
    expect(englishVocabulary).toHaveLength(100);
    expect(new Set(englishVocabulary.map((item) => item.id)).size).toBe(100);
    expect(new Set(englishVocabulary.map((item) => item.word)).size).toBe(100);

    for (const item of englishVocabulary) {
      expect(item.level).toBe('A1');
      expect(item.pronunciation).toMatch(/^\/.+\/$/);
      expect(item.vietnameseMeaning).not.toBe('');
      expect(item.example).not.toBe('');
      expect(item.exampleTranslation).not.toBe('');
      expect(item.imagePath).toBe(`${item.id}.webp`);
    }
  });

  it('provides ten topic groups of ten words and one complete group', () => {
    expect(englishVocabularyModule.groups).toHaveLength(11);
    for (const group of englishVocabularyModule.groups?.slice(0, 10) ?? []) {
      expect(englishVocabulary.filter(group.filter)).toHaveLength(10);
    }
    const allGroup = englishVocabularyModule.groups?.find((group) => group.id === 'all');
    expect(allGroup && englishVocabulary.filter(allGroup.filter)).toHaveLength(100);
  });

  it('generates four unique choices for every training mode', () => {
    for (const mode of englishVocabularyModule.trainingModes) {
      const questions = generateQuestions(englishVocabularyModule, {
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
