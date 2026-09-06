import { ProgressRepository } from '../progress-repository';
import { supabase } from '../../lib/supabase';
import { TrainingSession } from '../../core/training/training-types';
import {
  ItemProgress,
  ModuleProgress,
  BestTimeRecord,
  UserSettings,
} from '../../core/progress/progress-types';

const USER_ID = 'guest';

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  reducedMotion: false,
  theme: 'dark',
};

export class SupabaseProgressRepository implements ProgressRepository {
  async saveSession(session: TrainingSession): Promise<void> {
    const { error } = await supabase.from('training_sessions').insert({
      id: session.id,
      user_id: USER_ID,
      module_id: session.moduleId,
      mode_id: session.modeId,
      group_id: session.groupId ?? null,
      total_questions: session.totalQuestions,
      correct_answers: session.correctAnswers,
      wrong_answers: session.wrongAnswers,
      accuracy: session.accuracy,
      duration_ms: session.durationMs,
      average_reaction_ms: session.averageReactionMs ?? null,
      completed_at: session.completedAt,
    });

    if (error) {
      console.warn('Supabase saveSession error:', error.message);
    }
  }

  async getSessionById(id: string): Promise<TrainingSession | undefined> {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return undefined;

    return {
      id: data.id,
      moduleId: data.module_id,
      modeId: data.mode_id,
      groupId: data.group_id ?? undefined,
      totalQuestions: data.total_questions,
      correctAnswers: data.correct_answers,
      wrongAnswers: data.wrong_answers,
      accuracy: Number(data.accuracy),
      durationMs: data.duration_ms,
      averageReactionMs: data.average_reaction_ms ?? undefined,
      completedAt: data.completed_at,
    };
  }

