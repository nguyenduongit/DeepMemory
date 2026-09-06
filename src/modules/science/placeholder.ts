import { ModuleDefinition } from '../../core/module/module-types';

export const periodicTableModule: ModuleDefinition = {
  id: 'science-periodic-table',
  name: 'Bảng tuần hoàn',
  subtitle: '118 nguyên tố hóa học',
  description: 'Ghi nhớ ký hiệu, số hiệu nguyên tử, tên gọi và tính chất của các nguyên tố.',
  category: 'science',
  icon: 'atom',
  colorTheme: '#8b5cf6',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};

export const solarSystemModule: ModuleDefinition = {
  id: 'science-solar-system',
  name: 'Hệ Mặt Trời',
  subtitle: 'Hành tinh & Thiên thể',
  description: 'Khám phá và ghi nhớ thứ tự, quỹ đạo, đặc điểm các hành tinh trong thái dương hệ.',
  category: 'science',
  icon: 'sun',
  colorTheme: '#f59e0b',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};
