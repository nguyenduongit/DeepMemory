import { ItemProgress, MasteryLevel } from './progress-types';

export interface ModuleMasterySummary {
  totalItems: number;
  practicedItems: number;
  averageMasteryScore: number;
  masteryPercent: number;
  levelCounts: Record<MasteryLevel, number>;
}

export function calculateModuleMasterySummary(
  totalItemCount: number,
  itemProgressList: ItemProgress[]
): ModuleMasterySummary {
  const levelCounts: Record<MasteryLevel, number> = {
    new: totalItemCount,
    learning: 0,
    familiar: 0,
    mastered: 0,
  };

  let totalScore = 0;
  let practicedCount = 0;

  for (const p of itemProgressList) {
    if (p.seenCount > 0) {
      practicedCount++;
      totalScore += p.masteryScore;
      levelCounts[p.masteryLevel] = (levelCounts[p.masteryLevel] || 0) + 1;
      levelCounts.new = Math.max(0, levelCounts.new - 1);
    }
  }

  // Percentage is totalScore / (totalItemCount * 100) * 100
  const maxPossibleScore = totalItemCount * 100;
  const masteryPercent =
    maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  const averageMasteryScore =
    practicedCount > 0 ? Math.round(totalScore / practicedCount) : 0;

  return {
    totalItems: totalItemCount,
    practicedItems: practicedCount,
    averageMasteryScore,
    masteryPercent,
    levelCounts,
  };
}

/**
 * Filter weak items: items with wrongCount > 0 and low accuracy or mastery < 50
 */
export function identifyWeakItems(progressList: ItemProgress[], limit: number = 10): ItemProgress[] {
  return progressList
    .filter((p) => p.wrongCount > 0 && p.accuracy < 70)
    .sort((a, b) => {
      // Sort by highest wrongCount first, then lowest accuracy
      if (b.wrongCount !== a.wrongCount) {
        return b.wrongCount - a.wrongCount;
      }
      return a.accuracy - b.accuracy;
    })
    .slice(0, limit);
}
