import { ModuleDefinition } from '../../core/module/module-types';

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
