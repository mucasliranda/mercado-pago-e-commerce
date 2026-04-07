alter table public.menus
  add column if not exists deleted_at timestamptz;

alter table public.menu_items
  add column if not exists deleted_at timestamptz;

drop policy if exists "Public can read menus" on public.menus;
create policy "Public can read menus"
  on public.menus for select
  using (deleted_at is null);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
  on public.menu_items for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.menus
      where menus.id = menu_items.menu_id
        and menus.deleted_at is null
    )
  );

drop index if exists idx_menu_items_menu_position;
create index if not exists idx_menu_items_menu_position_active
  on public.menu_items(menu_id, position)
  where deleted_at is null;
