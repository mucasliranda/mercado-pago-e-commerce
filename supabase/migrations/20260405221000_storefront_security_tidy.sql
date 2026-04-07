create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop policy if exists "Service role can manage carts" on public.carts;
create policy "Service role can manage carts"
  on public.carts
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage cart items" on public.cart_items;
create policy "Service role can manage cart items"
  on public.cart_items
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
