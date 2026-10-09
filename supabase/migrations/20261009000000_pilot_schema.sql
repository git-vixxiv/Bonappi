-- BonAppi pilot schema. See docs/PILOT_SPEC.md.
-- Money is stored in integer cents. Times are timestamptz.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

create type public.staff_role as enum ('owner', 'staff');

create type public.order_status as enum (
  'pending',    -- placed and paid, waiting for the restaurant to accept
  'accepted',
  'declined',
  'arrived',
  'firing',
  'served',
  'closed',
  'cancelled',
  'no_show'
);

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Restaurants, staff, menus
-- ---------------------------------------------------------------------------

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  cuisine text[] not null default '{}',
  price_level smallint not null default 2 check (price_level between 1 and 4),
  address text not null default '',
  city text not null default 'Austin',
  state text not null default 'TX',
  zip_code text not null default '',
  lat double precision,
  lng double precision,
  timezone text not null default 'America/Chicago',
  hours jsonb not null default '{}',
  photo_url text,
  features text[] not null default '{}',
  -- Cached display values; maintained from public reviews later
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  -- Pilot business settings (spec defaults)
  is_listed boolean not null default true,
  accepting_orders boolean not null default true,
  fee_bps integer not null default 600 check (fee_bps between 0 and 3000),
  min_order_cents integer not null default 2000 check (min_order_cents >= 0),
  cancel_window_minutes integer not null default 120,
  grace_minutes integer not null default 15,
  tax_rate_bps integer not null default 825,
  -- Self-reported baselines for the results dashboard
  baseline_ticket_minutes integer,
  baseline_table_minutes integer,
  -- Payment provider connection (tokens live server-side only)
  payment_provider text check (payment_provider in ('square', 'stripe')),
  payment_merchant_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurant_staff (
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.staff_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (restaurant_id, user_id)
);

create index restaurant_staff_user_idx on public.restaurant_staff (user_id);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  slug text not null,
  name text not null,
  description text not null default '',
  category text not null default 'Other',
  base_price_cents integer not null check (base_price_cents >= 0),
  photo_url text,
  dietary_info text[] not null default '{}',
  is_popular boolean not null default false,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  -- Sizes, options, toppings, combos. All prices inside are in cents.
  customizations jsonb not null default '{}',
  -- Cached display values
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create index menu_items_restaurant_idx on public.menu_items (restaurant_id, sort_order);

-- Security-definer helper so policies can check staff membership without
-- recursing through restaurant_staff's own RLS.
create function public.is_restaurant_staff(rid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.restaurant_staff
    where restaurant_id = rid and user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id),
  diner_id uuid not null references auth.users (id),
  -- Snapshot so staff see a name without reading diner profiles
  diner_name text not null default '',
  status public.order_status not null default 'pending',
  party_size smallint not null check (party_size between 1 and 20),
  guest_names text[] not null default '{}',
  arrival_at timestamptz not null,
  notes text not null default '',
  subtotal_cents integer not null check (subtotal_cents >= 0),
  tax_cents integer not null default 0 check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  fee_bps integer not null,
  -- Entered by staff at close; captures at-table spend for average check
  final_check_cents integer check (final_check_cents >= 0),
  payment_provider text,
  payment_id text,
  refunded_cents integer not null default 0,
  -- Timestamps for the results dashboard
  ordered_at timestamptz not null default now(),
  accepted_at timestamptz,
  declined_at timestamptz,
  arrived_at timestamptz,
  fired_at timestamptz,
  served_at timestamptz,
  closed_at timestamptz,
  cancelled_at timestamptz,
  no_show_at timestamptz,
  updated_at timestamptz not null default now()
);

create index orders_restaurant_arrival_idx on public.orders (restaurant_id, arrival_at);
create index orders_diner_idx on public.orders (diner_id, ordered_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name text not null,
  quantity smallint not null check (quantity between 1 and 50),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  customizations jsonb not null default '{}',
  special_instructions text not null default ''
);

create index order_items_order_idx on public.order_items (order_id);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  actor_id uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index order_events_order_idx on public.order_events (order_id, created_at);

