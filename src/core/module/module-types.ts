import { LearningConfig } from '../learning/learning-types';
import { TrainingMode } from '../training/training-types';

export type ModuleCategory =
  | 'memory'
  | 'geography'
  | 'science'
  | 'language'
  | 'knowledge';

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  memory: 'Trí nhớ',
  geography: 'Địa lý',
  science: 'Khoa học',
  language: 'Ngôn ngữ',
  knowledge: 'Kiến thức',
};

export type ModuleStatus = 'available' | 'coming-soon' | 'disabled';

export interface ModuleGroup<TItem> {
  id: string;
  name: string;
  description?: string;
  filter: (item: TItem) => boolean;
}

export interface ModuleDefinition<TItem = any> {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  category: ModuleCategory;
  icon: string;
  colorTheme?: string;
  status: ModuleStatus;
  items: TItem[];
  learning: LearningConfig<TItem>;
  trainingModes: TrainingMode<TItem>[];
  groups?: ModuleGroup<TItem>[];
}
