export type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

export interface MemoryCardItem {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  suit: CardSuit;
  rank: string;
  mnemonicNumber: string;
  mnemonicName: string;
  mnemonicImageUrl: string;
  sortOrder: number;
}

export type MemoryCardsScreen = 'home' | 'mapping' | 'reflex' | 'memorize' | 'recall' | 'result';

export interface RecallResult {
  correctCount: number;
  firstErrorIndex: number | null;
  longestStreak: number;
  accuracy: number;
  durationMs: number;
}
