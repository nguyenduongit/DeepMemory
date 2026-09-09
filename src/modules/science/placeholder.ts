import { ModuleDefinition } from '../../core/module/module-types';

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
