import { QuestionContent } from '../types/content-types';

export interface LearningConfig<TItem> {
  primary: (item: TItem) => QuestionContent;
  title: (item: TItem) => string;
  subtitle?: (item: TItem) => string;
  detail?: (item: TItem) => string;
}
