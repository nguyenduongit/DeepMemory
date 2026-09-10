import { TrainingMode } from '../../core/training/training-types';
import { EnglishVocabularyItem, VocabularyPartOfSpeech } from './types';

const partOfSpeechLabels: Record<VocabularyPartOfSpeech, string> = {
  noun: 'Danh từ',
  verb: 'Động từ',
  adjective: 'Tính từ',
  adverb: 'Trạng từ',
  pronoun: 'Đại từ',
};

const word = (item: EnglishVocabularyItem) => ({ type: 'text' as const, value: item.word });
const meaning = (item: EnglishVocabularyItem) => ({
  type: 'text' as const,
  value: item.vietnameseMeaning,
});
const pronunciation = (item: EnglishVocabularyItem) => ({
  type: 'text' as const,
  value: item.pronunciation,
});
const example = (item: EnglishVocabularyItem) => ({ type: 'text' as const, value: item.example });
const partOfSpeech = (item: EnglishVocabularyItem) => ({
  type: 'text' as const,
  value: partOfSpeechLabels[item.partOfSpeech],
});

export const englishVocabularyTrainingModes: TrainingMode<EnglishVocabularyItem>[] = [
  {
    id: 'english-to-vietnamese',
    name: 'Tiếng Anh → Nghĩa',
    description: 'Nhìn từ tiếng Anh và chọn nghĩa tiếng Việt',
    getQuestion: word,
    getCorrectAnswer: meaning,
    getDistractorAnswer: meaning,
  },
  {
    id: 'vietnamese-to-english',
    name: 'Nghĩa → Tiếng Anh',
    description: 'Nhìn nghĩa tiếng Việt và chọn từ tiếng Anh',
    getQuestion: meaning,
    getCorrectAnswer: word,
    getDistractorAnswer: word,
  },
  {
    id: 'pronunciation-to-word',
    name: 'Phiên âm → Từ',
    description: 'Nhìn phiên âm IPA và chọn đúng từ',
    getQuestion: pronunciation,
    getCorrectAnswer: word,
    getDistractorAnswer: word,
  },
  {
    id: 'word-to-example',
    name: 'Từ → Câu ví dụ',
    description: 'Chọn câu sử dụng đúng từ đang học',
    getQuestion: word,
    getCorrectAnswer: example,
    getDistractorAnswer: example,
  },
  {
    id: 'word-to-part-of-speech',
    name: 'Từ → Loại từ',
    description: 'Xác định danh từ, động từ, tính từ hoặc trạng từ',
    getQuestion: word,
    getCorrectAnswer: partOfSpeech,
    getDistractorAnswer: partOfSpeech,
  },
];

export { partOfSpeechLabels };
