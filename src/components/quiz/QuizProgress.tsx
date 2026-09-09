import React, { useEffect, useState } from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDuration, now } from '../../core/training/timer';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  startedAt?: number;
  isRunning: boolean;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  startedAt,
  isRunning,
}) => {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isRunning || !startedAt) {
      return;
    }

    // High refresh timer (every ~50ms)
    const interval = setInterval(() => {
      setElapsedMs(now() - startedAt);
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, startedAt]);

  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const displayedElapsedMs = isRunning && startedAt ? elapsedMs : 0;

  return (
    <div className="w-full space-y-2 select-none">
      <div className="flex items-center justify-between text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Câu</span>
          <span className="font-mono text-white text-base font-bold">
            {currentIndex + 1}
          </span>
          <span className="text-slate-500 font-mono">/ {totalQuestions}</span>
        </div>

        {/* Stopwatch timer */}
        <div className="font-mono font-bold text-sm tracking-wider text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-500/20">
          {formatDuration(displayedElapsedMs)}
        </div>
      </div>

      <ProgressBar progress={progressPercent} size="sm" variant="primary" />
    </div>
  );
};
