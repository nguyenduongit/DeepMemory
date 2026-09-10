import { supabase } from '../../lib/supabase';
import { getModuleById, moduleRegistry } from './module-registry';
import { ModuleCategory, ModuleGroup, ModuleStatus } from './module-types';
import { validateModuleRegistry } from './module-validator';

interface ModuleRow {
  id: string;
  name: string;
  category: ModuleCategory;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  metadata: { subtitle?: string | null; status?: ModuleStatus } | null;
}

interface GroupRow {
  module_id: string;
  id: string;
  name: string;
  description: string | null;
  metadata: {
    allItems?: boolean;
    itemIds?: unknown;
    match?: { field?: unknown; equals?: unknown };
  } | null;
}

interface ItemRow {
  module_id: string;
  id: string;
  code: string | null;
  name: string;
  subname: string | null;
  image_url: string | null;
  audio_url: string | null;
  group_id: string | null;
  attributes: Record<string, unknown> | null;
  sort_order: number;
}

const PAGE_SIZE = 1000;

async function fetchAllItems(moduleId: string): Promise<ItemRow[]> {
  const rows: ItemRow[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('module_items')
      .select('module_id,id,code,name,subname,image_url,audio_url,group_id,attributes,sort_order')
      .eq('module_id', moduleId)
      .order('sort_order', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    const page = (data ?? []) as ItemRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  return rows;
}

function mapItem(row: ItemRow): Record<string, unknown> {
  const attributes = row.attributes ?? {};
  const common = { ...attributes, id: row.id, sortOrder: row.sort_order };

  switch (row.module_id) {
    case 'numbers-00-99':
      return { ...common, number: row.code ?? '', name: row.name, imageUrl: row.image_url ?? '' };
    case 'geography-world-countries':
      return {
        ...common,
        code: row.code ?? '',
        vietnameseName: row.name,
        internationalName: row.subname ?? '',
        flagUrl: row.image_url ?? '',
      };
    case 'science-periodic-table':
      return {
        ...common,
        symbol: row.code ?? '',
        vietnameseName: row.name,
        internationalName: row.subname ?? '',
      };
    case 'language-english-vocab':
      return {
        ...common,
        word: row.code ?? '',
        vietnameseMeaning: row.name,
        pronunciation: row.subname ?? '',
        topicId: row.group_id ?? attributes.topicId,
        imageUrl: row.image_url ?? undefined,
      };
    default:
      return common;
  }
}

function mapGroups(rows: GroupRow[]): ModuleGroup<Record<string, unknown>>[] {
  return rows.map((row) => {
    if (row.metadata?.allItems) {
      return {
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        filter: () => true,
      };
    }

    const matchField = row.metadata?.match?.field;
    if (typeof matchField === 'string') {
      const matchValue = row.metadata?.match?.equals;
      return {
        id: row.id,
        name: row.name,
        description: row.description ?? undefined,
        filter: (item) => item[matchField] === matchValue,
      };
    }

    const rawIds = row.metadata?.itemIds;
    if (!Array.isArray(rawIds)) {
      throw new Error(`Nhóm ${row.module_id}/${row.id} thiếu danh sách itemIds.`);
    }
    const itemIds = new Set(rawIds.filter((id): id is string => typeof id === 'string'));

    return {
      id: row.id,
      name: row.name,
      description: row.description ?? undefined,
      filter: (item) => typeof item.id === 'string' && itemIds.has(item.id),
    };
  });
}

/**
 * Loads the complete learning catalog from Supabase. Learning content has no
 * bundled fallback: a failed request is surfaced to the app for retry.
 */
export async function loadModulesFromSupabase(): Promise<void> {
  const supportedIds = moduleRegistry.map((module) => module.id);
  const [moduleResult, groupResult, itemPages] = await Promise.all([
    supabase
      .from('modules')
      .select('id,name,category,description,icon,color,is_active,metadata')
      .in('id', supportedIds)
      .order('display_order', { ascending: true }),
    supabase
      .from('module_groups')
      .select('module_id,id,name,description,metadata')
      .in('module_id', supportedIds)
      .order('sort_order', { ascending: true }),
    Promise.all(supportedIds.map(fetchAllItems)),
  ]);

  if (moduleResult.error) throw moduleResult.error;
  if (groupResult.error) throw groupResult.error;

  const moduleRows = (moduleResult.data ?? []) as ModuleRow[];
  const groupRows = (groupResult.data ?? []) as GroupRow[];
  const itemRows = itemPages.flat();

  if (moduleRows.length !== supportedIds.length) {
    const receivedIds = new Set(moduleRows.map((row) => row.id));
    const missing = supportedIds.filter((id) => !receivedIds.has(id));
    throw new Error(`Supabase thiếu module: ${missing.join(', ')}`);
  }

  for (const row of moduleRows) {
    const moduleDefinition = getModuleById(row.id);
    if (!moduleDefinition) continue;

    moduleDefinition.name = row.name;
    moduleDefinition.subtitle = row.metadata?.subtitle ?? undefined;
    moduleDefinition.description = row.description ?? undefined;
    moduleDefinition.category = row.category;
    moduleDefinition.icon = row.icon ?? moduleDefinition.icon;
    moduleDefinition.colorTheme = row.color ?? undefined;
    moduleDefinition.status = row.metadata?.status ?? (row.is_active ? 'available' : 'disabled');
    moduleDefinition.items = itemRows.filter((item) => item.module_id === row.id).map(mapItem);
    moduleDefinition.groups = mapGroups(groupRows.filter((group) => group.module_id === row.id));

    if (moduleDefinition.status === 'available' && moduleDefinition.items.length === 0) {
      throw new Error(`Module ${row.id} chưa có dữ liệu học tập trên Supabase.`);
    }
  }

  const validation = validateModuleRegistry(moduleRegistry);
  if (!validation.valid) {
    throw new Error(`Dữ liệu module không hợp lệ: ${validation.errors.join(' ')}`);
  }
}
