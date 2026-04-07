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
    update public.payments
    set
      order_id = v_order.id,
      status = v_payment_row_status,
      amount = greatest(coalesce(p_amount, 0), 0),
      raw_payload = coalesce(p_payload, '{}'::jsonb),
      updated_at = timezone('utc', now())
    where gateway_payment_id = p_gateway_payment_id;

    if not found then
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
      );
    end if;
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
