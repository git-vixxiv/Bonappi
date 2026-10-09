# BonAppi Pilot Spec

Approved 2026-10-09. This is the source of truth for pilot scope. Anything not listed here is post-pilot.

## Business model

- **Who pays:** restaurants. Diners use BonAppi free.
- **Fee:** 6% all-in on each prepaid order (BonAppi absorbs processing out of that 6%). Rate is configurable per restaurant. No monthly fee during the pilot.
- **Payments:** Square first. The restaurant connects its Square account via OAuth; BonAppi creates the payment on the seller's account and takes its fee with `app_fee_money`. Since Square deducts processing (2.9% + 30¢ online) from the seller, our `app_fee_money` = 6% of the order − Square's processing fee, so the restaurant's total cost is 6%.
- **Second provider:** payments sit behind a provider interface so Stripe Connect can be added later for non-Square restaurants.
- **Minimum order:** $20 for pre-orders (restaurant can raise it).
- **Pilot:** 2–3 Austin restaurants, Square-based restaurants preferred. Not yet signed; the demo is the sales tool.

## What the pilot must prove

1. Restaurants convert to paid.
2. Diners come back (repeat rate).
3. Measurable restaurant outcomes: arrival-to-food time, table time, average check.

Every order records timestamps from day one: `ordered_at`, `accepted_at`, `arrived_at`, `fired_at`, `served_at`, `closed_at`.

## Diner flow (PWA, phone + SMS code sign-in)

1. **Discover** a restaurant, pick an arrival time and party size. This is a reservation stand-in; real reservation inventory is post-pilot.
2. **Build the order**, including "My Usual" saved dishes. Host orders and pays for the whole party; guests can be added by name.
3. **Pay in full at order time.** No tip at this step. Apple Pay / Google Pay via Square Web Payments SDK.
4. **Wait for the restaurant to accept** (staff tap Accept/Decline).
5. **Reminder text** 10 minutes before arrival. Diner taps **"I'm here"** on arrival; staff can mark arrival on the tablet as a backup.
6. **At the table:** tips and add-on items go through the restaurant's normal service and POS, on a separate check.
7. **Review the meal:**
   - **Photo of the meal** can be the review on its own; star rating and text are optional extras.
   - **"Remember Next Time:"** a free-text note (e.g. "order extra sauce"), always private to the diner, shown back to them the next time they order that dish or visit that restaurant.
   - **Private or public:** private reviews are visible only to the diner; restaurants see them only as anonymous aggregates (e.g. "Margherita: 4.6 avg from 38 private ratings"). Public reviews show on the restaurant page.
   - Diner is told at rating time how private ratings are used.

## Restaurant flow (tablet dashboard)

- Accept/decline incoming orders + reservation stand-ins.
- Live list: upcoming, arrived, firing, served, closed. Buttons to mark arrived (backup), fire, served, close.
- At close, staff enter the **final check total** (captures at-table spend for the average-check metric).
- Orders also pushed to Square POS via the Orders API (pending sandbox verification, see Open items).
- One public reply per public review.
- Diner names and visit history visible; phone/marketing contact only with diner opt-in.
- **Results dashboard:** weekly BonAppi orders and revenue, arrival-to-food time, table time, repeat-diner rate, dish ratings (incl. anonymous private aggregates), average check. Baseline comparison uses the restaurant's self-reported normal times, labeled as such.

## Policies (defaults, configurable per restaurant)

| Event | Outcome |
|---|---|
| Diner cancels ≥ 2 hours before arrival | Full refund |
| Diner cancels < 2 hours before | No refund |
| Diner late | 15-minute grace period, then staff may mark no-show |
| No-show | No refund; restaurant keeps payment; BonAppi keeps fee |
| Restaurant declines or cancels | Full refund; BonAppi forfeits fee (Square debits the refunded app fee from our account) |

## Menu onboarding

- **Now:** AI menu import. Upload a photo or PDF, AI extracts items, sizes, options and prices into structured data, a human reviews before publishing.
- **Later:** Square Catalog import if the sandbox confirms it works cleanly.

## Technical defaults

- Front end: existing React + Vite + Tailwind, shipped as a PWA.
- Back end: Supabase (Postgres, auth with phone OTP, storage for meal photos, edge functions).
- Hosting: Vercel.
- AI menu import: Claude API.
- Payments: Square Web Payments SDK + Payments API + Orders API, behind a provider interface.

## Open items to verify in Square sandbox

- API-created, paid orders appear in Square POS (docs say yes once paid and with a fulfillment).
- Whether they also reach Square KDS (kitchen display); docs are silent.
- `app_fee_money` behavior on partial refunds.

## Post-pilot

Real reservation inventory, per-guest ordering and split payments, post-meal in-app tipping, Apple/Google sign-in, Toast/Clover POS integration, Stripe Connect, Square Catalog import, native apps.
