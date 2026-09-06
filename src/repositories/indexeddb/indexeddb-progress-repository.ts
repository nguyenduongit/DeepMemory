import { ProgressRepository } from '../progress-repository';
import { db } from './db';
import { TrainingSession } from '../../core/training/training-types';
import {
  ItemProgress,
  ModuleProgress,
  BestTimeRecord,
  UserSettings,
} from '../../core/progress/progress-types';

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  reducedMotion: false,
  theme: 'dark',
};

export class IndexedDBProgressRepository implements ProgressRepository {
  async saveSession(session: TrainingSession): Promise<void> {
    await db.sessions.put(session);
  }

  async getSessionById(id: string): Promise<TrainingSession | undefined> {
    return await db.sessions.get(id);
  }

  async getSessionHistory(moduleId?: string, limit: number = 20): Promise<TrainingSession[]> {
    if (moduleId) {
      return await db.sessions
        .where('moduleId')
        .equals(moduleId)
        .reverse()
        .sortBy('completedAt')
        .then((items) => items.slice(0, limit));
    }
    return await db.sessions
      .orderBy('completedAt')
      .reverse()
      .limit(limit)
      .toArray();
  }

  async getItemProgress(moduleId: string, itemId: string): Promise<ItemProgress | undefined> {
    return await db.item_progress.get([moduleId, itemId]);
  }

  async getAllItemProgress(moduleId: string): Promise<ItemProgress[]> {
    return await db.item_progress.where('moduleId').equals(moduleId).toArray();
  }

  async saveItemProgress(progress: ItemProgress): Promise<void> {
    await db.item_progress.put(progress);
  }

  async saveItemProgressBatch(progressList: ItemProgress[]): Promise<void> {
    await db.item_progress.bulkPut(progressList);
  }

  async getModuleProgress(moduleId: string): Promise<ModuleProgress | undefined> {
    return await db.module_progress.get(moduleId);
  }

  async saveModuleProgress(progress: ModuleProgress): Promise<void> {
    await db.module_progress.put(progress);
  }

  async getBestTime(key: string): Promise<BestTimeRecord | undefined> {
    return await db.best_times.get(key);
  }

  async saveBestTime(record: BestTimeRecord): Promise<void> {
    await db.best_times.put(record);
  }

  async getBestTimesByModule(moduleId: string): Promise<BestTimeRecord[]> {
    return await db.best_times.where('moduleId').equals(moduleId).toArray();
  }

  async getSettings(): Promise<UserSettings> {
    const record = await db.settings.get('user_settings');
    return record?.value || DEFAULT_SETTINGS;
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    await db.settings.put({ key: 'user_settings', value: settings });
  }

  async clearAllData(): Promise<void> {
    await Promise.all([
      db.sessions.clear(),
      db.item_progress.clear(),
      db.module_progress.clear(),
      db.best_times.clear(),
      db.settings.clear(),
    ]);
  }
}

// Singleton repository instance for app use
export const progressRepository: ProgressRepository = new IndexedDBProgressRepository();
