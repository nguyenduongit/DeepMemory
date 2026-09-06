import { supabase } from '../../lib/supabase';
import { getModuleById } from './module-registry';
import { NumberMemoryItem } from '../../modules/numbers/types';

/**
 * Synchronizes module items from Supabase database to ensure the app
 * always has the latest items, names, and cloud storage images.
 * Gracefully falls back to bundled data if offline.
 */
export async function syncModuleFromSupabase(moduleId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('module_items')
      .select('*')
      .eq('module_id', moduleId)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return false;
    }

    const moduleDef = getModuleById(moduleId);
    if (!moduleDef) return false;

    if (moduleId === 'numbers-00-99') {
      const syncedItems: NumberMemoryItem[] = data.map((d) => ({
        id: `number-${d.code}`,
        number: d.code,
        name: d.name,
        imageUrl: d.image_url || `/number-images/${d.code}.webp`,
        sortOrder: d.sort_order,
      }));

      // Update in-memory items in module definition
      (moduleDef.items as NumberMemoryItem[]) = syncedItems;
    }

    return true;
  } catch (err) {
    console.warn(`[ModuleLoader] Error syncing module ${moduleId} from Supabase:`, err);
    return false;
  }
}
