import React from 'react';
import { Home, BarChart3, Settings } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate } = useAppStore();

  // Hide bottom nav during training session or learning
  if (
    currentRoute.name === 'training-session' ||
    currentRoute.name === 'learning' ||
    currentRoute.name === 'result'
  ) {
    return null;
  }

  const isHome = currentRoute.name === 'launchpad' || currentRoute.name === 'module-home';
  const isStats = currentRoute.name === 'statistics';
  const isSettings = currentRoute.name === 'settings';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button
          onClick={() => navigate({ name: 'launchpad' })}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all active:scale-95 ${
            isHome ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Trang chủ</span>
        </button>

        <button
          onClick={() => navigate({ name: 'statistics' })}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all active:scale-95 ${
            isStats ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px]">Thống kê</span>
        </button>

        <button
          onClick={() => navigate({ name: 'settings' })}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all active:scale-95 ${
            isSettings ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[11px]">Cài đặt</span>
        </button>
      </div>
    </nav>
  );
};
