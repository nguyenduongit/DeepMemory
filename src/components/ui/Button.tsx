import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl font-medium',
    md: 'px-4 py-2.5 text-sm rounded-xl font-semibold',
    lg: 'px-6 py-3.5 text-base rounded-2xl font-bold',
  }[size];

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:bg-indigo-700 border border-indigo-400/20',
    secondary:
      'bg-slate-800 hover:bg-slate-700/80 text-slate-100 active:bg-slate-900 border border-slate-700/60',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-500',
    ghost:
      'bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 active:bg-rose-700 border border-rose-400/20',
  }[variant];

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 select-none transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${sizeClasses} ${variantClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
