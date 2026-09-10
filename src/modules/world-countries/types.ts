export type WorldContinent =
  | 'Châu Á'
  | 'Châu Âu'
  | 'Châu Phi'
  | 'Bắc Mỹ'
  | 'Nam Mỹ'
  | 'Châu Đại Dương';

export interface WorldCountryItem {
  id: string;
  code: string;
  code3: string;
  vietnameseName: string;
  internationalName: string;
  capital: string;
  continent: WorldContinent;
  flagUrl: string;
  mapUrl: string;
  sortOrder: number;
}
