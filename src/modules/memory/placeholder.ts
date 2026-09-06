import { ModuleDefinition } from '../../core/module/module-types';

export const memoryCardsModule: ModuleDefinition = {
  id: 'memory-cards',
  name: 'Memory Cards',
  subtitle: 'Bộ bài Tây 52 lá',
  description: 'Phương pháp mã hóa và ghi nhớ thứ tự bộ bài 52 lá thần tốc.',
  category: 'memory',
  icon: 'club',
  colorTheme: '#ef4444',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};

export const memoryPalaceModule: ModuleDefinition = {
  id: 'memory-palace',
  name: 'Memory Palace',
  subtitle: 'Lâu đài trí nhớ',
  description: 'Kỹ thuật định vị điểm neo thông tin trên hành trình không gian quen thuộc.',
  category: 'memory',
  icon: 'castle',
  colorTheme: '#8b5cf6',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};
