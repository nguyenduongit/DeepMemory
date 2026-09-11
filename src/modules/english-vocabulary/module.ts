import { ModuleDefinition } from '../../core/module/module-types';
import { englishVocabularyTrainingModes, partOfSpeechLabels } from './training-modes';
import { EnglishVocabularyItem } from './types';

export const englishVocabularyModule: ModuleDefinition<EnglishVocabularyItem> = {
  id: 'language-english-vocab',
  name: 'Từ vựng tiếng Anh',
  subtitle: '200 từ nền tảng A1–A2',
  description: 'Học từ, nghĩa, phiên âm IPA, loại từ và câu ví dụ theo 20 chủ đề thiết thực.',
  category: 'language',
  icon: 'languages',
  colorTheme: '#ec4899',
  status: 'available',
  items: [],
  learning: {
    primary: (item) => ({ type: 'text', value: item.word }),
    title: (item) => item.vietnameseMeaning,
    subtitle: (item) => `${item.pronunciation} • ${partOfSpeechLabels[item.partOfSpeech]} • ${item.level}`,
    detail: (item) => `${item.example} — ${item.exampleTranslation}`,
  },
  trainingModes: englishVocabularyTrainingModes,
  groups: [],
};
