create unique index if not exists idx_payments_gateway_payment_id_unique
on public.payments(gateway_payment_id)
where gateway_payment_id is not null;

create or replace view public.storefront_products as
select
  p.id,
  p.category_id,
  c.slug as category_slug,
  c.name as category_name,
  p.name,
  p.slug,
  p.description,
  p.price,
  p.active,
  p.created_at,
  p.updated_at,
  coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', pi.id,
        'product_id', pi.product_id,
        'image_url', pi.image_url,
        'alt_text', pi.alt_text,
        'position', pi.position,
        'bucket', pi.bucket,
        'storage_path', pi.storage_path,
        'created_at', pi.created_at
      )
      order by pi.position
    ) filter (where pi.id is not null),
    '[]'::jsonb
  ) as images
from public.products p
left join public.categories c on c.id = p.category_id
left join public.product_images pi on pi.product_id = p.id
where p.active = true
group by p.id, c.slug, c.name;

grant select on public.storefront_products to anon, authenticated;

create or replace function public.process_mercado_pago_webhook(
  p_external_reference text,
  p_gateway_payment_id text default null,
  p_status text default 'pending',
  p_amount numeric default 0,
  p_payload jsonb default '{}'::jsonb
)
returns table (
  order_id bigint,
  payment_status text,
  order_status text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
  v_payment_status text;
  v_order_status text;
  v_payment_row_status text;
begin
  select *
  into v_order
  from public.orders
  where external_reference = p_external_reference
     or id::text = p_external_reference
  limit 1;

  if v_order.id is null then
    raise exception 'Order not found for external reference %', p_external_reference;
  end if;

  v_payment_status := case lower(coalesce(p_status, 'pending'))
    when 'approved' then 'paid'
    when 'authorized' then 'authorized'
    when 'refunded' then 'refunded'
    when 'cancelled' then 'failed'
    when 'rejected' then 'failed'
    else 'pending'
  end;

  v_order_status := case lower(coalesce(p_status, 'pending'))
    when 'approved' then 'paid'
    when 'refunded' then 'refunded'
    when 'cancelled' then 'cancelled'
    when 'rejected' then 'cancelled'
    else 'pending_payment'
  end;

  v_payment_row_status := case lower(coalesce(p_status, 'pending'))
    when 'approved' then 'approved'
    when 'refunded' then 'refunded'
    when 'cancelled' then 'cancelled'
    when 'rejected' then 'rejected'
    else 'pending'
  end;

  if p_gateway_payment_id is not null then
    insert into public.payments (
      order_id,
      gateway,
      gateway_payment_id,
      status,
      amount,
      raw_payload
    )
    values (
      v_order.id,
      'mercado_pago',
      p_gateway_payment_id,
      v_payment_row_status,
      greatest(coalesce(p_amount, 0), 0),
      coalesce(p_payload, '{}'::jsonb)
    )
    on conflict (gateway_payment_id)
    do update set
      status = excluded.status,
      amount = excluded.amount,
      raw_payload = excluded.raw_payload,
      updated_at = timezone('utc', now());
  else
    insert into public.payments (
      order_id,
      gateway,
      gateway_payment_id,
      status,
      amount,
      raw_payload
    )
    values (
      v_order.id,
      'mercado_pago',
      null,
      v_payment_row_status,
      greatest(coalesce(p_amount, 0), 0),
      coalesce(p_payload, '{}'::jsonb)
    );
  end if;

  update public.orders
  set
    payment_status = v_payment_status,
    status = v_order_status,
    mercadopago_payment_id = coalesce(p_gateway_payment_id, mercadopago_payment_id),
    updated_at = timezone('utc', now())
  where id = v_order.id;

  if v_order.cart_id is not null then
    update public.carts
    set
      status = case
        when v_order_status = 'paid' then 'completed'
        when v_order_status = 'cancelled' then 'abandoned'
        else status
      end,
      updated_at = timezone('utc', now())
    where id = v_order.cart_id;
  end if;

  return query
  select v_order.id, v_payment_status, v_order_status;
end;
$$;

revoke all on function public.process_mercado_pago_webhook(text, text, text, numeric, jsonb) from public;
grant execute on function public.process_mercado_pago_webhook(text, text, text, numeric, jsonb) to service_role;
