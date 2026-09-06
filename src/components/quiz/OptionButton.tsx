import React from 'react';
import { AnswerContent } from '../../core/types/content-types';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface OptionButtonProps {
  content: AnswerContent;
  index: number; // 0, 1, 2, 3
  onSelect: () => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  content,
  index,
  onSelect,
  disabled = false,
}) => {
  const shortcutKey = (index + 1).toString();

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Đáp án ${shortcutKey}`}
      className="relative group w-full bg-slate-900/90 hover:bg-slate-800/90 active:bg-indigo-950/70 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 sm:p-5 flex items-center justify-center min-h-[76px] sm:min-h-[92px] transition-all duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-md shadow-slate-950/40 select-none cursor-pointer"
    >
      {/* Keyboard shortcut hint badge */}
      <span className="absolute top-2.5 left-3 font-mono text-[11px] font-bold text-slate-500 group-hover:text-indigo-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50 transition-colors">
        {shortcutKey}
      </span>

      {/* Answer content: Text or Image */}
      {content.type === 'text' ? (
        <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight group-hover:text-indigo-200">
          {content.value}
        </span>
      ) : (
        <div className="w-full flex items-center justify-center p-1">
          <ImageWithFallback
            src={content.src}
            alt={content.alt || 'Option visual'}
            className="max-h-[58px] sm:max-h-[72px] w-auto max-w-full"
            fallbackTitle={content.alt}
            hideSubtitle={true} // Rule: Do not show text name to avoid hints (Section 50)
          />
        </div>
      )}
    </button>
  );
};
