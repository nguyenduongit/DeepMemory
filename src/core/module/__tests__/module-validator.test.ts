import { describe, it, expect } from 'vitest';
import { validateModule, validateModuleRegistry } from '../module-validator';
import { hydratedModuleRegistry, numbersTestModule } from '../../../test/module-fixtures';

describe('Module Validator (Section 73)', () => {
  it('should validate numbersModule successfully', () => {
    const result = validateModule(numbersTestModule);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate all modules in moduleRegistry without duplicate IDs', () => {
    const result = validateModuleRegistry(hydratedModuleRegistry);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect duplicate item IDs in a module', () => {
    const invalidModule: any = {
      id: 'test-module',
      name: 'Test',
      category: 'memory',
      status: 'available',
      items: [
        { id: 'item-1', name: 'Item 1' },
        { id: 'item-1', name: 'Duplicate Item 1' },
      ],
      learning: { primary: () => ({ type: 'text', value: '' }), title: () => '' },
      trainingModes: [{ id: 'mode-1', name: 'Mode 1', getQuestion: () => ({ type: 'text', value: '' }), getCorrectAnswer: () => ({ type: 'text', value: '' }), getDistractorAnswer: () => ({ type: 'text', value: '' }) }],
    };

    const result = validateModule(invalidModule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate item ID'))).toBe(true);
  });
});
