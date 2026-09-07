import React, { useEffect } from 'react';
import { useProgressStore } from '../../stores/useProgressStore';
import { numbersModule } from '../../modules/numbers';
import { PageContainer } from '../../components/layout/PageContainer';
import { Header } from '../../components/layout/Header';
import { MasteryBadge } from '../../components/ui/Badge';
import { calculateModuleMasterySummary, identifyWeakItems } from '../../core/progress/statistics-engine';
import { AlertTriangle, Target } from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { moduleProgressMap, itemProgressMap, loadAllModuleData } = useProgressStore();

  useEffect(() => {
    loadAllModuleData(['numbers-00-99']);
  }, [loadAllModuleData]);

  const numProgress = moduleProgressMap['numbers-00-99'];
  const itemsProgress = itemProgressMap['numbers-00-99'] || [];

  const summary = calculateModuleMasterySummary(numbersModule.items.length, itemsProgress);
  const weakItems = identifyWeakItems(itemsProgress, 8);

  const totalAnswers = numProgress?.totalAnswers || 0;
  const correctAnswers = numProgress?.correctAnswers || 0;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <section className="h-full min-h-0 flex flex-col overflow-hidden">
      <div className="app-header">
        <Header title="Thống kê tổng hợp" />
      </div>

      <div className="app-scroll flex-1 min-h-0">
        <PageContainer maxWidth="md" className="pb-24 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Thành thạo</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-indigo-400 mt-1 block">{summary.masteryPercent}%</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Chính xác</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 mt-1 block">{accuracy}%</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Số câu đã luyện</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-white mt-1 block">{totalAnswers}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Số phiên tập</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-amber-400 mt-1 block">{numProgress?.completedSessions || 0}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>Phân bố mức độ thành thạo (00–99)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold text-emerald-400 uppercase">Mastered</span><span className="font-mono font-bold text-lg text-white">{summary.levelCounts.mastered}</span></div>
                <span className="text-[10px] text-slate-500 mt-1 block">Điểm: 80–100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-900/40">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold text-cyan-400 uppercase">Familiar</span><span className="font-mono font-bold text-lg text-white">{summary.levelCounts.familiar}</span></div>
                <span className="text-[10px] text-slate-500 mt-1 block">Điểm: 50–79</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/40">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold text-amber-400 uppercase">Learning</span><span className="font-mono font-bold text-lg text-white">{summary.levelCounts.learning}</span></div>
                <span className="text-[10px] text-slate-500 mt-1 block">Điểm: 25–49</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-400 uppercase">New</span><span className="font-mono font-bold text-lg text-white">{summary.levelCounts.new}</span></div>
                <span className="text-[10px] text-slate-500 mt-1 block">Chưa luyện</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Điểm cần cải thiện (Weak Items)</span>
            </div>

            {weakItems.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">Tuyệt vời! Hiện chưa có câu nào bị sai nhiều lần.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {weakItems.map((item) => {
                  const numItem = numbersModule.items.find((n) => n.id === item.itemId);
                  return (
                    <div key={item.itemId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-white text-base bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">{numItem?.number || item.itemId}</span>
                        <div>
                          <span className="font-semibold text-slate-200 block">{numItem?.name || ''}</span>
                          <span className="text-[11px] text-rose-400">Sai {item.wrongCount} lần ({item.accuracy}%)</span>
                        </div>
                      </div>
                      <MasteryBadge level={item.masteryLevel} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PageContainer>
      </div>
    </section>
  );
};