-- Allowed status transitions and who may make them.
-- Diners: cancel (before the window closes) and mark arrived.
-- Staff: everything else, plus arrived as a backup.
create function public.advance_order(
  p_order_id uuid,
  p_status public.order_status,
  p_final_check_cents integer default null
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  o public.orders;
  r public.restaurants;
  uid uuid := (select auth.uid());
  is_staff boolean;
  is_diner boolean;
  allowed boolean := false;
begin
  select * into o from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'order not found' using errcode = 'P0002';
  end if;

  select * into r from public.restaurants where id = o.restaurant_id;
  is_staff := public.is_restaurant_staff(o.restaurant_id);
  is_diner := o.diner_id = uid;

  if not (is_staff or is_diner) then
    raise exception 'not allowed' using errcode = '42501';
  end if;

  allowed := case
    when is_staff and o.status = 'pending' and p_status in ('accepted', 'declined') then true
    when o.status = 'accepted' and p_status = 'arrived' then true
    when is_staff and o.status = 'accepted' and p_status = 'no_show'
      and now() > o.arrival_at + make_interval(mins => r.grace_minutes) then true
    when is_staff and o.status = 'arrived' and p_status = 'firing' then true
    when is_staff and o.status = 'firing' and p_status = 'served' then true
    when is_staff and o.status = 'served' and p_status = 'closed' then true
    when is_diner and o.status in ('pending', 'accepted') and p_status = 'cancelled'
      and now() <= o.arrival_at - make_interval(mins => r.cancel_window_minutes) then true
    when is_staff and o.status in ('pending', 'accepted') and p_status = 'cancelled' then true
    else false
  end;

  if not allowed then
    raise exception 'cannot move order from % to %', o.status, p_status
      using errcode = '22023';
  end if;

  if p_status = 'closed' and p_final_check_cents is null then
    raise exception 'final check total is required to close' using errcode = '22023';
  end if;

  update public.orders set
    status = p_status,
    accepted_at = case when p_status = 'accepted' then now() else accepted_at end,
    declined_at = case when p_status = 'declined' then now() else declined_at end,
    arrived_at = case when p_status = 'arrived' then now() else arrived_at end,
    fired_at = case when p_status = 'firing' then now() else fired_at end,
    served_at = case when p_status = 'served' then now() else served_at end,
    closed_at = case when p_status = 'closed' then now() else closed_at end,
    cancelled_at = case when p_status = 'cancelled' then now() else cancelled_at end,
    no_show_at = case when p_status = 'no_show' then now() else no_show_at end,
    final_check_cents = coalesce(p_final_check_cents, final_check_cents),
    updated_at = now()
  where id = p_order_id
  returning * into o;

  insert into public.order_events (order_id, status, actor_id)
  values (p_order_id, p_status, uid);

  return o;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reviews, private notes, replies, usuals
-- ---------------------------------------------------------------------------

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  diner_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  order_id uuid references public.orders (id) on delete set null,
  rating smallint check (rating between 1 and 5),
  body text not null default '',
  -- Storage paths in the meal-photos bucket
  photo_paths text[] not null default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A photo alone is a valid review
  constraint review_has_content check (
    rating is not null or length(body) > 0 or cardinality(photo_paths) > 0
  )
);

create index reviews_restaurant_idx on public.reviews (restaurant_id, created_at desc);
create index reviews_diner_idx on public.reviews (diner_id, created_at desc);

