import { createServer } from 'vite';

const moduleId = process.argv[2];
if (!moduleId) {
  throw new Error('Usage: node scripts/export-learning-seed.mjs <module-id>');
}

const vite = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
});

try {
  const originalWarn = console.warn;
  console.warn = () => {};
  const { moduleRegistry } = await vite.ssrLoadModule('/src/core/module/module-registry.ts');
  console.warn = originalWarn;
  const moduleDefinition = moduleRegistry.find((candidate) => candidate.id === moduleId);

  if (!moduleDefinition) {
    throw new Error(`Unknown module: ${moduleId}`);
  }

  const sources = {
    'numbers-00-99': ['/src/modules/numbers/data.ts', 'numberMemoryItems', '/src/modules/numbers/groups.ts', 'numberGroups'],
    'geography-world-countries': ['/src/modules/world-countries/data.generated.ts', 'worldCountries', '/src/modules/world-countries/groups.ts', 'worldCountryGroups'],
    'science-periodic-table': ['/src/modules/periodic-table/data.ts', 'chemicalElements', '/src/modules/periodic-table/groups.ts', 'periodicTableGroups'],
    'language-english-vocab': ['/src/modules/english-vocabulary/data.ts', 'englishVocabulary', '/src/modules/english-vocabulary/groups.ts', 'englishVocabularyGroups'],
  };
  const source = sources[moduleId];
  const items = source ? (await vite.ssrLoadModule(source[0]))[source[1]] : [];
  const groups = source ? (await vite.ssrLoadModule(source[2]))[source[3]] : [];

  const itemRows = items.map((item, index) => ({
    module_id: moduleDefinition.id,
    id: item.id,
    code: item.number ?? item.code ?? item.symbol ?? item.word ?? null,
    name: item.name ?? item.vietnameseName ?? item.vietnameseMeaning ?? '',
    subname: item.internationalName ?? item.pronunciation ?? null,
    image_url: item.imageUrl ?? item.flagUrl ?? null,
    audio_url: item.audioUrl ?? null,
    group_id: item.topicId ?? null,
    tags: [],
    attributes: item,
    sort_order: item.sortOrder ?? index,
    updated_at: new Date().toISOString(),
  }));

  const groupRows = groups.map((group, index) => ({
    module_id: moduleDefinition.id,
    id: group.id,
    name: group.name,
    description: group.description ?? null,
    sort_order: index,
    metadata: moduleId === 'language-english-vocab'
      ? group.id === 'all'
        ? { allItems: true }
        : { match: { field: 'topicId', equals: group.id } }
      : { itemIds: items.filter(group.filter).map((item) => item.id) },
    updated_at: new Date().toISOString(),
  }));

  process.stdout.write(JSON.stringify({
    module: {
      id: moduleDefinition.id,
      name: moduleDefinition.name,
      category: moduleDefinition.category,
      description: moduleDefinition.description ?? null,
      icon: moduleDefinition.icon,
      color: moduleDefinition.colorTheme ?? null,
      is_active: moduleDefinition.status === 'available',
      display_order: moduleRegistry.indexOf(moduleDefinition),
      tags: [],
      metadata: {
        subtitle: moduleDefinition.subtitle ?? null,
        status: moduleDefinition.status,
      },
      updated_at: new Date().toISOString(),
    },
    groups: groupRows,
    items: itemRows,
  }));
} finally {
  await vite.close();
}
