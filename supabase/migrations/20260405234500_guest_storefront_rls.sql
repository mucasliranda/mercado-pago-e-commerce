drop policy if exists "Guest can manage carts" on public.carts;
create policy "Guest can manage carts"
  on public.carts
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Guest can manage cart items" on public.cart_items;
create policy "Guest can manage cart items"
  on public.cart_items
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Guest can create orders" on public.orders;
create policy "Guest can create orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (user_id is null and cart_id is not null);

drop policy if exists "Guest can select orders" on public.orders;
create policy "Guest can select orders"
  on public.orders
  for select
  to anon, authenticated
  using (user_id is null);

drop policy if exists "Guest can update orders" on public.orders;
create policy "Guest can update orders"
  on public.orders
  for update
  to anon, authenticated
  using (user_id is null)
  with check (user_id is null);

drop policy if exists "Guest can insert order items" on public.order_items;
create policy "Guest can insert order items"
  on public.order_items
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id is null
    )
  );