-- "Remember Next Time" lives apart from reviews so it can never become public.
create table public.diner_notes (
  id uuid primary key default gen_random_uuid(),
  diner_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete cascade,
  review_id uuid references public.reviews (id) on delete set null,
  note text not null check (length(note) between 1 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index diner_notes_lookup_idx on public.diner_notes (diner_id, restaurant_id, menu_item_id);

create table public.review_replies (
  review_id uuid primary key references public.reviews (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.usual_orders (
  id uuid primary key default gen_random_uuid(),
  diner_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete cascade,
  label text not null default '',
  quantity smallint not null default 1 check (quantity between 1 and 50),
  customizations jsonb not null default '{}',
  special_instructions text not null default '',
  last_ordered_at timestamptz,
  created_at timestamptz not null default now()
);

create index usual_orders_diner_idx on public.usual_orders (diner_id, restaurant_id);

-- Diner consent for a restaurant to see their phone and market to them.
create table public.marketing_opt_ins (
  diner_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (diner_id, restaurant_id)
);

-- Anonymous dish ratings (public + private) for restaurant staff only.
create function public.restaurant_dish_ratings(p_restaurant_id uuid)
returns table (menu_item_id uuid, avg_rating numeric, rating_count bigint, private_count bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_restaurant_staff(p_restaurant_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query
    select rv.menu_item_id,
           round(avg(rv.rating)::numeric, 2),
           count(rv.rating),
           count(rv.rating) filter (where not rv.is_public)
    from public.reviews rv
    where rv.restaurant_id = p_restaurant_id
      and rv.menu_item_id is not null
      and rv.rating is not null
    group by rv.menu_item_id;
end;
$$;

-- Diner list for staff: name and visit history; phone only with opt-in.
create function public.restaurant_guests(p_restaurant_id uuid)
returns table (
  diner_id uuid,
  display_name text,
  visit_count bigint,
  last_visit_at timestamptz,
  phone text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_restaurant_staff(p_restaurant_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query
    select o.diner_id,
           coalesce(p.display_name, max(o.diner_name)),
           count(*) filter (where o.status = 'closed'),
           max(o.closed_at),
           case when m.diner_id is not null then u.phone::text end
    from public.orders o
    join auth.users u on u.id = o.diner_id
    left join public.profiles p on p.id = o.diner_id
    left join public.marketing_opt_ins m
      on m.diner_id = o.diner_id and m.restaurant_id = o.restaurant_id
    where o.restaurant_id = p_restaurant_id
    group by o.diner_id, p.display_name, m.diner_id, u.phone;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_staff enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_events enable row level security;
alter table public.reviews enable row level security;
alter table public.diner_notes enable row level security;
alter table public.review_replies enable row level security;
alter table public.usual_orders enable row level security;
alter table public.marketing_opt_ins enable row level security;

-- Profiles: self only
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Restaurants: listed ones are public; staff can read and update their own
create policy "restaurants: public read" on public.restaurants
  for select to anon, authenticated
  using (is_listed or public.is_restaurant_staff(id));
create policy "restaurants: owner update" on public.restaurants
  for update to authenticated
  using (public.is_restaurant_staff(id))
  with check (public.is_restaurant_staff(id));

-- Fee and payment fields are set by BonAppi, not by restaurant staff.
revoke update on public.restaurants from authenticated;
grant update (
  name, description, cuisine, price_level, address, city, state, zip_code,
  lat, lng, hours, photo_url, features, accepting_orders, min_order_cents,
  cancel_window_minutes, grace_minutes, baseline_ticket_minutes,
  baseline_table_minutes, updated_at
) on public.restaurants to authenticated;

-- Staff: members see their own restaurant's roster
create policy "staff: read own restaurant" on public.restaurant_staff
  for select to authenticated using (public.is_restaurant_staff(restaurant_id));

-- Menu: public read of available items at listed restaurants; staff manage
create policy "menu: public read" on public.menu_items
  for select to anon, authenticated
  using (
    exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_listed)
    or public.is_restaurant_staff(restaurant_id)
  );
create policy "menu: staff insert" on public.menu_items
  for insert to authenticated with check (public.is_restaurant_staff(restaurant_id));
create policy "menu: staff update" on public.menu_items
  for update to authenticated
  using (public.is_restaurant_staff(restaurant_id))
  with check (public.is_restaurant_staff(restaurant_id));
create policy "menu: staff delete" on public.menu_items
  for delete to authenticated using (public.is_restaurant_staff(restaurant_id));

-- Orders: read by the diner and the restaurant's staff. No direct writes:
-- creation happens server-side with payment, status changes via advance_order.
create policy "orders: diner or staff read" on public.orders
  for select to authenticated
  using (diner_id = (select auth.uid()) or public.is_restaurant_staff(restaurant_id));

create policy "order items: diner or staff read" on public.order_items
  for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.diner_id = (select auth.uid()) or public.is_restaurant_staff(o.restaurant_id))
  ));

create policy "order events: diner or staff read" on public.order_events
  for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.diner_id = (select auth.uid()) or public.is_restaurant_staff(o.restaurant_id))
  ));

-- Reviews: diners manage their own; public ones are readable by everyone
create policy "reviews: read own or public" on public.reviews
  for select to anon, authenticated
  using (is_public or diner_id = (select auth.uid()));
create policy "reviews: insert own" on public.reviews
  for insert to authenticated with check (diner_id = (select auth.uid()));
create policy "reviews: update own" on public.reviews
  for update to authenticated
  using (diner_id = (select auth.uid()))
  with check (diner_id = (select auth.uid()));
create policy "reviews: delete own" on public.reviews
  for delete to authenticated using (diner_id = (select auth.uid()));

-- Private notes: owner only, all operations
create policy "notes: own" on public.diner_notes
  for all to authenticated
  using (diner_id = (select auth.uid()))
  with check (diner_id = (select auth.uid()));

-- Replies: public read; staff write one per public review at their restaurant
create policy "replies: public read" on public.review_replies
  for select to anon, authenticated using (true);
create policy "replies: staff insert" on public.review_replies
  for insert to authenticated
  with check (
    public.is_restaurant_staff(restaurant_id)
    and exists (
      select 1 from public.reviews rv
      where rv.id = review_id and rv.restaurant_id = review_replies.restaurant_id and rv.is_public
    )
  );
create policy "replies: staff update" on public.review_replies
  for update to authenticated
  using (public.is_restaurant_staff(restaurant_id))
  with check (public.is_restaurant_staff(restaurant_id));
create policy "replies: staff delete" on public.review_replies
  for delete to authenticated using (public.is_restaurant_staff(restaurant_id));

-- Usuals: owner only
create policy "usuals: own" on public.usual_orders
  for all to authenticated
  using (diner_id = (select auth.uid()))
  with check (diner_id = (select auth.uid()));

-- Opt-ins: diner manages their own
create policy "opt-ins: own" on public.marketing_opt_ins
  for all to authenticated
  using (diner_id = (select auth.uid()))
  with check (diner_id = (select auth.uid()));

-- Functions: lock down execute to signed-in users
revoke execute on function public.advance_order(uuid, public.order_status, integer) from public, anon;
revoke execute on function public.restaurant_dish_ratings(uuid) from public, anon;
revoke execute on function public.restaurant_guests(uuid) from public, anon;
grant execute on function public.advance_order(uuid, public.order_status, integer) to authenticated;
grant execute on function public.restaurant_dish_ratings(uuid) to authenticated;
grant execute on function public.restaurant_guests(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: meal photos (private bucket; paths are "<user id>/<file>")
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'meal-photos', 'meal-photos', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do nothing;

create policy "meal photos: owner upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "meal photos: owner delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "meal photos: owner or public review read" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'meal-photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1 from public.reviews rv
        where rv.is_public and name = any (rv.photo_paths)
      )
    )
  );
