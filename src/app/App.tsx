import React, { useEffect } from 'react';
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
import { syncModuleFromSupabase } from '../core/module/module-loader';

export const App: React.FC = () => {
  const { currentRoute } = useAppStore();
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    loadSettings();
    syncModuleFromSupabase('numbers-00-99');
  }, [loadSettings]);

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
