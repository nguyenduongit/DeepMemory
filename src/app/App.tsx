import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';

// Feature Views
import { LaunchpadView } from '../features/launchpad/LaunchpadView';
import { ModuleHomeView } from '../features/module-home/ModuleHomeView';
import { UniversalLearningView } from '../features/learning/UniversalLearningView';
import { TrainingSetupView } from '../features/training-setup/TrainingSetupView';
import { TrainingSessionView } from '../features/training-session/TrainingSessionView';
import { ResultView } from '../features/results/ResultView';
import { StatisticsView } from '../features/statistics/StatisticsView';
import { SettingsView } from '../features/settings/SettingsView';
import { loadModulesFromSupabase } from '../core/module/module-loader';
import { Database, RefreshCw, WifiOff } from 'lucide-react';

type CatalogState = 'loading' | 'ready' | 'error';

export const App: React.FC = () => {
  const { currentRoute } = useAppStore();
  const { loadSettings } = useSettingsStore();
  const [catalogState, setCatalogState] = useState<CatalogState>('loading');
  const [catalogError, setCatalogError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    let active = true;

    loadModulesFromSupabase()
      .then(() => {
        if (active) setCatalogState('ready');
      })
      .catch((error: unknown) => {
        if (!active) return;
        setCatalogError(error instanceof Error ? error.message : 'Không thể tải dữ liệu học tập.');
        setCatalogState('error');
      });

    return () => {
      active = false;
    };
  }, [reloadCount]);

  if (catalogState !== 'ready') {
    const failed = catalogState === 'error';
    return (
      <div className="app-shell bg-slate-950 text-slate-100 grid place-items-center px-6">
        <section className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900/80 p-7 text-center shadow-2xl shadow-slate-950/50">
          <div className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl ${failed ? 'bg-rose-500/15 text-rose-400' : 'bg-indigo-500/15 text-indigo-400'}`}>
            {failed ? <WifiOff className="h-7 w-7" /> : <Database className="h-7 w-7 animate-pulse" />}
          </div>
          <h1 className="font-display text-xl font-black text-white">
            {failed ? 'Không tải được dữ liệu' : 'Đang tải dữ liệu mới nhất'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {failed ? 'DeepMemory cần kết nối mạng để hoạt động. Hãy kiểm tra mạng rồi thử lại.' : 'Đang đồng bộ nội dung học tập từ máy chủ…'}
          </p>
          {failed ? (
            <>
              <p className="mt-3 break-words text-xs text-slate-600">{catalogError}</p>
              <button
                type="button"
                onClick={() => {
                  setCatalogState('loading');
                  setCatalogError('');
                  setReloadCount((count) => count + 1);
                }}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <RefreshCw className="h-4 w-4" /> Thử lại
              </button>
            </>
          ) : null}
        </section>
      </div>
    );
  }

  const renderView = () => {
    switch (currentRoute.name) {
      case 'launchpad':
        return (
          <>
            <Header />
            <LaunchpadView />
          </>
        );
      case 'module-home':
        return <ModuleHomeView moduleId={currentRoute.moduleId} />;
      case 'learning':
        return <UniversalLearningView key={currentRoute.moduleId} moduleId={currentRoute.moduleId} />;
      case 'training-setup':
        return <TrainingSetupView moduleId={currentRoute.moduleId} />;
      case 'training-session':
        return <TrainingSessionView moduleId={currentRoute.moduleId} />;
      case 'result':
        return <ResultView moduleId={currentRoute.moduleId} />;
      case 'statistics':
        return <StatisticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <>
            <Header />
            <LaunchpadView />
          </>
        );
    }
  };

  return (
    <div className="app-shell bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      <main className="app-content flex flex-col w-full">{renderView()}</main>
      <div className="app-footer">
        <BottomNav />
      </div>
    </div>
  );
};
