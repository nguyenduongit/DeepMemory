import { describe, it, expect } from 'vitest';
import { numberGroups } from '../groups';
import { numberMemoryItems } from '../data';

describe('Number Groups Filtering (Section 92)', () => {
  it('should verify dataset contains exactly 100 items from 00 to 99', () => {
    expect(numberMemoryItems).toHaveLength(100);
    expect(numberMemoryItems[0].number).toBe('00');
    expect(numberMemoryItems[99].number).toBe('99');
  });

  it('group 00–09 must return exactly 10 items', () => {
    const group00_09 = numberGroups.find((g) => g.id === '00-09');
    expect(group00_09).toBeDefined();
    const filtered = numberMemoryItems.filter(group00_09!.filter);
    expect(filtered).toHaveLength(10);
    expect(filtered[0].number).toBe('00');
    expect(filtered[9].number).toBe('09');
  });

  it('group 10–19 must return exactly 10 items', () => {
    const group10_19 = numberGroups.find((g) => g.id === '10-19');
    expect(group10_19).toBeDefined();
    const filtered = numberMemoryItems.filter(group10_19!.filter);
    expect(filtered).toHaveLength(10);
    expect(filtered[0].number).toBe('10');
    expect(filtered[9].number).toBe('19');
  });

  it('group 00–49 must return exactly 50 items', () => {
    const group00_49 = numberGroups.find((g) => g.id === '00-49');
    expect(group00_49).toBeDefined();
    const filtered = numberMemoryItems.filter(group00_49!.filter);
    expect(filtered).toHaveLength(50);
    expect(filtered[0].number).toBe('00');
    expect(filtered[49].number).toBe('49');
  });

  it('group 50–99 must return exactly 50 items', () => {
    const group50_99 = numberGroups.find((g) => g.id === '50-99');
    expect(group50_99).toBeDefined();
    const filtered = numberMemoryItems.filter(group50_99!.filter);
    expect(filtered).toHaveLength(50);
    expect(filtered[0].number).toBe('50');
    expect(filtered[49].number).toBe('99');
  });

  it('group 00–99 must return exactly 100 items', () => {
    const group00_99 = numberGroups.find((g) => g.id === '00-99');
    expect(group00_99).toBeDefined();
    const filtered = numberMemoryItems.filter(group00_99!.filter);
    expect(filtered).toHaveLength(100);
  });
});
