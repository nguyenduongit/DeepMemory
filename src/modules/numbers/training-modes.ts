import { TrainingMode } from '../../core/training/training-types';
import { NumberMemoryItem } from './types';

export const numberImageToNumberMode: TrainingMode<NumberMemoryItem> = {
  id: 'image-to-number',
  name: 'Hình → Số',
  description: 'Nhìn hình ảnh biểu tượng, phản xạ chọn con số tương ứng',
  getQuestion: (item) => ({
    type: 'image',
    src: item.imageUrl,
    alt: item.name,
  }),
  getCorrectAnswer: (item) => ({
    type: 'text',
    value: item.number,
  }),
  getDistractorAnswer: (item) => ({
    type: 'text',
    value: item.number,
  }),
};

export const numberNumberToImageMode: TrainingMode<NumberMemoryItem> = {
  id: 'number-to-image',
  name: 'Số → Hình',
  description: 'Nhìn con số, phản xạ chọn hình ảnh biểu tượng tương ứng',
  getQuestion: (item) => ({
    type: 'text',
    value: item.number,
  }),
  getCorrectAnswer: (item) => ({
    type: 'image',
    src: item.imageUrl,
    alt: item.name,
  }),
  getDistractorAnswer: (item) => ({
    type: 'image',
    src: item.imageUrl,
    alt: item.name,
  }),
};
