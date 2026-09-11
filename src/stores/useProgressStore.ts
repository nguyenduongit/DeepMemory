import { create } from 'zustand';
import {
  ItemProgress,
  ModuleProgress,
  BestTimeRecord,
} from '../core/progress/progress-types';
import { TrainingSession, SessionAnswer } from '../core/training/training-types';
import { progressRepository } from '../repositories';
import { updateItemProgressRecord } from '../core/progress/mastery-engine';
import { calculateModuleMasterySummary } from '../core/progress/statistics-engine';
import { generateBestTimeKey, requiresPerfectAccuracyForRecord } from '../core/training/scoring';

interface ProgressState {
  moduleProgressMap: Record<string, ModuleProgress>;
  bestTimesMap: Record<string, BestTimeRecord>;
  itemProgressMap: Record<string, ItemProgress[]>;
  recentSessions: TrainingSession[];
  isLoading: boolean;

  loadModuleProgress: (moduleId: string) => Promise<void>;
  loadAllModuleData: (moduleIds: string[]) => Promise<void>;
  loadRecentSessions: (moduleId?: string) => Promise<void>;
  recordSessionCompletion: (
    session: TrainingSession,
    answers: SessionAnswer[],
    totalModuleItems: number
  ) => Promise<{ isNewBestTime: boolean }>;
  resetAllProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  moduleProgressMap: {},
  bestTimesMap: {},
  itemProgressMap: {},
  recentSessions: [],
  isLoading: true,

  loadModuleProgress: async (moduleId: string) => {
    const [modProgress, bestTimes, itemProgressList] = await Promise.all([
      progressRepository.getModuleProgress(moduleId),
      progressRepository.getBestTimesByModule(moduleId),
      progressRepository.getAllItemProgress(moduleId),
    ]);

    const bestMap: Record<string, BestTimeRecord> = {};
    bestTimes.forEach((bt) => {
      bestMap[bt.key] = bt;
    });

    set((state) => ({
      moduleProgressMap: modProgress
        ? { ...state.moduleProgressMap, [moduleId]: modProgress }
        : state.moduleProgressMap,
      bestTimesMap: { ...state.bestTimesMap, ...bestMap },
      itemProgressMap: { ...state.itemProgressMap, [moduleId]: itemProgressList },
    }));
  },

  loadAllModuleData: async (moduleIds: string[]) => {
    set({ isLoading: true });
    try {
      await Promise.all(moduleIds.map((id) => get().loadModuleProgress(id)));
      await get().loadRecentSessions();
    } finally {
      set({ isLoading: false });
    }
  },

  loadRecentSessions: async (moduleId?: string) => {
    const sessions = await progressRepository.getSessionHistory(moduleId, 15);
    set({ recentSessions: sessions });
  },

  recordSessionCompletion: async (
    session: TrainingSession,
    answers: SessionAnswer[],
    totalModuleItems: number
  ) => {
    const { moduleId, modeId, groupId, totalQuestions, durationMs, accuracy } = session;

    // 1. Save session to repository
    await progressRepository.saveSession(session);

    // 2. Update item progress records
    const existingItems = await progressRepository.getAllItemProgress(moduleId);
    const itemMap = new Map<string, ItemProgress>();
    existingItems.forEach((it) => itemMap.set(it.itemId, it));

    const updatedItemsList: ItemProgress[] = [];
    for (const ans of answers) {
      const existing = itemMap.get(ans.itemId);
      const updated = updateItemProgressRecord(
        existing,
        moduleId,
        ans.itemId,
        ans.isCorrect,
        ans.reactionMs
      );
      itemMap.set(ans.itemId, updated);
      updatedItemsList.push(updated);
    }
    await progressRepository.saveItemProgressBatch(Array.from(itemMap.values()));

    // 3. Compute module progress & mastery
    const allProgressList = Array.from(itemMap.values());
    const summary = calculateModuleMasterySummary(totalModuleItems, allProgressList);

    // Check Best Time (only valid when accuracy is 100% or equal/better)
    const bestKey = generateBestTimeKey(moduleId, modeId, groupId || 'all', totalQuestions);
    const existingBest = await progressRepository.getBestTime(bestKey);

    const requiresPerfectRecall = requiresPerfectAccuracyForRecord(moduleId, modeId);
    const isEligibleForBestTime = !requiresPerfectRecall || accuracy === 100;
    let isNewBestTime = false;
    // New best time if: no record exists OR higher accuracy OR same accuracy (or 100%) with lower time
    if (!isEligibleForBestTime) {
      isNewBestTime = false;
    } else if (!existingBest) {
      isNewBestTime = true;
    } else if (accuracy > existingBest.accuracy) {
      isNewBestTime = true;
    } else if (accuracy === existingBest.accuracy && durationMs < existingBest.durationMs) {
      isNewBestTime = true;
    }

    if (isNewBestTime) {
      const newBestRecord: BestTimeRecord = {
        key: bestKey,
        moduleId,
        modeId,
        groupId: groupId || 'all',
        questionCount: totalQuestions,
        durationMs,
        accuracy,
        achievedAt: session.completedAt,
      };
      await progressRepository.saveBestTime(newBestRecord);
    }

    // Update module progress summary
    const existingMod = await progressRepository.getModuleProgress(moduleId);
    const updatedModuleProgress: ModuleProgress = {
      moduleId,
      masteryScore: summary.averageMasteryScore,
      masteryPercent: summary.masteryPercent,
      completedSessions: (existingMod?.completedSessions || 0) + 1,
      totalAnswers: (existingMod?.totalAnswers || 0) + totalQuestions,
      correctAnswers: (existingMod?.correctAnswers || 0) + session.correctAnswers,
      bestTimeMs: isNewBestTime ? durationMs : existingMod?.bestTimeMs,
      updatedAt: new Date().toISOString(),
    };
    await progressRepository.saveModuleProgress(updatedModuleProgress);

    // Reload store state
    await get().loadModuleProgress(moduleId);
    await get().loadRecentSessions();

    return { isNewBestTime };
  },

  resetAllProgress: async () => {
    await progressRepository.clearAllData();
    set({
      moduleProgressMap: {},
      bestTimesMap: {},
      itemProgressMap: {},
      recentSessions: [],
    });
  },
}));
