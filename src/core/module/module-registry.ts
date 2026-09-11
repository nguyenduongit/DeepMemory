import { ModuleDefinition, ModuleCategory } from './module-types';
import { numbersModule } from '../../modules/numbers';
import { memoryPalaceModule } from '../../modules/memory/placeholder';
import { memoryCardsModule } from '../../modules/memory-cards';
import { numberSequenceModule } from '../../modules/number-sequence';
import { worldCountriesModule } from '../../modules/world-countries';
import { solarSystemModule } from '../../modules/science/placeholder';
import { periodicTableModule } from '../../modules/periodic-table';
import { englishVocabularyModule } from '../../modules/english-vocabulary';

export const moduleRegistry: ModuleDefinition[] = [
  // Trí nhớ
  numbersModule,
  numberSequenceModule,
  memoryCardsModule,
  memoryPalaceModule,

  // Địa lý
  worldCountriesModule,

  // Khoa học
  periodicTableModule,
  solarSystemModule,

  // Ngôn ngữ
  englishVocabularyModule,
];

export function getModuleById(id: string): ModuleDefinition | undefined {
  return moduleRegistry.find((m) => m.id === id);
}

export function getModulesByCategory(category: ModuleCategory): ModuleDefinition[] {
  return moduleRegistry.filter((m) => m.category === category);
}

export function getAvailableModules(): ModuleDefinition[] {
  return moduleRegistry.filter((m) => m.status === 'available');
}
