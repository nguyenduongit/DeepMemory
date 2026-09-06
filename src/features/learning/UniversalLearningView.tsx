import React, { useState, useEffect, useCallback } from 'react';
import { getModuleById } from '../../core/module/module-registry';
import { useAppStore } from '../../stores/useAppStore';
import { PageContainer } from '../../components/layout/PageContainer';
import { Header } from '../../components/layout/Header';
import { LearningCard } from '../../components/quiz/LearningCard';
import {
  filterItemsByGroup,
  getNextIndex,
  getPrevIndex,
  clampIndex,
} from '../../core/learning/learning-engine';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UniversalLearningViewProps {
  moduleId: string;
}

export const UniversalLearningView: React.FC<UniversalLearningViewProps> = ({ moduleId }) => {
  const module = getModuleById(moduleId);
  const { goBack } = useAppStore();

  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    module?.groups?.[0]?.id || ''
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter items based on selected group
  const selectedGroup = module?.groups?.find((g) => g.id === selectedGroupId);
  const items = filterItemsByGroup(module?.items || [], selectedGroup);
  const totalCount = items.length;

  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => getNextIndex(prev, totalCount));
  }, [totalCount]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => getPrevIndex(prev, totalCount));
  }, [totalCount]);

  // Keyboard navigation for desktop: Left / Right arrow keys (Section 13, 24)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!module || !currentItem) {
    return (
      <div className="min-h-screen">
        <Header showBack onBack={goBack} />
        <PageContainer maxWidth="sm">
          <div className="text-center py-12 text-slate-400">Không có dữ liệu học tập.</div>
        </PageContainer>
      </div>
    );
  }

  const primaryContent = module.learning.primary(currentItem);
  const title = module.learning.title(currentItem);
  const subtitle = module.learning.subtitle ? module.learning.subtitle(currentItem) : undefined;
  const detail = module.learning.detail ? module.learning.detail(currentItem) : undefined;

  const progressPercent = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen pb-16 flex flex-col justify-between">
      <Header
        title={module.name}
        subtitle="Học tập"
        showBack
        onBack={goBack}
        rightAction={
          module.groups && module.groups.length > 0 ? (
            <div className="relative">
              <select
                aria-label="Chọn nhóm học tập"
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  setCurrentIndex(0);
                }}
                className="bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-700/80 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {module.groups.map((group) => (
                  <option key={group.id} value={group.id} className="bg-slate-900 text-slate-200">
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          ) : undefined
        }
      />

      {/* Main Flashcard Container */}
      <PageContainer maxWidth="md" className="flex-1 flex flex-col items-center justify-center py-4">
        <LearningCard
          primary={primaryContent}
          title={title}
          subtitle={subtitle}
          detail={detail}
          currentIndex={currentIndex}
          totalCount={totalCount}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </PageContainer>

      {/* Bottom Navigation & Controls */}
      <div className="w-full bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 py-3 px-4 sm:px-6">
        <div className="max-w-md mx-auto space-y-3">
          <ProgressBar progress={progressPercent} size="sm" variant="primary" />

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-slate-200 font-bold text-sm border border-slate-800 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Trước (←)
            </button>

            {/* Jump to index selector */}
            <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-400">
              <input
                type="number"
                aria-label="Nhập số thứ tự"
                min={1}
                max={totalCount}
                value={currentIndex + 1}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setCurrentIndex(clampIndex(val - 1, totalCount));
                  }
                }}
                className="w-12 text-center bg-slate-900 border border-slate-700/80 rounded-lg py-1.5 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-slate-600">/</span>
              <span>{totalCount}</span>
            </div>

            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              Tiếp (→) <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
