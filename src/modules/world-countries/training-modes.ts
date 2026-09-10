import { TrainingMode } from '../../core/training/training-types';
import { WorldCountryItem } from './types';

const countryName = (item: WorldCountryItem) => ({ type: 'text' as const, value: item.vietnameseName });
const capital = (item: WorldCountryItem) => ({ type: 'text' as const, value: item.capital });
const flag = (item: WorldCountryItem) => ({
  type: 'image' as const,
  src: item.flagUrl,
  alt: item.vietnameseName,
});
const map = (item: WorldCountryItem) => ({
  type: 'image' as const,
  src: item.mapUrl,
  alt: item.vietnameseName,
});

export const worldCountryTrainingModes: TrainingMode<WorldCountryItem>[] = [
  {
    id: 'flag-to-country',
    name: 'Quốc kỳ → Quốc gia',
    description: 'Nhìn quốc kỳ và chọn đúng quốc gia',
    getQuestion: (item) => ({ ...flag(item), alt: 'Quốc kỳ cần nhận diện' }),
    getCorrectAnswer: countryName,
    getDistractorAnswer: countryName,
  },
  {
    id: 'country-to-flag',
    name: 'Quốc gia → Quốc kỳ',
    description: 'Nhìn tên quốc gia và chọn đúng quốc kỳ',
    getQuestion: countryName,
    getCorrectAnswer: flag,
    getDistractorAnswer: flag,
  },
  {
    id: 'map-to-country',
    name: 'Bản đồ → Quốc gia',
    description: 'Nhìn hình dáng lãnh thổ và chọn quốc gia',
    getQuestion: (item) => ({ ...map(item), alt: 'Bản đồ cần nhận diện' }),
    getCorrectAnswer: countryName,
    getDistractorAnswer: countryName,
  },
  {
    id: 'country-to-map',
    name: 'Quốc gia → Bản đồ',
    description: 'Nhìn tên quốc gia và chọn hình dáng lãnh thổ',
    getQuestion: countryName,
    getCorrectAnswer: map,
    getDistractorAnswer: map,
  },
  {
    id: 'country-to-capital',
    name: 'Quốc gia → Thủ đô',
    description: 'Nhìn tên quốc gia và chọn thủ đô',
    getQuestion: countryName,
    getCorrectAnswer: capital,
    getDistractorAnswer: capital,
  },
  {
    id: 'capital-to-country',
    name: 'Thủ đô → Quốc gia',
    description: 'Nhìn tên thủ đô và chọn quốc gia',
    getQuestion: capital,
    getCorrectAnswer: countryName,
    getDistractorAnswer: countryName,
  },
  {
    id: 'flag-to-capital',
    name: 'Quốc kỳ → Thủ đô',
    description: 'Nhìn quốc kỳ và chọn thủ đô tương ứng',
    getQuestion: (item) => ({ ...flag(item), alt: 'Quốc kỳ cần nhận diện' }),
    getCorrectAnswer: capital,
    getDistractorAnswer: capital,
  },
  {
    id: 'map-to-capital',
    name: 'Bản đồ → Thủ đô',
    description: 'Nhìn hình dáng lãnh thổ và chọn thủ đô',
    getQuestion: (item) => ({ ...map(item), alt: 'Bản đồ cần nhận diện' }),
    getCorrectAnswer: capital,
    getDistractorAnswer: capital,
  },
  {
    id: 'country-to-continent',
    name: 'Quốc gia → Châu lục',
    description: 'Xác định châu lục của quốc gia',
    getQuestion: countryName,
    getCorrectAnswer: (item) => ({ type: 'text', value: item.continent }),
    getDistractorAnswer: (item) => ({ type: 'text', value: item.continent }),
  },
];
