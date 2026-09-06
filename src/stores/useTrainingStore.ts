import { create } from 'zustand';
import { ModuleDefinition } from '../core/module/module-types';
import {
  QuizQuestion,
  SessionAnswer,
  TrainingSession,
  TrainingSetupConfig,
} from '../core/training/training-types';
import { generateQuestions } from '../core/training/question-generator';
import { finalizeTrainingSession } from '../core/training/session-engine';
import { now } from '../core/training/timer';
import { preloadImage } from '../utils/image-preload';
import { useProgressStore } from './useProgressStore';
import { playTapSound, playSessionCompleteSound } from '../utils/sound';
import { useSettingsStore } from './useSettingsStore';

interface TrainingState {
  status: 'idle' | 'preparing' | 'running' | 'completed';
  moduleId?: string;
  modeId?: string;
  groupId?: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: SessionAnswer[];
  startedAt?: number;
  finishedAt?: number;
  questionStartedAt: number;
  answerLocked: boolean;
  lastSessionResult?: TrainingSession;
  isNewBestTime: boolean;

  prepareSession: <TItem>(module: ModuleDefinition<TItem>, config: TrainingSetupConfig) => void;
  startSession: () => void;
  answerQuestion: (selectedOptionId: string) => Promise<void>;
  resetSession: () => void;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  status: 'idle',
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  questionStartedAt: 0,
  answerLocked: false,
  isNewBestTime: false,

  prepareSession: (module, config) => {
    const questions = generateQuestions(module, config);

    // Preload first two question images if any
    questions.slice(0, 2).forEach((q) => {
      if (q.question.type === 'image') {
        preloadImage(q.question.src);
      }
      q.options.forEach((opt) => {
        if (opt.content.type === 'image') {
          preloadImage(opt.content.src);
        }
      });
    });

    set({
      status: 'preparing',
      moduleId: module.id,
      modeId: config.modeId,
      groupId: config.groupId,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      answerLocked: false,
      startedAt: undefined,
      finishedAt: undefined,
      lastSessionResult: undefined,
      isNewBestTime: false,
    });
  },

  startSession: () => {
    const startTime = now();
    set({
      status: 'running',
      startedAt: startTime,
      questionStartedAt: startTime,
      answerLocked: false,
    });
  },

  answerQuestion: async (selectedOptionId: string) => {
    const state = get();
    if (state.answerLocked || state.status !== 'running') {
      return;
    }

    const { soundEnabled } = useSettingsStore.getState().settings;
    playTapSound(soundEnabled);

    // Lock answer immediately to prevent double clicks (Section 23)
    set({ answerLocked: true });

    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const currentTime = now();
    const reactionMs = Math.max(10, Math.round(currentTime - state.questionStartedAt));

    const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const correctOption = currentQuestion.options.find((o) => o.isCorrect);

    const isCorrect = selectedOption?.isCorrect ?? false;

    const answerRecord: SessionAnswer = {
      questionId: currentQuestion.id,
      itemId: currentQuestion.itemId,
      selectedOptionId,
      correctOptionId: correctOption?.id || '',
      isCorrect,
      reactionMs,
    };

    const newAnswers = [...state.answers, answerRecord];
    const isLastQuestion = state.currentQuestionIndex >= state.questions.length - 1;

    if (!isLastQuestion) {
      // Advance to next question instantly (<100ms feel)
      const nextIndex = state.currentQuestionIndex + 1;

      // Preload next upcoming questions in background
      const upcoming = state.questions[nextIndex + 1];
      if (upcoming) {
        if (upcoming.question.type === 'image') preloadImage(upcoming.question.src);
        upcoming.options.forEach((opt) => {
          if (opt.content.type === 'image') preloadImage(opt.content.src);
        });
      }

      set({
        answers: newAnswers,
        currentQuestionIndex: nextIndex,
        questionStartedAt: now(),
        answerLocked: false,
      });
    } else {
      // Session finished
      const finishTime = now();
      const durationMs = Math.round(finishTime - (state.startedAt || finishTime));

      const sessionResult = finalizeTrainingSession({
        sessionId: `session_${Date.now()}`,
        moduleId: state.moduleId || 'unknown',
        modeId: state.modeId || 'unknown',
        groupId: state.groupId,
        answers: newAnswers,
        totalQuestions: state.questions.length,
        durationMs,
      });

      playSessionCompleteSound(soundEnabled);

      // Async save progress
      const totalItems = state.questions.length; // fallback
      const { isNewBestTime } = await useProgressStore
        .getState()
        .recordSessionCompletion(sessionResult, newAnswers, totalItems);

      set({
        status: 'completed',
        finishedAt: finishTime,
        answers: newAnswers,
        lastSessionResult: sessionResult,
        isNewBestTime,
        answerLocked: false,
      });
    }
  },

  resetSession: () => {
    set({
      status: 'idle',
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      startedAt: undefined,
      finishedAt: undefined,
      lastSessionResult: undefined,
      isNewBestTime: false,
      answerLocked: false,
    });
  },
}));
