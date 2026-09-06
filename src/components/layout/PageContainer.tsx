import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = 'md',
}) => {
  const maxWidthClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',      // ~672px
    lg: 'max-w-3xl',      // ~768px (Section 58: 700-900px ideal for eye scanning)
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 ${maxWidthClass} ${className}`}>
      {children}
    </div>
  );
};
