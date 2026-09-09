import { ModuleGroup } from '../../core/module/module-types';
import { ChemicalElementItem } from './types';

export const periodicTableGroups: ModuleGroup<ChemicalElementItem>[] = [
  {
    id: 'first-20',
    name: '1–20',
    description: '20 nguyên tố đầu tiên',
    filter: (item) => item.atomicNumber <= 20,
  },
  ...Array.from({ length: 7 }, (_, index): ModuleGroup<ChemicalElementItem> => ({
    id: `period-${index + 1}`,
    name: `Chu kỳ ${index + 1}`,
    description: `Các nguyên tố thuộc chu kỳ ${index + 1}`,
    filter: (item) => item.period === index + 1,
  })),
  {
    id: 'metals',
    name: 'Kim loại',
    description: 'Các nhóm kim loại chính',
    filter: (item) => item.category.includes('metal') || item.category === 'lanthanide' || item.category === 'actinide',
  },
  {
    id: 'nonmetals',
    name: 'Phi kim',
    description: 'Phi kim hoạt động và khí hiếm',
    filter: (item) => item.category === 'reactive-nonmetal' || item.category === 'noble-gas',
  },
  {
    id: 'noble-gases',
    name: 'Khí hiếm',
    description: 'Các nguyên tố thuộc nhóm khí hiếm',
    filter: (item) => item.category === 'noble-gas',
  },
  {
    id: 'all-elements',
    name: 'Tất cả',
    description: 'Toàn bộ 118 nguyên tố',
    filter: () => true,
  },
];
