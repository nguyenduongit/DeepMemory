import { ModuleDefinition } from '../../core/module/module-types';

export const flagsModule: ModuleDefinition = {
  id: 'geography-flags',
  name: 'Quốc kỳ',
  subtitle: 'Nhận diện cờ các quốc gia',
  description: 'Rèn luyện phản xạ ghi nhớ quốc kỳ các quốc gia trên khắp 5 châu lục.',
  category: 'geography',
  icon: 'flag',
  colorTheme: '#3b82f6',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};

export const mapsModule: ModuleDefinition = {
  id: 'geography-maps',
  name: 'Bản đồ',
  subtitle: 'Định vị hình dạng lãnh thổ',
  description: 'Ghi nhớ hình dáng biên giới và vị trí các quốc gia trên bản đồ thế giới.',
  category: 'geography',
  icon: 'map',
  colorTheme: '#0ea5e9',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};

export const capitalsModule: ModuleDefinition = {
  id: 'geography-capitals',
  name: 'Thủ đô',
  subtitle: 'Thủ đô các nước trên thế giới',
  description: 'Liên kết quốc gia và thủ đô tương ứng với tốc độ phản xạ cao.',
  category: 'geography',
  icon: 'landmark',
  colorTheme: '#06b6d4',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};

export const countriesModule: ModuleDefinition = {
  id: 'geography-countries',
  name: 'Quốc gia',
  subtitle: 'Vị trí & Châu lục',
  description: 'Hệ thống kiến thức về các quốc gia và vùng lãnh thổ.',
  category: 'geography',
  icon: 'globe',
  colorTheme: '#14b8a6',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: () => ({ type: 'text', value: '' }),
    title: () => '',
  },
  trainingModes: [],
};
