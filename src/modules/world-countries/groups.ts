import { ModuleGroup } from '../../core/module/module-types';
import { WorldCountryItem, WorldContinent } from './types';

const POPULAR_COUNTRY_CODES = new Set([
  'VN', 'US', 'GB', 'FR', 'DE', 'IT', 'ES', 'RU', 'CN', 'JP',
  'KR', 'KP', 'IN', 'TH', 'SG', 'MY', 'ID', 'PH', 'LA', 'KH',
  'AU', 'NZ', 'CA', 'MX', 'BR', 'AR', 'EG', 'ZA', 'SA', 'AE',
]);

const CONTINENTS: WorldContinent[] = [
  'Châu Á',
  'Châu Âu',
  'Châu Phi',
  'Bắc Mỹ',
  'Nam Mỹ',
  'Châu Đại Dương',
];

export const worldCountryGroups: ModuleGroup<WorldCountryItem>[] = [
  {
    id: 'popular',
    name: 'Phổ biến',
    description: '30 quốc gia quen thuộc',
    filter: (item) => POPULAR_COUNTRY_CODES.has(item.code),
  },
  ...CONTINENTS.map((continent): ModuleGroup<WorldCountryItem> => ({
    id: continent.toLowerCase().replaceAll(' ', '-'),
    name: continent,
    description: `Các quốc gia thuộc ${continent}`,
    filter: (item) => item.continent === continent,
  })),
  {
    id: 'all-countries',
    name: 'Tất cả',
    description: 'Toàn bộ 195 quốc gia',
    filter: () => true,
  },
];
