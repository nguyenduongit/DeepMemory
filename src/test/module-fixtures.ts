import { moduleRegistry } from '../core/module/module-registry';
import { ModuleDefinition } from '../core/module/module-types';
import { englishVocabulary } from '../modules/english-vocabulary/data';
import { englishVocabularyGroups } from '../modules/english-vocabulary/groups';
import { englishVocabularyModule } from '../modules/english-vocabulary/module';
import { numberMemoryItems } from '../modules/numbers/data';
import { numberGroups } from '../modules/numbers/groups';
import { numbersModule } from '../modules/numbers/module';
import { chemicalElements } from '../modules/periodic-table/data';
import { periodicTableGroups } from '../modules/periodic-table/groups';
import { periodicTableModule } from '../modules/periodic-table/module';
import { worldCountries } from '../modules/world-countries/data.generated';
import { worldCountryGroups } from '../modules/world-countries/groups';
import { worldCountriesModule } from '../modules/world-countries/module';

export const numbersTestModule = {
  ...numbersModule,
  items: numberMemoryItems,
  groups: numberGroups,
};

export const worldCountriesTestModule = {
  ...worldCountriesModule,
  items: worldCountries,
  groups: worldCountryGroups,
};

export const periodicTableTestModule = {
  ...periodicTableModule,
  items: chemicalElements,
  groups: periodicTableGroups,
};

export const englishVocabularyTestModule = {
  ...englishVocabularyModule,
  items: englishVocabulary,
  groups: englishVocabularyGroups,
};

const hydratedById = new Map<string, ModuleDefinition>([
  [numbersTestModule.id, numbersTestModule],
  [worldCountriesTestModule.id, worldCountriesTestModule],
  [periodicTableTestModule.id, periodicTableTestModule],
  [englishVocabularyTestModule.id, englishVocabularyTestModule],
]);

export const hydratedModuleRegistry = moduleRegistry.map(
  (moduleDefinition) => hydratedById.get(moduleDefinition.id) ?? moduleDefinition,
);
