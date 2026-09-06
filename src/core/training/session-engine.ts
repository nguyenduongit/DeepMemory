import { TrainingSession, SessionAnswer } from './training-types';
import { calculateAccuracy, calculateAverageReaction } from './scoring';

export interface FinalizeSessionParams {
  sessionId: string;
  moduleId: string;
  modeId: string;
  groupId?: string;
  answers: SessionAnswer[];
  totalQuestions: number;
  durationMs: number;
}

export function finalizeTrainingSession(params: FinalizeSessionParams): TrainingSession {
  const { sessionId, moduleId, modeId, groupId, answers, totalQuestions, durationMs } = params;

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const wrongAnswers = answers.length - correctAnswers;
  const accuracy = calculateAccuracy(correctAnswers, totalQuestions);
  const averageReactionMs = calculateAverageReaction(answers);

  return {
    id: sessionId,
    moduleId,
    modeId,
    groupId,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    accuracy,
    durationMs,
    averageReactionMs,
    completedAt: new Date().toISOString(),
  };
}
