import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  hideSubtitle?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = '',
  className = '',
  fallbackTitle,
  fallbackSubtitle,
  hideSubtitle = false,
}) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = failedSrc === src;

  // If error loading or empty src, display beautiful placeholder card
  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
          <ImageIcon className="w-5 h-5 opacity-70" />
        </div>
        {fallbackTitle && (
          <span className="font-display font-black text-2xl tracking-tight text-white mb-0.5">
            {fallbackTitle}
          </span>
        )}
        {!hideSubtitle && fallbackSubtitle && (
          <span className="text-xs font-medium text-slate-400 max-w-[90%] truncate">
            {fallbackSubtitle}
          </span>
        )}
        <span className="text-[10px] text-slate-500 font-mono mt-1 opacity-75 uppercase tracking-wider">
          Chưa có ảnh
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      onLoad={() => setFailedSrc((failed) => (failed === src ? null : failed))}
      className={`object-contain transition-opacity duration-150 ${className}`}
      loading="eager"
    />
  );
};
