import Dexie, { type EntityTable } from 'dexie';
import { TrainingSession } from '../../core/training/training-types';
import {
  ItemProgress,
  ModuleProgress,
  BestTimeRecord,
  UserSettings,
} from '../../core/progress/progress-types';

export interface SettingRecord {
  key: string;
  value: UserSettings;
}

export class AioMemoryDatabase extends Dexie {
  sessions!: EntityTable<TrainingSession, 'id'>;
  item_progress!: Dexie.Table<ItemProgress, [string, string]>;
  module_progress!: EntityTable<ModuleProgress, 'moduleId'>;
  best_times!: EntityTable<BestTimeRecord, 'key'>;
  settings!: EntityTable<SettingRecord, 'key'>;

  constructor() {
    super('AioMemoryTrainerDB');
    this.version(1).stores({
      sessions: 'id, moduleId, modeId, groupId, completedAt',
      item_progress: '[moduleId+itemId], moduleId, itemId, masteryLevel',
      module_progress: 'moduleId',
      best_times: 'key, moduleId',
      settings: 'key',
    });
  }
}

export const db = new AioMemoryDatabase();
