import { QuestionContent, AnswerContent } from '../types/content-types';

export interface TrainingMode<TItem> {
  id: string;
  name: string;
  description?: string;
  getQuestion: (item: TItem) => QuestionContent;
  getCorrectAnswer: (item: TItem) => AnswerContent;
  getDistractorAnswer: (item: TItem) => AnswerContent;
}

export interface QuizOption {
  id: string;
  content: AnswerContent;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  itemId: string;
  question: QuestionContent;
  correctAnswer: AnswerContent;
  options: QuizOption[];
}

export interface SessionAnswer {
  questionId: string;
  itemId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
  reactionMs: number;
}

export interface TrainingSession {
  id: string;
  moduleId: string;
  modeId: string;
  groupId?: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  durationMs: number;
  averageReactionMs?: number;
  completedAt: string;
}

export interface TrainingSetupConfig {
  modeId: string;
  groupId: string;
  questionCount: number | 'all';
  order: 'random' | 'sequential';
}
