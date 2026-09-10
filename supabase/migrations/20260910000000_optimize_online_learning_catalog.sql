alter table public.module_groups
  add column if not exists updated_at timestamptz default now();

alter table public.module_items
  add column if not exists updated_at timestamptz default now();

create index if not exists module_groups_module_sort_idx
  on public.module_groups (module_id, sort_order);

create index if not exists module_items_module_sort_idx
  on public.module_items (module_id, sort_order);

drop policy if exists "Admin write modules" on public.modules;
drop policy if exists "Admin write module_groups" on public.module_groups;
drop policy if exists "Admin write module_items" on public.module_items;

grant select on public.modules, public.module_groups, public.module_items to anon, authenticated;
