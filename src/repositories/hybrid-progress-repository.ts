import { ProgressRepository } from './progress-repository';
import { IndexedDBProgressRepository } from './indexeddb/indexeddb-progress-repository';
import { SupabaseProgressRepository } from './supabase/supabase-progress-repository';
import { TrainingSession } from '../core/training/training-types';
import {
  ItemProgress,
  ModuleProgress,
  BestTimeRecord,
  UserSettings,
} from '../core/progress/progress-types';

export class HybridProgressRepository implements ProgressRepository {
  private local = new IndexedDBProgressRepository();
  private remote = new SupabaseProgressRepository();

  async saveSession(session: TrainingSession): Promise<void> {
    await this.local.saveSession(session);
    // Background sync to Supabase without blocking UI (<5ms)
    this.remote.saveSession(session).catch((err) => {
      console.warn('Background sync session failed:', err);
    });
  }

  async getSessionById(id: string): Promise<TrainingSession | undefined> {
    const localRes = await this.local.getSessionById(id);
    if (localRes) return localRes;
    return await this.remote.getSessionById(id);
  }

  async getSessionHistory(moduleId?: string, limit: number = 20): Promise<TrainingSession[]> {
    const localList = await this.local.getSessionHistory(moduleId, limit);
    if (localList.length > 0) return localList;

    try {
      const remoteList = await this.remote.getSessionHistory(moduleId, limit);
      for (const s of remoteList) {
        await this.local.saveSession(s).catch(() => {});
      }
      return remoteList;
    } catch {
      return localList;
    }
  }

  async getItemProgress(moduleId: string, itemId: string): Promise<ItemProgress | undefined> {
    const localItem = await this.local.getItemProgress(moduleId, itemId);
    if (localItem) return localItem;
    return await this.remote.getItemProgress(moduleId, itemId);
  }

  async getAllItemProgress(moduleId: string): Promise<ItemProgress[]> {
    const localItems = await this.local.getAllItemProgress(moduleId);
    if (localItems.length > 0) return localItems;

    try {
      const remoteItems = await this.remote.getAllItemProgress(moduleId);
      if (remoteItems.length > 0) {
        await this.local.saveItemProgressBatch(remoteItems).catch(() => {});
        return remoteItems;
      }
    } catch {
      // Fallback to local
    }
    return localItems;
  }

  async saveItemProgress(progress: ItemProgress): Promise<void> {
    await this.local.saveItemProgress(progress);
    this.remote.saveItemProgress(progress).catch((err) => {
      console.warn('Background sync item progress failed:', err);
    });
  }

  async saveItemProgressBatch(progressList: ItemProgress[]): Promise<void> {
    await this.local.saveItemProgressBatch(progressList);
    this.remote.saveItemProgressBatch(progressList).catch((err) => {
      console.warn('Background sync batch progress failed:', err);
    });
  }

  async getModuleProgress(moduleId: string): Promise<ModuleProgress | undefined> {
    const localProgress = await this.local.getModuleProgress(moduleId);
    if (localProgress && localProgress.completedSessions > 0) return localProgress;

    try {
      const remoteProgress = await this.remote.getModuleProgress(moduleId);
      if (remoteProgress) {
        await this.local.saveModuleProgress(remoteProgress).catch(() => {});
        return remoteProgress;
      }
    } catch {
      // Fallback
    }
    return localProgress;
  }

  async saveModuleProgress(progress: ModuleProgress): Promise<void> {
    await this.local.saveModuleProgress(progress);
    this.remote.saveModuleProgress(progress).catch((err) => {
      console.warn('Background sync module progress failed:', err);
    });
  }

  async getBestTime(key: string): Promise<BestTimeRecord | undefined> {
    const localRecord = await this.local.getBestTime(key);
    if (localRecord) return localRecord;
    return await this.remote.getBestTime(key);
  }

  async saveBestTime(record: BestTimeRecord): Promise<void> {
    await this.local.saveBestTime(record);
    this.remote.saveBestTime(record).catch((err) => {
      console.warn('Background sync best time failed:', err);
    });
  }

  async getBestTimesByModule(moduleId: string): Promise<BestTimeRecord[]> {
    const localRecords = await this.local.getBestTimesByModule(moduleId);
    if (localRecords.length > 0) return localRecords;

    try {
      const remoteRecords = await this.remote.getBestTimesByModule(moduleId);
      for (const r of remoteRecords) {
        await this.local.saveBestTime(r).catch(() => {});
      }
      return remoteRecords;
    } catch {
      return localRecords;
    }
  }

  async getSettings(): Promise<UserSettings> {
    return await this.local.getSettings();
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    await this.local.saveSettings(settings);
    this.remote.saveSettings(settings).catch((err) => {
      console.warn('Background sync settings failed:', err);
    });
  }

  async clearAllData(): Promise<void> {
    await Promise.all([
      this.local.clearAllData(),
      this.remote.clearAllData(),
    ]);
  }
}
