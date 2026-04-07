alter table public.products
  add column if not exists title text,
  add column if not exists description_html text,
  add column if not exists available_for_sale boolean not null default true,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists currency_code bpchar not null default 'BRL';

update public.products
set
  title = coalesce(title, name),
  description_html = coalesce(
    description_html,
    case
      when description is null or btrim(description) = '' then ''
      else '<p>' || replace(replace(replace(description, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</p>'
    end
  ),
  available_for_sale = coalesce(available_for_sale, active),
  seo_title = coalesce(seo_title, name),
  seo_description = coalesce(seo_description, coalesce(description, name)),
  currency_code = coalesce(currency_code, 'BRL');

alter table public.product_images
  add column if not exists width integer not null default 1200,
  add column if not exists height integer not null default 1200,
  add column if not exists is_featured boolean not null default false;

with ranked_images as (
  select id, row_number() over (partition by product_id order by position asc, id asc) as rn
  from public.product_images
)
update public.product_images pi
set is_featured = (ri.rn = 1)
from ranked_images ri
where ri.id = pi.id;

create table if not exists public.product_options (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  name text not null,
  values text[] not null default '{}',
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  title text not null,
  sku text,
  available_for_sale boolean not null default true,
  price numeric not null check (price >= 0),
  currency_code bpchar not null default 'BRL',
  selected_options jsonb not null default '[]'::jsonb,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.cart_items
  add column if not exists variant_id bigint references public.product_variants(id) on delete set null;

alter table public.order_items
  add column if not exists variant_id bigint references public.product_variants(id) on delete set null;

create index if not exists idx_product_images_product_featured on public.product_images(product_id, is_featured desc, position asc);
create index if not exists idx_product_options_product on public.product_options(product_id, position asc);
create index if not exists idx_product_variants_product on public.product_variants(product_id, position asc);

alter table public.product_options enable row level security;
alter table public.product_variants enable row level security;

drop policy if exists "product_options_public_read" on public.product_options;
create policy "product_options_public_read"
  on public.product_options for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_options.product_id
        and products.active = true
    )
  );

drop policy if exists "product_variants_public_read" on public.product_variants;
create policy "product_variants_public_read"
  on public.product_variants for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.products
      where products.id = product_variants.product_id
        and products.active = true
    )
  );

drop policy if exists "product_options_admin_select" on public.product_options;
create policy "product_options_admin_select"
  on public.product_options for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "product_options_admin_insert" on public.product_options;
create policy "product_options_admin_insert"
  on public.product_options for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "product_options_admin_update" on public.product_options;
create policy "product_options_admin_update"
  on public.product_options for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "product_options_admin_delete" on public.product_options;
create policy "product_options_admin_delete"
  on public.product_options for delete
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "product_variants_admin_select" on public.product_variants;
create policy "product_variants_admin_select"
  on public.product_variants for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "product_variants_admin_insert" on public.product_variants;
create policy "product_variants_admin_insert"
  on public.product_variants for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "product_variants_admin_update" on public.product_variants;
create policy "product_variants_admin_update"
  on public.product_variants for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "product_variants_admin_delete" on public.product_variants;
create policy "product_variants_admin_delete"
  on public.product_variants for delete
  to authenticated
  using ((select public.is_admin()));

drop trigger if exists set_product_options_updated_at on public.product_options;
create trigger set_product_options_updated_at
before update on public.product_options
for each row
execute function public.set_updated_at();

drop trigger if exists set_product_variants_updated_at on public.product_variants;
create trigger set_product_variants_updated_at
before update on public.product_variants
for each row
execute function public.set_updated_at();

do $$
declare
  current_product record;
begin
  for current_product in select id, title, price, currency_code, available_for_sale from public.products loop
    if not exists (select 1 from public.product_options where product_id = current_product.id) then
      insert into public.product_options (product_id, name, values, position)
      values (current_product.id, 'Title', array['Default Title'], 0);
    end if;

    if not exists (select 1 from public.product_variants where product_id = current_product.id) then
      insert into public.product_variants (
        product_id,
        title,
        available_for_sale,
        price,
        currency_code,
        selected_options,
        position
      )
      values (
        current_product.id,
        'Default Title',
        current_product.available_for_sale,
        current_product.price,
        current_product.currency_code,
        '[{"name":"Title","value":"Default Title"}]'::jsonb,
        0
      );
    end if;
  end loop;
end $$;

update public.product_options
set name = 'Color', values = array['Obsidian', 'Glacier']
where product_id = (select id from public.products where slug = 'aurora-x');

delete from public.product_variants
where product_id = (select id from public.products where slug = 'aurora-x');

insert into public.product_variants (
  product_id,
  title,
  sku,
  available_for_sale,
  price,
  currency_code,
  selected_options,
  position
)
select
  p.id,
  'Obsidian',
  'AURORA-X-OBS',
  true,
  4499.90,
  'BRL',
  '[{"name":"Color","value":"Obsidian"}]'::jsonb,
  0
from public.products p
where p.slug = 'aurora-x';

insert into public.product_variants (
  product_id,
  title,
  sku,
  available_for_sale,
  price,
  currency_code,
  selected_options,
  position
)
select
  p.id,
  'Glacier',
  'AURORA-X-GLA',
  true,
  4699.90,
  'BRL',
  '[{"name":"Color","value":"Glacier"}]'::jsonb,
  1
from public.products p
where p.slug = 'aurora-x';

update public.product_options
set name = 'Color', values = array['Carbon', 'Ice']
where product_id = (select id from public.products where slug = 'quantum-pad-pro');

delete from public.product_variants
where product_id = (select id from public.products where slug = 'quantum-pad-pro');

insert into public.product_variants (
  product_id,
  title,
  sku,
  available_for_sale,
  price,
  currency_code,
  selected_options,
  position
)
select
  p.id,
  'Carbon',
  'PAD-PRO-CAR',
  true,
  649.90,
  'BRL',
  '[{"name":"Color","value":"Carbon"}]'::jsonb,
  0
from public.products p
where p.slug = 'quantum-pad-pro';

insert into public.product_variants (
  product_id,
  title,
  sku,
  available_for_sale,
  price,
  currency_code,
  selected_options,
  position
)
select
  p.id,
  'Ice',
  'PAD-PRO-ICE',
  true,
  679.90,
  'BRL',
  '[{"name":"Color","value":"Ice"}]'::jsonb,
  1
from public.products p
where p.slug = 'quantum-pad-pro';

update public.products
set tags = array['console','featured'], seo_title = 'Aurora X Console', seo_description = 'Console premium Aurora X com duas cores e alta performance.'
where slug = 'aurora-x';

update public.products
set tags = array['accessory','controller'], seo_title = 'Quantum Pad Pro', seo_description = 'Controle premium com duas cores e resposta haptica refinada.'
where slug = 'quantum-pad-pro';

alter table public.cart_items drop constraint if exists cart_items_cart_id_product_id_key;
create unique index if not exists idx_cart_items_cart_variant_unique on public.cart_items(cart_id, variant_id) where variant_id is not null;
create unique index if not exists idx_cart_items_cart_product_unique on public.cart_items(cart_id, product_id) where variant_id is null;
