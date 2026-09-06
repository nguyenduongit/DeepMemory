import { ModuleGroup } from '../../core/module/module-types';
import { NumberMemoryItem } from './types';

export const numberGroups: ModuleGroup<NumberMemoryItem>[] = [
  {
    id: '00-09',
    name: '00–09',
    description: '10 số đầu tiên (00 đến 09)',
    filter: (item) => item.sortOrder >= 0 && item.sortOrder <= 9,
  },
  {
    id: '10-19',
    name: '10–19',
    description: 'Nhóm 10 số (10 đến 19)',
    filter: (item) => item.sortOrder >= 10 && item.sortOrder <= 19,
  },
  {
    id: '20-29',
    name: '20–29',
    description: 'Nhóm 10 số (20 đến 29)',
    filter: (item) => item.sortOrder >= 20 && item.sortOrder <= 29,
  },
  {
    id: '30-39',
    name: '30–39',
    description: 'Nhóm 10 số (30 đến 39)',
    filter: (item) => item.sortOrder >= 30 && item.sortOrder <= 39,
  },
  {
    id: '40-49',
    name: '40–49',
    description: 'Nhóm 10 số (40 đến 49)',
    filter: (item) => item.sortOrder >= 40 && item.sortOrder <= 49,
  },
  {
    id: '50-59',
    name: '50–59',
    description: 'Nhóm 10 số (50 đến 59)',
    filter: (item) => item.sortOrder >= 50 && item.sortOrder <= 59,
  },
  {
    id: '60-69',
    name: '60–69',
    description: 'Nhóm 10 số (60 đến 69)',
    filter: (item) => item.sortOrder >= 60 && item.sortOrder <= 69,
  },
  {
    id: '70-79',
    name: '70–79',
    description: 'Nhóm 10 số (70 đến 79)',
    filter: (item) => item.sortOrder >= 70 && item.sortOrder <= 79,
  },
  {
    id: '80-89',
    name: '80–89',
    description: 'Nhóm 10 số (80 đến 89)',
    filter: (item) => item.sortOrder >= 80 && item.sortOrder <= 89,
  },
  {
    id: '90-99',
    name: '90–99',
    description: 'Nhóm 10 số (90 đến 99)',
    filter: (item) => item.sortOrder >= 90 && item.sortOrder <= 99,
  },
  {
    id: '00-49',
    name: '00–49',
    description: 'Nửa đầu: 50 số (00 đến 49)',
    filter: (item) => item.sortOrder >= 0 && item.sortOrder <= 49,
  },
  {
    id: '50-99',
    name: '50–99',
    description: 'Nửa sau: 50 số (50 đến 99)',
    filter: (item) => item.sortOrder >= 50 && item.sortOrder <= 99,
  },
  {
    id: '00-99',
    name: '00–99',
    description: 'Tất cả: trọn bộ 100 số',
    filter: () => true,
  },
];
