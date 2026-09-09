import { TrainingMode } from '../../core/training/training-types';
import { ChemicalElementItem, ELEMENT_CATEGORY_LABELS } from './types';

export const symbolToNameMode: TrainingMode<ChemicalElementItem> = {
  id: 'symbol-to-name',
  name: 'Ký hiệu → Tên',
  description: 'Nhìn ký hiệu hóa học và chọn tên tiếng Việt',
  getQuestion: (item) => ({ type: 'text', value: item.symbol }),
  getCorrectAnswer: (item) => ({ type: 'text', value: item.vietnameseName }),
  getDistractorAnswer: (item) => ({ type: 'text', value: item.vietnameseName }),
};

export const nameToSymbolMode: TrainingMode<ChemicalElementItem> = {
  id: 'name-to-symbol',
  name: 'Tên → Ký hiệu',
  description: 'Nhìn tên tiếng Việt và chọn ký hiệu hóa học',
  getQuestion: (item) => ({ type: 'text', value: item.vietnameseName }),
  getCorrectAnswer: (item) => ({ type: 'text', value: item.symbol }),
  getDistractorAnswer: (item) => ({ type: 'text', value: item.symbol }),
};

export const atomicNumberToSymbolMode: TrainingMode<ChemicalElementItem> = {
  id: 'atomic-number-to-symbol',
  name: 'Số Z → Ký hiệu',
  description: 'Nhìn số hiệu nguyên tử và chọn ký hiệu',
  getQuestion: (item) => ({ type: 'text', value: `Z = ${item.atomicNumber}` }),
  getCorrectAnswer: (item) => ({ type: 'text', value: item.symbol }),
  getDistractorAnswer: (item) => ({ type: 'text', value: item.symbol }),
};

export const symbolToAtomicNumberMode: TrainingMode<ChemicalElementItem> = {
  id: 'symbol-to-atomic-number',
  name: 'Ký hiệu → Số Z',
  description: 'Nhìn ký hiệu và chọn số hiệu nguyên tử',
  getQuestion: (item) => ({ type: 'text', value: item.symbol }),
  getCorrectAnswer: (item) => ({ type: 'text', value: item.atomicNumber.toString() }),
  getDistractorAnswer: (item) => ({ type: 'text', value: item.atomicNumber.toString() }),
};

export const symbolToCategoryMode: TrainingMode<ChemicalElementItem> = {
  id: 'symbol-to-category',
  name: 'Ký hiệu → Phân loại',
  description: 'Nhận diện nhóm tính chất của nguyên tố',
  getQuestion: (item) => ({ type: 'text', value: item.symbol }),
  getCorrectAnswer: (item) => ({ type: 'text', value: ELEMENT_CATEGORY_LABELS[item.category] }),
  getDistractorAnswer: (item) => ({ type: 'text', value: ELEMENT_CATEGORY_LABELS[item.category] }),
};
