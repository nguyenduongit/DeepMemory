import { ModuleDefinition } from '../../core/module/module-types';
import { NumberMemoryItem } from './types';
import { numberImageToNumberMode, numberNumberToImageMode } from './training-modes';

export const numbersModule: ModuleDefinition<NumberMemoryItem> = {
  id: 'numbers-00-99',
  name: 'Nhớ số',
  subtitle: '00–99',
  description: 'Ghi nhớ hệ thống hình ảnh đại diện cho các số từ 00 đến 99.',
  category: 'memory',
  icon: 'hash',
  colorTheme: '#6366f1',
  status: 'available',
  items: [],
  learning: {
    primary: (item) => ({
      type: 'image',
      src: item.imageUrl,
      alt: item.name,
    }),
    title: (item) => item.number,
    subtitle: (item) => item.name,
  },
  trainingModes: [
    numberImageToNumberMode,
    numberNumberToImageMode,
  ],
  groups: [],
};
