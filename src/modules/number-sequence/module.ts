import { ModuleDefinition } from '../../core/module/module-types';
import { DigitItem } from './types';

export const numberSequenceModule: ModuleDefinition<DigitItem> = {
  id: 'memory-number-sequence',
  name: 'Thi đấu nhớ số',
  subtitle: '20–500 chữ số',
  description: 'Ghi nhớ dãy số ngẫu nhiên trong thời gian ngắn nhất rồi nhập lại chính xác toàn bộ.',
  category: 'memory',
  icon: 'timer',
  colorTheme: '#06b6d4',
  status: 'coming-soon',
  items: [],
  learning: {
    primary: (item) => ({ type: 'text', value: item.digit }),
    title: (item) => `Chữ số ${item.digit}`,
  },
  trainingModes: [
    {
      id: 'number-recall',
      name: 'Ghi nhớ và tái hiện',
      description: 'Ghi nhớ dãy số rồi nhập lại theo đúng thứ tự.',
      getQuestion: (item) => ({ type: 'text', value: item.digit }),
      getCorrectAnswer: (item) => ({ type: 'text', value: item.digit }),
      getDistractorAnswer: (item) => ({ type: 'text', value: item.digit }),
    },
  ],
  groups: [],
};
