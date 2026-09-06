import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'amber';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const fillClass = {
    primary: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium mb-1.5">
          <span>Tiến độ</span>
          <span className="font-mono text-white font-bold">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 ${heightClass}`}>
        <div
          className={`${heightClass} ${fillClass} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
