import React from 'react';
import { MasteryLevel } from '../../core/progress/progress-types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'coming-soon';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    primary: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    info: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    'coming-soon': 'bg-slate-800/80 text-slate-400 border border-slate-700/50',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full uppercase tracking-wider ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const MasteryBadge: React.FC<{ level: MasteryLevel; size?: 'sm' | 'md' }> = ({
  level,
  size = 'md',
}) => {
  switch (level) {
    case 'mastered':
      return (
        <Badge variant="success" size={size}>
          Mastered
        </Badge>
      );
    case 'familiar':
      return (
        <Badge variant="info" size={size}>
          Familiar
        </Badge>
      );
    case 'learning':
      return (
        <Badge variant="warning" size={size}>
          Learning
        </Badge>
      );
    case 'new':
    default:
      return (
        <Badge variant="default" size={size}>
          New
        </Badge>
      );
  }
};