  async getSessionHistory(moduleId?: string, limit: number = 20): Promise<TrainingSession[]> {
    let query = supabase
      .from('training_sessions')
      .select('*')
      .eq('user_id', USER_ID)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      moduleId: d.module_id,
      modeId: d.mode_id,
      groupId: d.group_id ?? undefined,
      totalQuestions: d.total_questions,
      correctAnswers: d.correct_answers,
      wrongAnswers: d.wrong_answers,
      accuracy: Number(d.accuracy),
      durationMs: d.duration_ms,
      averageReactionMs: d.average_reaction_ms ?? undefined,
      completedAt: d.completed_at,
    }));
  }

  async getItemProgress(moduleId: string, itemId: string): Promise<ItemProgress | undefined> {
    const { data, error } = await supabase
      .from('item_progress')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('module_id', moduleId)
      .eq('item_id', itemId)
      .maybeSingle();

    if (error || !data) return undefined;

    return {
      itemId: data.item_id,
      moduleId: data.module_id,
      seenCount: data.seen_count,
      correctCount: data.correct_count,
      wrongCount: data.wrong_count,
      accuracy: Number(data.accuracy),
      averageReactionMs: data.average_reaction_ms ?? undefined,
      masteryScore: data.mastery_score,
      masteryLevel: data.mastery_level,
      lastPracticedAt: data.last_practiced_at,
    };
  }

  async getAllItemProgress(moduleId: string): Promise<ItemProgress[]> {
    const { data, error } = await supabase
      .from('item_progress')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('module_id', moduleId);

    if (error || !data) return [];

    return data.map((d) => ({
      itemId: d.item_id,
      moduleId: d.module_id,
      seenCount: d.seen_count,
      correctCount: d.correct_count,
      wrongCount: d.wrong_count,
      accuracy: Number(d.accuracy),
      averageReactionMs: d.average_reaction_ms ?? undefined,
      masteryScore: d.mastery_score,
      masteryLevel: d.mastery_level,
      lastPracticedAt: d.last_practiced_at,
    }));
  }

  async saveItemProgress(progress: ItemProgress): Promise<void> {
    const { error } = await supabase.from('item_progress').upsert(
      {
        user_id: USER_ID,
        module_id: progress.moduleId,
        item_id: progress.itemId,
        seen_count: progress.seenCount,
        correct_count: progress.correctCount,
        wrong_count: progress.wrongCount,
        accuracy: progress.accuracy,
        average_reaction_ms: progress.averageReactionMs ?? null,
        mastery_score: progress.masteryScore,
        mastery_level: progress.masteryLevel,
        last_practiced_at: progress.lastPracticedAt ?? new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id,item_id' }
    );

    if (error) {
      console.warn('Supabase saveItemProgress error:', error.message);
    }
  }

  async saveItemProgressBatch(progressList: ItemProgress[]): Promise<void> {
    if (progressList.length === 0) return;

    const payload = progressList.map((p) => ({
      user_id: USER_ID,
      module_id: p.moduleId,
      item_id: p.itemId,
      seen_count: p.seenCount,
      correct_count: p.correctCount,
      wrong_count: p.wrongCount,
      accuracy: p.accuracy,
      average_reaction_ms: p.averageReactionMs ?? null,
      mastery_score: p.masteryScore,
      mastery_level: p.masteryLevel,
      last_practiced_at: p.lastPracticedAt ?? new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('item_progress')
      .upsert(payload, { onConflict: 'user_id,module_id,item_id' });

    if (error) {
      console.warn('Supabase saveItemProgressBatch error:', error.message);
    }
  }

  async getModuleProgress(moduleId: string): Promise<ModuleProgress | undefined> {
    const { data, error } = await supabase
      .from('module_progress')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('module_id', moduleId)
      .maybeSingle();

    if (error || !data) return undefined;

    return {
      moduleId: data.module_id,
      masteryScore: data.mastery_score,
      masteryPercent: Number(data.mastery_percent),
      completedSessions: data.completed_sessions,
      totalAnswers: data.total_answers,
      correctAnswers: data.correct_answers,
      bestTimeMs: data.best_time_ms ?? undefined,
      updatedAt: data.updated_at,
    };
  }

  async saveModuleProgress(progress: ModuleProgress): Promise<void> {
    const { error } = await supabase.from('module_progress').upsert(
      {
        user_id: USER_ID,
        module_id: progress.moduleId,
        mastery_score: progress.masteryScore,
        mastery_percent: progress.masteryPercent,
        completed_sessions: progress.completedSessions,
        total_answers: progress.totalAnswers,
        correct_answers: progress.correctAnswers,
        best_time_ms: progress.bestTimeMs ?? null,
        updated_at: progress.updatedAt,
      },
      { onConflict: 'user_id,module_id' }
    );

    if (error) {
      console.warn('Supabase saveModuleProgress error:', error.message);
    }
  }

  async getBestTime(key: string): Promise<BestTimeRecord | undefined> {
    const { data, error } = await supabase
      .from('best_times')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('record_key', key)
      .order('duration_ms', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) return undefined;

    return {
      key: data.record_key,
      moduleId: data.module_id,
      modeId: data.mode_id,
      groupId: data.group_id,
      questionCount: data.question_count,
      durationMs: data.duration_ms,
      accuracy: Number(data.accuracy),
      achievedAt: data.achieved_at,
    };
  }

  async saveBestTime(record: BestTimeRecord): Promise<void> {
    const { error } = await supabase.from('best_times').insert({
      user_id: USER_ID,
      record_key: record.key,
      module_id: record.moduleId,
      mode_id: record.modeId,
      group_id: record.groupId,
      question_count: record.questionCount,
      duration_ms: record.durationMs,
      accuracy: record.accuracy,
      achieved_at: record.achievedAt,
    });

    if (error) {
      console.warn('Supabase saveBestTime error:', error.message);
    }
  }

  async getBestTimesByModule(moduleId: string): Promise<BestTimeRecord[]> {
    const { data, error } = await supabase
      .from('best_times')
      .select('*')
      .eq('user_id', USER_ID)
      .eq('module_id', moduleId);

    if (error || !data) return [];

    return data.map((d) => ({
      key: d.record_key,
      moduleId: d.module_id,
      modeId: d.mode_id,
      groupId: d.group_id,
      questionCount: d.question_count,
      durationMs: d.duration_ms,
      accuracy: Number(d.accuracy),
      achievedAt: d.achieved_at,
    }));
  }

  async getSettings(): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', USER_ID)
      .maybeSingle();

    if (error || !data) return DEFAULT_SETTINGS;

    return {
      soundEnabled: data.sound_enabled ?? true,
      reducedMotion: data.reduced_motion ?? false,
      theme: data.theme === 'light' ? 'light' : 'dark',
    };
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const { error } = await supabase.from('user_settings').upsert(
      {
        user_id: USER_ID,
        theme: settings.theme,
        sound_enabled: settings.soundEnabled,
        reduced_motion: settings.reducedMotion,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.warn('Supabase saveSettings error:', error.message);
    }
  }

  async clearAllData(): Promise<void> {
    await Promise.all([
      supabase.from('training_sessions').delete().eq('user_id', USER_ID),
      supabase.from('item_progress').delete().eq('user_id', USER_ID),
      supabase.from('module_progress').delete().eq('user_id', USER_ID),
      supabase.from('best_times').delete().eq('user_id', USER_ID),
      supabase.from('user_settings').delete().eq('user_id', USER_ID),
    ]);
  }
}
