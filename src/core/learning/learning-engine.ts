import { ModuleGroup } from '../module/module-types';

export function filterItemsByGroup<TItem>(
  items: TItem[],
  group?: ModuleGroup<TItem>
): TItem[] {
  if (!group || !group.filter) {
    return items;
  }
  return items.filter(group.filter);
}

export function getNextIndex(currentIndex: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return currentIndex < totalCount - 1 ? currentIndex + 1 : 0; // Loop or clamp
}

export function getPrevIndex(currentIndex: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return currentIndex > 0 ? currentIndex - 1 : totalCount - 1;
}

export function clampIndex(index: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  return Math.max(0, Math.min(index, totalCount - 1));
}
