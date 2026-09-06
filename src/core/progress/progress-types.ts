export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered';

export interface ItemProgress {
  moduleId: string;
  itemId: string;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  averageReactionMs?: number;
  masteryScore: number;
  masteryLevel: MasteryLevel;
  lastPracticedAt?: string;
}

export interface ModuleProgress {
  moduleId: string;
  masteryScore: number;
  masteryPercent: number;
  completedSessions: number;
  totalAnswers: number;
  correctAnswers: number;
  bestTimeMs?: number;
  updatedAt: string;
}

export interface BestTimeRecord {
  id?: number;
  key: string; // `${moduleId}__${modeId}__${groupId}__${questionCount}`
  moduleId: string;
  modeId: string;
  groupId: string;
  questionCount: number;
  durationMs: number;
  accuracy: number;
  achievedAt: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
  theme: 'dark' | 'light';
}
