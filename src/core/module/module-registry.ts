import { ModuleDefinition, ModuleCategory } from './module-types';
import { numbersModule } from '../../modules/numbers';
import { memoryCardsModule, memoryPalaceModule } from '../../modules/memory/placeholder';
import { flagsModule, mapsModule, capitalsModule, countriesModule } from '../../modules/geography/placeholder';
import { periodicTableModule, solarSystemModule } from '../../modules/science/placeholder';
import { englishVocabModule } from '../../modules/language/placeholder';
import { validateModuleRegistry } from './module-validator';

export const moduleRegistry: ModuleDefinition[] = [
  // Trí nhớ
  numbersModule,
  memoryCardsModule,
  memoryPalaceModule,

  // Địa lý
  flagsModule,
  mapsModule,
  capitalsModule,
  countriesModule,

  // Khoa học
  periodicTableModule,
  solarSystemModule,

  // Ngôn ngữ
  englishVocabModule,
];

// Validate registry integrity on startup
const validation = validateModuleRegistry(moduleRegistry);
if (!validation.valid) {
  console.warn('Module registry validation warnings:', validation.errors);
}

export function getModuleById(id: string): ModuleDefinition | undefined {
  return moduleRegistry.find((m) => m.id === id);
}

export function getModulesByCategory(category: ModuleCategory): ModuleDefinition[] {
  return moduleRegistry.filter((m) => m.category === category);
}

export function getAvailableModules(): ModuleDefinition[] {
  return moduleRegistry.filter((m) => m.status === 'available');
}
