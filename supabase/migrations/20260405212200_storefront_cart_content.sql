create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.pages (
  id bigint generated always as identity primary key,
  title text not null,
  handle text not null unique check (handle = lower(handle)),
  body text not null default '',
  body_summary text not null default '',
  seo_title text,
  seo_description text,
  published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menus (
  id bigint generated always as identity primary key,
  title text not null,
  handle text not null unique check (handle = lower(handle)),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.menu_items (
  id bigint generated always as identity primary key,
  menu_id bigint not null references public.menus(id) on delete cascade,
  title text not null,
  path text not null,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'open' check (status = any (array['open'::text, 'checkout_started'::text, 'completed'::text, 'abandoned'::text])),
  currency bpchar not null default 'BRL'::bpchar,
  subtotal_amount numeric not null default 0 check (subtotal_amount >= 0),
  total_amount numeric not null default 0 check (total_amount >= 0),
  tax_amount numeric not null default 0 check (tax_amount >= 0),
  total_quantity integer not null default 0 check (total_quantity >= 0),
  checkout_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cart_items (
  id bigint generated always as identity primary key,
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  line_total numeric not null check (line_total >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cart_id, product_id)
);

alter table public.orders
  add column if not exists cart_id uuid references public.carts(id) on delete set null,
  add column if not exists external_reference text unique,
  add column if not exists checkout_url text,
  add column if not exists customer_email text,
  add column if not exists customer_name text,
  add column if not exists raw_checkout_response jsonb;

alter table public.product_images
  add column if not exists bucket text,
  add column if not exists storage_path text;

create index if not exists idx_products_active_category on public.products(active, category_id);
create index if not exists idx_product_images_product_position on public.product_images(product_id, position);
create index if not exists idx_pages_published_handle on public.pages(published, handle);
create index if not exists idx_menu_items_menu_position on public.menu_items(menu_id, position);
create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
create index if not exists idx_orders_external_reference on public.orders(external_reference);

alter table public.pages enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "Public can read pages" on public.pages;
create policy "Public can read pages"
  on public.pages for select
  using (published = true);

drop policy if exists "Public can read menus" on public.menus;
create policy "Public can read menus"
  on public.menus for select
  using (true);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
  on public.menu_items for select
  using (true);

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at
before update on public.pages
for each row
execute function public.set_updated_at();

drop trigger if exists set_menus_updated_at on public.menus;
create trigger set_menus_updated_at
before update on public.menus
for each row
execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_carts_updated_at on public.carts;
create trigger set_carts_updated_at
before update on public.carts
for each row
execute function public.set_updated_at();

drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at
before update on public.cart_items
for each row
execute function public.set_updated_at();

insert into public.pages (title, handle, body, body_summary, seo_title, seo_description)
select 'Sobre', 'sobre', '<p>Atualize esta página no Supabase para contar a história da sua marca.</p>', 'Conheça a nossa marca.', 'Sobre', 'Conheça a nossa marca.'
where not exists (select 1 from public.pages where handle = 'sobre');

insert into public.menus (title, handle)
select 'Header', 'main-menu'
where not exists (select 1 from public.menus where handle = 'main-menu');

insert into public.menus (title, handle)
select 'Footer', 'footer-menu'
where not exists (select 1 from public.menus where handle = 'footer-menu');

insert into public.menu_items (menu_id, title, path, position)
select m.id, 'Inicio', '/', 0
from public.menus m
where m.handle = 'main-menu'
  and not exists (
    select 1 from public.menu_items mi where mi.menu_id = m.id and mi.path = '/'
  );

insert into public.menu_items (menu_id, title, path, position)
select m.id, 'Catalogo', '/search', 1
from public.menus m
where m.handle = 'main-menu'
  and not exists (
    select 1 from public.menu_items mi where mi.menu_id = m.id and mi.path = '/search'
  );

insert into public.menu_items (menu_id, title, path, position)
select m.id, 'Sobre', '/sobre', 2
from public.menus m
where m.handle = 'main-menu'
  and not exists (
    select 1 from public.menu_items mi where mi.menu_id = m.id and mi.path = '/sobre'
  );

insert into public.menu_items (menu_id, title, path, position)
select m.id, 'Catalogo', '/search', 0
from public.menus m
where m.handle = 'footer-menu'
  and not exists (
    select 1 from public.menu_items mi where mi.menu_id = m.id and mi.path = '/search'
  );

insert into public.menu_items (menu_id, title, path, position)
select m.id, 'Sobre', '/sobre', 1
from public.menus m
where m.handle = 'footer-menu'
  and not exists (
    select 1 from public.menu_items mi where mi.menu_id = m.id and mi.path = '/sobre'
  );
