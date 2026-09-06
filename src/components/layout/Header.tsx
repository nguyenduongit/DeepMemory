import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const { goBack } = useAppStore();
  const { settings, toggleSound } = useSettingsStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/60 px-4 py-3 sm:px-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Quay lại"
              className="p-2 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800/70 active:scale-95 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            {title ? (
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg sm:text-xl text-white truncate">
                  {title}
                </h1>
                {subtitle && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                    {subtitle}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AIO MEMORY
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {rightAction}

          <button
            onClick={toggleSound}
            aria-label={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/70 active:scale-95 rounded-xl transition-all"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-indigo-400" />
            ) : (
              <VolumeX className="w-5 h-5 opacity-60" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
