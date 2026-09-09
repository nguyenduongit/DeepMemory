export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface ChemicalElementItem {
  id: string;
  atomicNumber: number;
  symbol: string;
  vietnameseName: string;
  internationalName: string;
  atomicMass: string;
  period: number;
  group?: number;
  category: ElementCategory;
  sortOrder: number;
}

export const ELEMENT_CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Kim loại kiềm',
  'alkaline-earth-metal': 'Kim loại kiềm thổ',
  'transition-metal': 'Kim loại chuyển tiếp',
  'post-transition-metal': 'Kim loại sau chuyển tiếp',
  metalloid: 'Á kim',
  'reactive-nonmetal': 'Phi kim',
  'noble-gas': 'Khí hiếm',
  lanthanide: 'Họ Lantan',
  actinide: 'Họ Actini',
  unknown: 'Chưa xác định',
};
