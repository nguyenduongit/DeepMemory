import React from 'react';
import { QuestionContent } from '../../core/types/content-types';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface QuestionCardProps {
  question: QuestionContent;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const textSize = question.type === 'text' && question.value.length > 24
    ? 'text-3xl sm:text-4xl'
    : question.type === 'text' && question.value.length > 14
      ? 'text-4xl sm:text-5xl'
      : 'text-6xl sm:text-7xl';

  return (
    <div
      className={`w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px] shadow-xl shadow-slate-950/50 ${className}`}
    >
      {question.type === 'text' ? (
        <div className="flex flex-col items-center justify-center text-center">
          <span className={`font-display font-black tracking-tight text-white select-none drop-shadow-sm ${textSize}`}>
            {question.value}
          </span>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <ImageWithFallback
            src={question.src}
            alt={question.alt || 'Question visual'}
            className="max-h-[160px] sm:max-h-[190px] w-auto max-w-full"
            fallbackTitle={fallbackTitle || question.alt}
            fallbackSubtitle={fallbackSubtitle}
          />
        </div>
      )}
    </div>
  );
};
