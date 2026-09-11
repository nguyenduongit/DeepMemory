import React, { useEffect } from 'react';
import { getModuleById } from '../../core/module/module-registry';
import { useAppStore } from '../../stores/useAppStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { PageContainer } from '../../components/layout/PageContainer';
import { Header } from '../../components/layout/Header';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { formatDuration, formatReactionSpeed } from '../../core/training/timer';
import { BookOpen, Play, Trophy, History, Clock, Timer } from 'lucide-react';

interface ModuleHomeViewProps {
  moduleId: string;
}

export const ModuleHomeView: React.FC<ModuleHomeViewProps> = ({ moduleId }) => {
  const module = getModuleById(moduleId);
  const { navigate } = useAppStore();
  const { moduleProgressMap, loadModuleProgress, recentSessions, loadRecentSessions } = useProgressStore();

  useEffect(() => {
    loadModuleProgress(moduleId);
    loadRecentSessions(moduleId);
  }, [moduleId, loadModuleProgress, loadRecentSessions]);

  if (!module) {
    return (
      <div className="h-full min-h-0 app-scroll">
        <PageContainer maxWidth="md">
          <div className="text-center py-12">
            <p className="text-slate-400">Không tìm thấy module.</p>
            <Button onClick={() => navigate({ name: 'launchpad' })} className="mt-4">
              Quay lại trang chủ
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  const progress = moduleProgressMap[moduleId];
  const masteryPercent = progress?.masteryPercent || 0;
  const moduleSessions = recentSessions.filter((s) => s.moduleId === moduleId);

  return (
    <section className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="app-header">
        <Header title={module.name} subtitle={module.subtitle} showBack />
      </div>

      <div className="app-scroll flex-1 min-h-0">
        <PageContainer maxWidth="md" className="space-y-6 pb-24">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Mức độ thành thạo</span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">{masteryPercent}%</h2>
              </div>
              {progress?.bestTimeMs && (
                <div className="text-right">
                  <span className="flex items-center gap-1 text-xs text-amber-400 font-semibold uppercase tracking-wide justify-end">
                    <Trophy className="w-3.5 h-3.5" /> Kỷ lục tốt nhất
                  </span>
                  <span className="font-mono font-black text-xl text-white">{formatDuration(progress.bestTimeMs)}</span>
                </div>
              )}
            </div>
            <ProgressBar progress={masteryPercent} size="md" variant="primary" />
            {module.description && <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">{module.description}</p>}
          </div>

          <div className={`grid grid-cols-1 gap-4 ${moduleId === 'numbers-00-99' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            <Button size="lg" variant="secondary" leftIcon={<BookOpen className="w-5 h-5 text-indigo-400" />} onClick={() => navigate({ name: 'learning', moduleId })} className="h-16 text-base">HỌC TẬP</Button>
            <Button size="lg" variant="primary" leftIcon={<Play className="w-5 h-5 fill-white" />} onClick={() => navigate({ name: 'training-setup', moduleId })} className="h-16 text-base">LUYỆN TẬP</Button>
            {moduleId === 'numbers-00-99' ? (
              <Button size="lg" variant="outline" leftIcon={<Timer className="w-5 h-5 text-cyan-400" />} onClick={() => navigate({ name: 'number-sequence' })} className="h-16 text-base sm:col-span-3 lg:col-span-1">THI ĐẤU</Button>
            ) : null}
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Thành tích gần đây</span>
            </div>
            {moduleSessions.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs sm:text-sm">Chưa có phiên luyện tập nào. Hãy bấm <strong>LUYỆN TẬP</strong> để bắt đầu thử thách!</div>
            ) : (
              <div className="space-y-2.5">
                {moduleSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm ${session.accuracy >= 90 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : session.accuracy >= 70 ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>{session.accuracy}%</div>
                      <div>
                        <div className="font-semibold text-slate-200">{session.correctAnswers} / {session.totalQuestions} câu đúng</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(session.durationMs)}</span>
                          {session.averageReactionMs && <><span>•</span><span>{formatReactionSpeed(session.averageReactionMs)}</span></>}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </section>
  );
};
