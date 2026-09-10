import { ModuleDefinition } from '../../core/module/module-types';
import {
  atomicNumberToSymbolMode,
  nameToSymbolMode,
  symbolToAtomicNumberMode,
  symbolToCategoryMode,
  symbolToNameMode,
} from './training-modes';
import { ChemicalElementItem, ELEMENT_CATEGORY_LABELS } from './types';
import { PeriodicTableOverview } from './PeriodicTableOverview';

export const periodicTableModule: ModuleDefinition<ChemicalElementItem> = {
  id: 'science-periodic-table',
  name: 'Bảng tuần hoàn',
  subtitle: '118 nguyên tố hóa học',
  description: 'Ghi nhớ ký hiệu, tên gọi, số hiệu nguyên tử và phân loại của 118 nguyên tố.',
  category: 'science',
  icon: 'atom',
  colorTheme: '#14b8a6',
  status: 'available',
  items: [],
  learning: {
    primary: (item) => ({ type: 'text', value: item.symbol }),
    title: (item) => item.vietnameseName,
    subtitle: (item) => item.internationalName,
    detail: (item) => {
      const group = item.group ? ` • Nhóm ${item.group}` : '';
      return `Z = ${item.atomicNumber} • NTK ${item.atomicMass} • Chu kỳ ${item.period}${group} • ${ELEMENT_CATEGORY_LABELS[item.category]}`;
    },
    overview: PeriodicTableOverview,
  },
  trainingModes: [
    symbolToNameMode,
    nameToSymbolMode,
    atomicNumberToSymbolMode,
    symbolToAtomicNumberMode,
    symbolToCategoryMode,
  ],
  groups: [],
};
