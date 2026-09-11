import { ModuleDefinition } from '../../core/module/module-types';
import { MemoryCardItem } from './types';

export const memoryCardsModule: ModuleDefinition<MemoryCardItem> = {
  id: 'memory-cards',
  name: 'Nhớ bài Tây',
  subtitle: '52 lá • Hệ hình 01–52',
  description: 'Mã hóa mỗi lá bằng một hình trong hệ 100 số, tạo câu chuyện và nhớ chính xác thứ tự bộ bài.',
  category: 'memory',
  icon: 'club',
  colorTheme: '#ef4444',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: (item) => ({ type: 'image', src: item.imageUrl, alt: item.name }),
    title: (item) => item.code,
    subtitle: (item) => `${item.mnemonicNumber} • ${item.mnemonicName}`,
  },
  trainingModes: [
    {
      id: 'card-to-mnemonic',
      name: 'Lá bài → hình ảnh',
      description: 'Chọn hình ảnh được gán cố định cho lá bài.',
      getQuestion: (item) => ({ type: 'image', src: item.imageUrl, alt: item.name }),
      getCorrectAnswer: (item) => ({ type: 'image', src: item.mnemonicImageUrl, alt: item.mnemonicName }),
      getDistractorAnswer: (item) => ({ type: 'image', src: item.mnemonicImageUrl, alt: item.mnemonicName }),
    },
  ],
};
