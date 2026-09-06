import React from 'react';
import { ModuleDefinition } from '../../core/module/module-types';
import { IconRenderer } from '../../components/ui/IconRenderer';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { formatDuration } from '../../core/training/timer';
import { Trophy, ChevronRight, Lock } from 'lucide-react';

interface ModuleCardProps {
  module: ModuleDefinition;
  masteryPercent?: number;
  bestTimeMs?: number;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  masteryPercent = 0,
  bestTimeMs,
  onClick,
}) => {
  const isAvailable = module.status === 'available';

  return (
    <div
      onClick={isAvailable ? onClick : undefined}
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      aria-disabled={!isAvailable}
      className={`group relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition-all duration-200 select-none ${
        isAvailable
          ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-slate-800/80 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/30 active:scale-[0.98] cursor-pointer'
          : 'bg-slate-950/40 border-slate-800/40 opacity-70 cursor-not-allowed'
      }`}
    >
      {/* Glow background accent */}
      {isAvailable && (
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Module Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 ${
            isAvailable
              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 group-hover:scale-105'
              : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'
          }`}
        >
          <IconRenderer name={module.icon} className="w-6 h-6" />
        </div>

        {/* Status Badge */}
        {!isAvailable ? (
          <Badge variant="coming-soon" size="sm">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Sắp có
            </span>
          </Badge>
        ) : (
          <span className="p-1 text-slate-500 group-hover:text-indigo-300 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </div>

      {/* Module Titles */}
      <div className="mb-4">
        <h3 className="font-display font-black text-xl text-white tracking-tight group-hover:text-indigo-200 transition-colors">
          {module.name}
        </h3>
        {module.subtitle && (
          <p className="text-xs font-mono font-semibold text-slate-400 mt-0.5">
            {module.subtitle}
          </p>
        )}
      </div>

      {/* Available Module Stats: Mastery & Best Time */}
      {isAvailable ? (
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Mastery</span>
            <span className="font-mono font-bold text-white">{masteryPercent}%</span>
          </div>
          <ProgressBar progress={masteryPercent} size="sm" variant="primary" />

          {bestTimeMs && bestTimeMs > 0 && (
            <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-amber-400/90">
                <Trophy className="w-3.5 h-3.5" /> Best
              </span>
              <span className="font-mono font-bold text-white">
                {formatDuration(bestTimeMs)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-800/30">
          <p className="text-xs text-slate-400 line-clamp-2">
            {module.description || 'Đang phát triển trong phiên bản tiếp theo.'}
          </p>
        </div>
      )}
    </div>
  );
};
