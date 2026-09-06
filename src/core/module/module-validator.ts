import { ModuleDefinition } from './module-types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateModule<TItem>(module: ModuleDefinition<TItem>): ValidationResult {
  const errors: string[] = [];

  if (!module.id || typeof module.id !== 'string') {
    errors.push(`Module ID is required and must be a string.`);
  }

  if (!module.name || typeof module.name !== 'string') {
    errors.push(`Module name is required.`);
  }

  if (!module.category) {
    errors.push(`Module category is required.`);
  }

  if (module.status === 'available') {
    if (!Array.isArray(module.items) || module.items.length === 0) {
      errors.push(`Available module "${module.id}" must contain items.`);
    }

    if (!Array.isArray(module.trainingModes) || module.trainingModes.length === 0) {
      errors.push(`Available module "${module.id}" must contain at least one training mode.`);
    }

    if (!module.learning || typeof module.learning.primary !== 'function') {
      errors.push(`Available module "${module.id}" must provide learning configuration.`);
    }

    // Check duplicate item IDs if items have id
    const itemIds = new Set<string>();
    for (let i = 0; i < (module.items || []).length; i++) {
      const it = module.items[i] as any;
      if (it && typeof it.id === 'string') {
        if (itemIds.has(it.id)) {
          errors.push(`Duplicate item ID "${it.id}" in module "${module.id}".`);
        }
        itemIds.add(it.id);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateModuleRegistry(modules: ModuleDefinition[]): ValidationResult {
  const errors: string[] = [];
  const moduleIds = new Set<string>();

  for (const mod of modules) {
    if (moduleIds.has(mod.id)) {
      errors.push(`Duplicate module ID found in registry: "${mod.id}".`);
    }
    moduleIds.add(mod.id);

    const modResult = validateModule(mod);
    if (!modResult.valid) {
      errors.push(...modResult.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
