import { ModuleDefinition } from '../../core/module/module-types';
import { worldCountryTrainingModes } from './training-modes';
import { WorldCountryItem } from './types';

const learningTitle = (item: WorldCountryItem) => item.vietnameseName;
const learningSubtitle = (item: WorldCountryItem) => `Thủ đô: ${item.capital}`;
const learningDetail = (item: WorldCountryItem) =>
  `${item.internationalName} • ${item.continent} • ${item.code}/${item.code3}`;

export const worldCountriesModule: ModuleDefinition<WorldCountryItem> = {
  id: 'geography-world-countries',
  name: 'Quốc gia thế giới',
  subtitle: 'Quốc kỳ • Bản đồ • Thủ đô',
  description: 'Liên kết quốc kỳ, hình dáng lãnh thổ, tên quốc gia, thủ đô và châu lục của 195 quốc gia.',
  category: 'geography',
  icon: 'globe',
  colorTheme: '#0ea5e9',
  status: 'available',
  items: [],
  learning: {
    primary: (item) => ({ type: 'image', src: item.flagUrl, alt: `Quốc kỳ ${item.vietnameseName}` }),
    title: learningTitle,
    subtitle: learningSubtitle,
    detail: learningDetail,
    variants: [
      {
        id: 'flag',
        name: 'Quốc kỳ',
        primary: (item) => ({ type: 'image', src: item.flagUrl, alt: `Quốc kỳ ${item.vietnameseName}` }),
      },
      {
        id: 'map',
        name: 'Bản đồ',
        primary: (item) => ({ type: 'image', src: item.mapUrl, alt: `Bản đồ ${item.vietnameseName}` }),
      },
    ],
  },
  trainingModes: worldCountryTrainingModes,
  groups: [],
};
