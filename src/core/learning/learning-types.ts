import type { ComponentType } from 'react';
import { QuestionContent } from '../types/content-types';

export interface LearningOverviewProps<TItem> {
  items: TItem[];
  onSelectItem: (item: TItem) => void;
}

export interface LearningVariant<TItem> {
  id: string;
  name: string;
  primary: (item: TItem) => QuestionContent;
  title?: (item: TItem) => string;
  subtitle?: (item: TItem) => string;
  detail?: (item: TItem) => string;
}

export interface LearningConfig<TItem> {
  primary: (item: TItem) => QuestionContent;
  title: (item: TItem) => string;
  subtitle?: (item: TItem) => string;
  detail?: (item: TItem) => string;
  overview?: ComponentType<LearningOverviewProps<TItem>>;
  variants?: LearningVariant<TItem>[];
}
