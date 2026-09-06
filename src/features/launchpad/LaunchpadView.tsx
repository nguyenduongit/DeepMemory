import React, { useEffect } from 'react';
import { moduleRegistry } from '../../core/module/module-registry';
import { CATEGORY_LABELS, ModuleCategory } from '../../core/module/module-types';
import { ModuleCard } from './ModuleCard';
import { useAppStore } from '../../stores/useAppStore';
import { useProgressStore } from '../../stores/useProgressStore';
import { PageContainer } from '../../components/layout/PageContainer';
import { Flame, Zap, Compass } from 'lucide-react';

export const LaunchpadView: React.FC = () => {
  const { navigate } = useAppStore();
  const { moduleProgressMap, loadAllModuleData } = useProgressStore();

  useEffect(() => {
    const ids = moduleRegistry.map((m) => m.id);
    loadAllModuleData(ids);
  }, [loadAllModuleData]);

  // Categories in preferred order
  const categories: ModuleCategory[] = ['memory', 'geography', 'science', 'language'];

  return (
    <PageContainer maxWidth="lg" className="pb-24">
      {/* Daily Training Hero Banner (Section 9 & 42) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 p-6 sm:p-7 mb-8 shadow-2xl shadow-indigo-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono uppercase tracking-wide mb-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> Hôm nay
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Luyện Tập Phản Xạ Trí Não
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Chỉ 5–10 phút mỗi ngày để tạo phản xạ vô điều kiện chuyển đổi dữ liệu.
            </p>
          </div>

          <button
            onClick={() => navigate({ name: 'module-home', moduleId: 'numbers-00-99' })}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4" /> Bắt đầu ngay
          </button>
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Module Categories Grid (Section 7, 9) */}
      <div className="space-y-8">
        {categories.map((cat) => {
          const modulesInCat = moduleRegistry.filter((m) => m.category === cat);
          if (modulesInCat.length === 0) return null;

          return (
            <section key={cat} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <h2 className="font-display font-black text-sm tracking-wider uppercase text-slate-300">
                  {CATEGORY_LABELS[cat]}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modulesInCat.map((module) => {
                  const progress = moduleProgressMap[module.id];
                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      masteryPercent={progress?.masteryPercent || 0}
                      bestTimeMs={progress?.bestTimeMs}
                      onClick={() => navigate({ name: 'module-home', moduleId: module.id })}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
};
