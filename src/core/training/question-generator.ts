import { ModuleDefinition } from '../module/module-types';
import { QuizOption, QuizQuestion, TrainingSetupConfig } from './training-types';
import { generateDistractors } from './distractor-generator';

/**
 * Modern Fisher-Yates shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Universal Question Generator for any module
 */
export function generateQuestions<TItem>(
  module: ModuleDefinition<TItem>,
  config: TrainingSetupConfig
): QuizQuestion[] {
  // 1. Identify selected training mode
  const mode = module.trainingModes.find((m) => m.id === config.modeId);
  if (!mode) {
    throw new Error(`Training mode "${config.modeId}" not found in module "${module.id}".`);
  }

  // 2. Filter items by selected group
  let pool = [...module.items];
  if (config.groupId && module.groups) {
    const group = module.groups.find((g) => g.id === config.groupId);
    if (group && group.filter) {
      pool = pool.filter(group.filter);
    }
  }

  if (pool.length === 0) {
    return [];
  }

  // 3. Shuffle or maintain sequential order
  let selectedItems = config.order === 'random' ? shuffleArray(pool) : [...pool];

  // 4. Limit to question count if specified
  if (config.questionCount !== 'all') {
    const limit = typeof config.questionCount === 'number' ? config.questionCount : parseInt(config.questionCount, 10);
    if (!isNaN(limit) && limit > 0) {
      selectedItems = selectedItems.slice(0, limit);
    }
  }

  // 5. Generate questions and 4 options each
  return selectedItems.map((item, index) => {
    const itemId = (item as any).id || `item-${index}`;
    const questionContent = mode.getQuestion(item);
    const correctAnswerContent = mode.getCorrectAnswer(item);

    // Generate 3 unique distractors (pass pool or full module items if pool is smaller than 4)
    const distractorSource = pool.length >= 4 ? pool : module.items;
    const distractorContents = generateDistractors(distractorSource, item, mode, 3);

    // Build QuizOption array
    const rawOptions: QuizOption[] = [
      {
        id: `opt-${index}-correct`,
        content: correctAnswerContent,
        isCorrect: true,
      },
      ...distractorContents.map((content, dIdx) => ({
        id: `opt-${index}-distractor-${dIdx}`,
        content,
        isCorrect: false,
      })),
    ];

    // Shuffle options so correct answer is randomly located in 1 of 4 slots
    const options = shuffleArray(rawOptions);

    return {
      id: `q-${index}-${itemId}`,
      itemId,
      question: questionContent,
      correctAnswer: correctAnswerContent,
      options,
    };
  });
}
