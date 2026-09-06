import { AnswerContent } from '../types/content-types';
import { TrainingMode } from './training-types';

/**
 * Compare two AnswerContent values for equality
 */
export function areAnswersEqual(a: AnswerContent, b: AnswerContent): boolean {
  if (a.type !== b.type) return false;
  if (a.type === 'text' && b.type === 'text') {
    return a.value.trim() === b.value.trim();
  }
  if (a.type === 'image' && b.type === 'image') {
    return a.src === b.src;
  }
  return false;
}

/**
 * Generate unique distractor options for a quiz question
 */
export function generateDistractors<TItem>(
  dataset: TItem[],
  currentItem: TItem,
  mode: TrainingMode<TItem>,
  count: number = 3
): AnswerContent[] {
  const correctAnswer = mode.getCorrectAnswer(currentItem);
  const distractors: AnswerContent[] = [];

  // Filter out the current item candidate pool
  const candidates = dataset.filter((item) => {
    const candidateAnswer = mode.getDistractorAnswer(item);
    return !areAnswersEqual(candidateAnswer, correctAnswer);
  });

  // Shuffle candidates
  const shuffledCandidates = [...candidates].sort(() => Math.random() - 0.5);

  for (const candidate of shuffledCandidates) {
    if (distractors.length >= count) break;
    const answer = mode.getDistractorAnswer(candidate);

    // Ensure uniqueness among chosen distractors
    const alreadyChosen = distractors.some((existing) => areAnswersEqual(existing, answer));
    if (!alreadyChosen) {
      distractors.push(answer);
    }
  }

  return distractors;
}
