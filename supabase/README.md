# Supabase

- `migrations/` — schema, row-level security, storage bucket. Apply in filename order.
- `seed.sql` — sample restaurants and menus, generated from `src/data` by
  `node scripts/generate-seed.mjs > supabase/seed.sql`.

## Applying (dashboard)

1. Supabase dashboard → SQL Editor → New query.
2. Paste `migrations/20261009000000_pilot_schema.sql`, Run.
3. New query, paste `seed.sql`, Run.

## Dashboard settings the app depends on

- **Authentication → URL Configuration:** Site URL `https://bonappi.vercel.app`
  (or the production domain); add `https://*-vixxiv.vercel.app/**` and
  `http://localhost:5173/**` to Redirect URLs so email links work on previews.
- **Authentication → Email Templates → Magic Link:** include `{{ .Token }}` so
  the email carries a 6-digit code as well as the link.
- **Authentication → Providers → Phone:** enable with an SMS provider (Twilio,
  MessageBird, Vonage or Textlocal) for phone sign-in. Until then, use
  "Use email instead" on the sign-in screen.

## Keys

The publishable key in `/.env` is public by design. The secret key never goes
in the repo; server code reads it from Vercel / Supabase function secrets.

## Making someone restaurant staff

```sql
insert into public.restaurant_staff (restaurant_id, user_id, role)
select r.id, u.id, 'owner'
from public.restaurants r, auth.users u
where r.slug = 'valentinos-pizzeria' and u.email = 'someone@example.com';
```
