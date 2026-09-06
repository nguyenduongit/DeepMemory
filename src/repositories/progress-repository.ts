import { TrainingSession } from '../core/training/training-types';
import {
  ItemProgress,
  ModuleProgress,
  BestTimeRecord,
  UserSettings,
} from '../core/progress/progress-types';

export interface ProgressRepository {
  // Sessions
  saveSession(session: TrainingSession): Promise<void>;
  getSessionById(id: string): Promise<TrainingSession | undefined>;
  getSessionHistory(moduleId?: string, limit?: number): Promise<TrainingSession[]>;

  // Item Progress
  getItemProgress(moduleId: string, itemId: string): Promise<ItemProgress | undefined>;
  getAllItemProgress(moduleId: string): Promise<ItemProgress[]>;
  saveItemProgress(progress: ItemProgress): Promise<void>;
  saveItemProgressBatch(progressList: ItemProgress[]): Promise<void>;

  // Module Progress
  getModuleProgress(moduleId: string): Promise<ModuleProgress | undefined>;
  saveModuleProgress(progress: ModuleProgress): Promise<void>;

  // Best Times
  getBestTime(key: string): Promise<BestTimeRecord | undefined>;
  saveBestTime(record: BestTimeRecord): Promise<void>;
  getBestTimesByModule(moduleId: string): Promise<BestTimeRecord[]>;

  // Settings
  getSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;

  // Reset / Danger zone
  clearAllData(): Promise<void>;
}
