alter table public.orders
drop constraint if exists orders_status_check;

alter table public.orders
add constraint orders_status_check
check (
  status = any (
    array[
      'draft'::text,
      'pending_payment'::text,
      'paid'::text,
      'delivered'::text,
      'cancelled'::text,
      'refunded'::text
    ]
  )
);
