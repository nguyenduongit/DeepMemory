update public.modules
set is_active = false,
    metadata = jsonb_set(
      coalesce(metadata, '{}'::jsonb),
      '{status}',
      '"disabled"'::jsonb,
      true
    ),
    updated_at = now()
where id = 'memory-number-sequence';

update public.modules
set display_order = 2,
    updated_at = now()
where id = 'memory-cards';
