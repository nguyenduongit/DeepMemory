import { ModuleDefinition } from '../../core/module/module-types';
import { englishVocabulary } from './data';
import { englishVocabularyGroups } from './groups';
import { englishVocabularyTrainingModes, partOfSpeechLabels } from './training-modes';
import { EnglishVocabularyItem } from './types';

export const englishVocabularyModule: ModuleDefinition<EnglishVocabularyItem> = {
  id: 'language-english-vocab',
  name: 'Từ vựng tiếng Anh',
  subtitle: '100 từ nền tảng A1',
  description: 'Học từ, nghĩa, phiên âm IPA, loại từ và câu ví dụ theo 10 chủ đề quen thuộc.',
  category: 'language',
  icon: 'languages',
  colorTheme: '#ec4899',
  status: 'available',
  items: englishVocabulary,
  learning: {
    primary: (item) => ({ type: 'text', value: item.word }),
    title: (item) => item.vietnameseMeaning,
    subtitle: (item) => `${item.pronunciation} • ${partOfSpeechLabels[item.partOfSpeech]}`,
    detail: (item) => `${item.example} — ${item.exampleTranslation}`,
  },
  trainingModes: englishVocabularyTrainingModes,
  groups: englishVocabularyGroups,
};
