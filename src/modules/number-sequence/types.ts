export const NUMBER_SEQUENCE_LENGTHS = [20, 40, 80, 100, 200, 500] as const;

export type NumberSequenceLength = (typeof NUMBER_SEQUENCE_LENGTHS)[number];
export type NumberSequenceScreen = 'home' | 'memorize' | 'recall' | 'result';

export interface NumberSequenceResult {
  correctCount: number;
  firstErrorIndex: number | null;
  longestStreak: number;
  accuracy: number;
  durationMs: number;
}
