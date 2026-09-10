import { ModuleGroup } from '../../core/module/module-types';
import { EnglishVocabularyItem, VocabularyTopicId } from './types';

const topics: Array<{ id: VocabularyTopicId; name: string }> = [
  { id: 'actions', name: 'Hoạt động' },
  { id: 'people', name: 'Con người' },
  { id: 'home', name: 'Nhà cửa' },
  { id: 'food', name: 'Đồ ăn' },
  { id: 'nature', name: 'Tự nhiên' },
  { id: 'places', name: 'Địa điểm' },
  { id: 'time', name: 'Thời gian' },
  { id: 'descriptions', name: 'Miêu tả' },
  { id: 'common-verbs', name: 'Động từ chung' },
  { id: 'communication', name: 'Giao tiếp' },
];

export const englishVocabularyGroups: ModuleGroup<EnglishVocabularyItem>[] = [
  ...topics.map(({ id, name }) => ({
    id,
    name,
    description: `10 từ chủ đề ${name.toLowerCase()}`,
    filter: (item: EnglishVocabularyItem) => item.topicId === id,
  })),
  {
    id: 'all',
    name: 'Tất cả',
    description: '100 từ vựng nền tảng A1',
    filter: () => true,
  },
];
