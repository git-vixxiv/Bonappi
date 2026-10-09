-- Demo: make an account staff at Valentino's and give it sample orders to
-- work on the /kitchen board. Run in the Supabase SQL Editor.
-- 1. Sign in to BonAppi once with this email (Use email instead → code).
-- 2. Replace the email below, then Run. Each run adds three more demo orders.

with me as (
  select id from auth.users where email = 'YOUR-EMAIL@example.com'
),
r as (
  select id from public.restaurants where slug = 'valentinos-pizzeria'
),
staff as (
  insert into public.restaurant_staff (restaurant_id, user_id, role)
  select r.id, me.id, 'owner' from r, me
  on conflict do nothing
),
new_orders as (
  insert into public.orders
    (restaurant_id, diner_id, diner_name, status, party_size, arrival_at,
     subtotal_cents, tax_cents, total_cents, fee_bps, notes, accepted_at, arrived_at)
  select r.id, me.id, v.name, v.status::public.order_status, v.party,
         now() + make_interval(mins => v.mins), 3798, 313, 4111, 600, v.notes,
         case when v.status <> 'pending' then now() - interval '30 minutes' end,
         case when v.status = 'arrived' then now() - interval '2 minutes' end
  from r, me, (values
    ('Demo: Alice', 'pending', 2, 60, ''),
    ('Demo: Bob', 'accepted', 4, 25, 'Birthday, bring candle'),
    ('Demo: Cara', 'arrived', 2, -3, '')
  ) as v(name, status, party, mins, notes)
  returning id
)
insert into public.order_items (order_id, menu_item_id, name, quantity, unit_price_cents, customizations)
select o.id, mi.id, mi.name, 2, 1899,
       '{"size": "medium", "crust": "traditional", "toppings": []}'::jsonb
from new_orders o
cross join lateral (
  select id, name from public.menu_items
  where slug = 'margherita-pizza'
    and restaurant_id = (select id from public.restaurants where slug = 'valentinos-pizzeria')
) mi;

-- Clean up demo orders later:
-- delete from public.orders where diner_name like 'Demo:%';
