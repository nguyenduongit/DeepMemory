insert into public.modules (
  id, name, category, description, icon, color, is_active, display_order, tags, metadata
)
values (
  'memory-number-sequence',
  'Thi đấu nhớ số',
  'memory',
  'Ghi nhớ dãy số ngẫu nhiên trong thời gian ngắn nhất rồi nhập lại chính xác toàn bộ.',
  'timer',
  '#06b6d4',
  true,
  2,
  array['trí nhớ', 'dãy số', 'thi đấu'],
  '{"subtitle":"20–500 chữ số","status":"available","totalItems":10,"lengths":[20,40,80,100,200,500]}'::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  icon = excluded.icon,
  color = excluded.color,
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  tags = excluded.tags,
  metadata = excluded.metadata,
  updated_at = now();

update public.modules
set display_order = 3, updated_at = now()
where id = 'memory-cards';

delete from public.module_groups
where module_id = 'memory-number-sequence';

insert into public.module_items (
  module_id, id, code, name, image_url, group_id, tags, attributes, sort_order
)
select
  'memory-number-sequence',
  'digit-' || digit,
  digit,
  'Chữ số ' || digit,
  null,
  null,
  array['digit', 'number-sequence'],
  jsonb_build_object('digit', digit),
  digit::integer
from unnest(array['0','1','2','3','4','5','6','7','8','9']) as digit
on conflict (module_id, id) do update set
  code = excluded.code,
  name = excluded.name,
  image_url = excluded.image_url,
  group_id = excluded.group_id,
  tags = excluded.tags,
  attributes = excluded.attributes,
  sort_order = excluded.sort_order,
  updated_at = now();
