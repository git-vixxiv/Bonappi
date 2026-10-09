# BonAppi Implementation Plan

Scope is defined in [docs/PILOT_SPEC.md](docs/PILOT_SPEC.md). This plan sequences it.

**Strategy:** build on the real foundation from day one (Supabase, Square sandbox), using sample menus and test-mode payments, so the sales demo becomes the pilot. Each phase ends with something showable to a prospective restaurant.

## Done (Dec 2025 prototype)

- [x] React + Vite + Tailwind project, brand theme, folder structure, ESLint
- [x] Base UI components (Button, Input, Card, Badge, StarRating, Price)
- [x] App shell, header, bottom nav, routing with placeholders
- [x] Mock data: ~10 Austin restaurants, menus with customizations
- [x] Discovery screen with search
- [x] Restaurant detail with tabs
- [x] Dish detail with size/crust/toppings/combo customization and live pricing
- [x] Cart with tax and tip calculation
- [x] Status and Profile screens (display only, mock data)
- [x] Cleanup (Oct 2026): lint clean, dish-default bug fixed, in-range dependency updates

## Phase 1: Foundation (week 1)

- [ ] Supabase project: schema for restaurants, menus, orders, order events, reviews, users, restaurant staff
- [ ] Row-level security policies (diner sees own data; staff see their restaurant only)
- [ ] Phone + SMS code sign-in for diners; email sign-in for restaurant staff
- [ ] Replace mock data layer with Supabase queries; seed sample Austin menus
- [ ] Vercel deploy with preview URLs per PR
- [ ] PWA manifest, icons, installable on iOS/Android

## Phase 2: Order + pay (weeks 2–3) → **first restaurant demo**

- [ ] Arrival time + party size picker (reservation stand-in)
- [ ] Checkout: $20 minimum, prepay in full, no tip line
- [ ] Payment provider interface; Square implementation (sandbox)
- [ ] Square OAuth connect flow for restaurants
- [ ] `app_fee_money` = 6% − Square processing; per-restaurant rate setting
- [ ] Apple Pay / Google Pay via Square Web Payments SDK (domain verification)
- [ ] Order confirmation + status screen for diner
- [ ] Restaurant tablet dashboard: accept/decline, live order board, arrived/fired/served/close, final check total entry
- [ ] Order event timestamps recorded on every status change
- [ ] Sandbox test: paid API orders in Square POS and KDS

## Phase 3: Arrival + policies (week 4)

- [ ] SMS reminder 10 minutes before arrival
- [ ] "I'm here" button; staff backup arrival
- [ ] Cancellation window (2h), grace period (15m), no-show handling
- [ ] Refunds via provider interface (restaurant-cancel forfeits our fee)
- [ ] Push paid orders to Square POS via Orders API

## Phase 4: Reviews + memory (week 5)

- [ ] Meal photo capture/upload as a standalone review
- [ ] Optional star rating and text
- [ ] "Remember Next Time:" private note, shown on next order of that dish/restaurant
- [ ] Private/public toggle with clear disclosure of anonymous aggregation
- [ ] Public reviews on restaurant page; one restaurant reply per review
- [ ] "My Usual" saved orders and one-tap reorder

## Phase 5: Restaurant value (week 6)

- [ ] AI menu import (photo/PDF → structured menu → human review → publish)
- [ ] Results dashboard: orders, revenue, arrival-to-food, table time, repeat rate, dish ratings, average check, self-reported baseline
- [ ] Diner list with visit history; contact info only with opt-in
- [ ] Restaurant onboarding: Square connect, menu import, policy settings, baseline times

## Phase 6: Pilot readiness (week 7–8)

- [ ] Switch Square to production for pilot restaurants
- [ ] Error monitoring and basic analytics
- [ ] End-to-end tests for order → pay → arrive → close → review
- [ ] Staff training sheet; diner FAQ; terms and privacy policy (legal review required)
- [ ] SMS consent language reviewed before any marketing texts

## Post-pilot

See "Post-pilot" in the spec.

*Last updated: 2026-10-09*
