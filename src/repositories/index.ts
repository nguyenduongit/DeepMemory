import { HybridProgressRepository } from './hybrid-progress-repository';
import { ProgressRepository } from './progress-repository';

export const progressRepository: ProgressRepository = new HybridProgressRepository();

export * from './progress-repository';
export * from './hybrid-progress-repository';
export * from './indexeddb/indexeddb-progress-repository';
export * from './supabase/supabase-progress-repository';
