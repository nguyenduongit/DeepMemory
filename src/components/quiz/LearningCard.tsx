import React, { useRef } from 'react';
import { QuestionContent } from '../../core/types/content-types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LearningCardProps {
  primary: QuestionContent;
  title: string;
  subtitle?: string;
  detail?: string;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  primary,
  title,
  subtitle,
  detail,
  currentIndex,
  totalCount,
  onNext,
  onPrev,
}) => {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Minimum swipe threshold 50px
    if (diff > 50) {
      onNext(); // Swiped left -> Next
    } else if (diff < -50) {
      onPrev(); // Swiped right -> Prev
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Main Flashcard */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between min-h-[360px] sm:min-h-[400px] shadow-2xl shadow-indigo-950/20 relative"
      >
        {/* Visual Content */}
        <div className="w-full flex-1 flex items-center justify-center p-4">
          {primary.type === 'image' ? (
            <ImageWithFallback
              src={primary.src}
              alt={primary.alt || title}
              className="max-h-[190px] sm:max-h-[220px] w-auto max-w-full"
              fallbackTitle={title}
              fallbackSubtitle={subtitle}
            />
          ) : (
            <div className="font-display font-black text-6xl text-white">
              {primary.value}
            </div>
          )}
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col items-center text-center mt-4">
          <span className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight">
            {title}
          </span>
          {subtitle && (
            <span className="font-medium text-lg sm:text-xl text-indigo-300 mt-1">
              {subtitle}
            </span>
          )}
          {detail && (
            <span className="text-xs text-slate-400 mt-1 max-w-[80%]">
              {detail}
            </span>
          )}
        </div>

        {/* Desktop Quick Arrow Clickers */}
        <button
          onClick={onPrev}
          aria-label="Xem thẻ trước"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={onNext}
          aria-label="Xem thẻ tiếp theo"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress index indicator */}
      <div className="mt-4 font-mono font-bold text-sm text-slate-400 flex items-center gap-2">
        <span className="text-white">{currentIndex + 1}</span>
        <span className="text-slate-600">/</span>
        <span>{totalCount}</span>
      </div>
    </div>
  );
};
