import { ModuleDefinition } from '../../core/module/module-types';

export const englishVocabModule: ModuleDefinition = {
  id: 'language-english-vocab',
  name: 'Từ vựng tiếng Anh',
  subtitle: 'Oxford 3000 từ cốt lõi',
  description: 'Mở rộng vốn từ vựng phản xạ nhanh qua hình ảnh và ngữ nghĩa trực quan.',
  category: 'language',
  icon: 'languages',
  colorTheme: '#ec4899',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};
