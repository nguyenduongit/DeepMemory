import { describe, expect, it } from 'vitest';
import { generateQuestions } from '../../../core/training/question-generator';
import { worldCountries } from '../data.generated';
import { worldCountriesTestModule } from '../../../test/module-fixtures';

describe('world countries module', () => {
  it('contains 195 unique countries with local asset paths', () => {
    expect(worldCountries).toHaveLength(195);
    expect(new Set(worldCountries.map((item) => item.id)).size).toBe(195);
    expect(new Set(worldCountries.map((item) => item.code)).size).toBe(195);
    expect(new Set(worldCountries.map((item) => item.code3)).size).toBe(195);

    for (const country of worldCountries) {
      expect(country.vietnameseName).not.toBe('');
      expect(country.capital).not.toBe('');
      expect(country.flagUrl).toBe(`/country-flags/${country.code.toLowerCase()}.svg`);
      expect(country.mapUrl).toBe(`/country-maps/${country.code.toLowerCase()}.svg`);
    }
  });

  it('includes the expected Vietnamese country record', () => {
    expect(worldCountries.find((item) => item.code === 'VN')).toMatchObject({
      vietnameseName: 'Việt Nam',
      internationalName: 'Vietnam',
      capital: 'Hà Nội',
      continent: 'Châu Á',
    });
  });

  it('generates four unique choices for every training mode', () => {
    for (const mode of worldCountriesTestModule.trainingModes) {
      const questions = generateQuestions(worldCountriesTestModule, {
        modeId: mode.id,
        groupId: 'popular',
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

  it('keeps continent questions usable in a single-continent group', () => {
    const questions = generateQuestions(worldCountriesTestModule, {
      modeId: 'country-to-continent',
      groupId: 'châu-á',
      questionCount: 10,
      order: 'sequential',
    });

    expect(questions).toHaveLength(10);
    expect(questions.every((question) => question.options.length === 4)).toBe(true);
  });
});
