# BonAppi Implementation Plan

## Overview

This document outlines the phased implementation approach for BonAppi, a mobile-first web application for enhancing the in-restaurant dining experience.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context + useReducer (upgrade to Redux Toolkit if needed)
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Payments**: Stripe
- **Maps/Location**: Google Maps API

---

## Phase 1: Foundation & Core MVP (Weeks 1-4)

### Sprint 1: Project Setup & Core Components

#### 1.1 Project Initialization
- [x] Initialize git repository
- [ ] Set up React + Vite project
- [ ] Configure Tailwind CSS with custom theme
- [ ] Install core dependencies (react-router, lucide-react)
- [ ] Set up project folder structure
- [ ] Configure ESLint + Prettier

#### 1.2 Design System & Shared Components
- [ ] Color palette and typography configuration
- [ ] Button component (primary, secondary, outline, ghost)
- [ ] Input components (text, textarea, select)
- [ ] Card components
- [ ] Modal/Dialog component
- [ ] Toast/Notification component
- [ ] Loading states and skeletons
- [ ] Badge component
- [ ] Star rating component
- [ ] Price display component
- [ ] Bottom navigation component

#### 1.3 Layout & Navigation
- [ ] App shell with bottom navigation
- [ ] Header component (contextual)
- [ ] Screen wrapper component
- [ ] Route configuration

### Sprint 2: Authentication & User Management

#### 2.1 Authentication Flow
- [ ] Firebase Auth setup
- [ ] Auth context provider
- [ ] Login screen (email/password)
- [ ] Registration screen
- [ ] Social login (Google, Apple)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Protected route wrapper

#### 2.2 User Profile Setup
- [ ] Profile creation form
- [ ] Photo upload
- [ ] Dietary preferences selection
- [ ] Location permissions request
- [ ] Push notification opt-in

### Sprint 3: Restaurant Discovery

#### 3.1 Discovery Screen
- [ ] Location header with city display
- [ ] Search bar component
- [ ] "Make Reservation" button
- [ ] Restaurant card component
- [ ] Restaurant list with loading states
- [ ] Filter modal (cuisine, price, distance, rating)
- [ ] Sort options
- [ ] Pull-to-refresh

#### 3.2 Restaurant Data
- [ ] Firestore schema for restaurants
- [ ] Mock restaurant data (10-15 restaurants)
- [ ] Restaurant service/API layer
- [ ] Real-time availability status

### Sprint 4: Restaurant & Menu Details

#### 4.1 Restaurant Detail Screen
- [ ] Hero image section
- [ ] Restaurant info section (name, rating, price, cuisine)
- [ ] Reserve button
- [ ] Tab navigation (Usual Orders, Popular, Menu, About, Reviews)
- [ ] Menu category list
- [ ] Menu item cards
- [ ] "Your Usual Orders" section (personalized)

#### 4.2 Menu Data Structure
- [ ] Firestore schema for menu items
- [ ] Mock menu data with customizations
- [ ] Menu item service layer
- [ ] Category filtering

---

## Phase 2: Ordering System (Weeks 5-8)

### Sprint 5: Dish Detail & Customization

#### 5.1 Dish Detail Screen
- [ ] Hero image with photo button
- [ ] Dish name, rating, price header
- [ ] Favorite/heart button
- [ ] Previous order notes display (if exists)
- [ ] Size selection (radio buttons)
- [ ] Base options (radio buttons with price modifiers)
- [ ] Toppings/add-ons (checkboxes with prices)
- [ ] Combo meal options (nested selections)
- [ ] Special instructions textarea
- [ ] Quantity selector
- [ ] Real-time price calculation
- [ ] "Add to Order" button
- [ ] "Save as My Usual" button

#### 5.2 Customization Logic
- [ ] Price modifier calculations
- [ ] Validation rules (max toppings, required selections)
- [ ] Customization state management
- [ ] Save to user's usual orders

### Sprint 6: Cart & Checkout

#### 6.1 Cart Screen
- [ ] Restaurant header
- [ ] Reservation date/time display
- [ ] Cart items list with customizations
- [ ] Edit/remove item functionality
- [ ] Subtotal, tax, tip calculations
- [ ] Tip selector (15%, 18%, 20%, custom)
- [ ] Payment method display/selection
- [ ] "Place Order" button

#### 6.2 Checkout Flow
- [ ] Cart context/state management
- [ ] Stripe integration setup
- [ ] Payment method saving
- [ ] Order confirmation
- [ ] Add to calendar option

### Sprint 7: Reservation System

#### 7.1 Reservation Flow
- [ ] Dining intent modal ("specific date" vs "flexible")
- [ ] Date/time picker
- [ ] Party size selector
- [ ] Available time slots display
- [ ] Table preferences (optional)
- [ ] Reservation confirmation

#### 7.2 Reservation Management
- [ ] Upcoming reservations list
- [ ] Reservation detail screen
- [ ] Cancel/modify reservation
- [ ] Reservation reminders (push notifications)

### Sprint 8: Order Management

#### 8.1 Order Tracking
- [ ] Order status updates
- [ ] Push notifications for status changes
- [ ] Order history list
- [ ] Order detail screen
- [ ] Reorder functionality

#### 8.2 Location-Based Features
- [ ] Geolocation setup
- [ ] Geofence detection (arriving at restaurant)
- [ ] "I'm here" manual trigger
- [ ] Notify restaurant on arrival
- [ ] Order preparation timing

---

## Phase 3: Personalization & Reviews (Weeks 9-12)

### Sprint 9: Review System

#### 9.1 Review Creation
- [ ] Photo upload (camera/gallery)
- [ ] Multiple photo support
- [ ] Star rating input
- [ ] Review text input
- [ ] Quick tags selection
- [ ] Personal notes (private)
- [ ] Privacy toggle (public/private)
- [ ] Submit and save to history

#### 9.2 Review Display
- [ ] Reviews list on restaurant page
- [ ] Review card component
- [ ] User's reviews in profile
- [ ] Edit/delete own reviews

### Sprint 10: Personal Meal Memory

#### 10.1 "My Usual" System
- [ ] Save dish with full customization
- [ ] Multiple usuals per restaurant
- [ ] Quick reorder from usual
- [ ] Edit/update usual orders
- [ ] Display last ordered date

#### 10.2 Favorites & History
- [ ] Favorite dishes list
- [ ] Order history with full details
- [ ] Personal notes on dishes
- [ ] Search within history

### Sprint 11: Gamification - Status

#### 11.1 User Status System
- [ ] Level calculation logic
- [ ] Progress tracking
- [ ] Status screen design
- [ ] Level badges display
- [ ] Progress to next level

#### 11.2 Restaurant-Specific Status
- [ ] Visit counting per restaurant
- [ ] "Regular" status at 10+ visits
- [ ] Regular badge on restaurant cards
- [ ] Progress indicator to Regular

### Sprint 12: Gamification - Achievements

#### 12.1 Achievement System
- [ ] Achievement definitions
- [ ] Progress tracking
- [ ] Unlock notifications
- [ ] Achievement showcase
- [ ] Share achievements

#### 12.2 Leaderboards
- [ ] Local leaderboard (city)
- [ ] Restaurant leaderboards
- [ ] Category rankings
- [ ] Privacy controls
- [ ] Leaderboard display screen

---

## Phase 4: Polish & Launch Prep (Weeks 13-16)

### Sprint 13: Profile & Settings

#### 13.1 Profile Screen
- [ ] User info display
- [ ] Statistics overview
- [ ] Level/status display
- [ ] Menu navigation

#### 13.2 Settings Screens
- [ ] Payment methods management
- [ ] Dietary preferences
- [ ] Notification settings
- [ ] Privacy settings
- [ ] Account settings
- [ ] Help/Support
- [ ] Data export

### Sprint 14: Performance & Polish

#### 14.1 Performance Optimization
- [ ] Code splitting by route
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Skeleton loading states
- [ ] Error boundaries
- [ ] Offline support basics

#### 14.2 UX Polish
- [ ] Animations and transitions
- [ ] Empty states
- [ ] Error states
- [ ] Loading states
- [ ] Haptic feedback (mobile)
- [ ] Pull-to-refresh everywhere

### Sprint 15: Testing & QA

#### 15.1 Testing
- [ ] Unit tests for utilities
- [ ] Component tests
- [ ] Integration tests for critical flows
- [ ] E2E tests (Playwright)
- [ ] Cross-browser testing
- [ ] Mobile device testing

#### 15.2 Accessibility
- [ ] WCAG 2.1 AA audit
- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] Color contrast verification
- [ ] Touch target sizes

### Sprint 16: Deployment & Launch

#### 16.1 Infrastructure
- [ ] Production Firebase setup
- [ ] Domain configuration
- [ ] SSL/HTTPS
- [ ] CDN setup
- [ ] Monitoring (errors, performance)
- [ ] Analytics setup

#### 16.2 Launch Prep
- [ ] Beta testing program
- [ ] App store preparation (if PWA)
- [ ] Marketing assets
- [ ] Documentation
- [ ] Support systems

---

## Data Models

### Core Firestore Collections

```
/users/{userId}
/restaurants/{restaurantId}
/restaurants/{restaurantId}/menuItems/{itemId}
/users/{userId}/orders/{orderId}
/users/{userId}/reviews/{reviewId}
/users/{userId}/usualOrders/{usualId}
/users/{userId}/achievements/{achievementId}
```

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── Badge.jsx
│   │   ├── StarRating.jsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── AppShell.jsx
│   │   ├── BottomNav.jsx
│   │   ├── Header.jsx
│   │   └── ScreenWrapper.jsx
│   ├── restaurant/            # Restaurant-specific components
│   │   ├── RestaurantCard.jsx
│   │   ├── RestaurantHeader.jsx
│   │   ├── MenuItemCard.jsx
│   │   └── ...
│   ├── dish/                  # Dish-specific components
│   │   ├── DishHeader.jsx
│   │   ├── SizeSelector.jsx
│   │   ├── ToppingsSelector.jsx
│   │   ├── ComboSelector.jsx
│   │   └── ...
│   ├── cart/                  # Cart components
│   │   ├── CartItem.jsx
│   │   ├── TipSelector.jsx
│   │   └── ...
│   └── profile/               # Profile components
│       ├── StatusCard.jsx
│       ├── AchievementCard.jsx
│       └── ...
├── screens/                   # Full page components
│   ├── auth/
│   │   ├── LoginScreen.jsx
│   │   ├── RegisterScreen.jsx
│   │   └── OnboardingScreen.jsx
│   ├── discovery/
│   │   └── DiscoveryScreen.jsx
│   ├── restaurant/
│   │   ├── RestaurantScreen.jsx
│   │   └── DishScreen.jsx
│   ├── cart/
│   │   ├── CartScreen.jsx
│   │   └── CheckoutScreen.jsx
│   ├── reservation/
│   │   └── ReservationScreen.jsx
│   ├── status/
│   │   └── StatusScreen.jsx
│   └── profile/
│       ├── ProfileScreen.jsx
│       └── SettingsScreen.jsx
├── contexts/                  # React Context providers
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── UserContext.jsx
│   └── ToastContext.jsx
├── hooks/                     # Custom React hooks
│   ├── useAuth.js
│   ├── useRestaurants.js
│   ├── useCart.js
│   └── useGeolocation.js
├── services/                  # API/Firebase services
│   ├── firebase.js
│   ├── auth.js
│   ├── restaurants.js
│   ├── orders.js
│   └── payments.js
├── utils/                     # Helper functions
│   ├── formatters.js
│   ├── validators.js
│   └── calculations.js
├── constants/                 # App constants
│   ├── routes.js
│   ├── levels.js
│   └── achievements.js
├── data/                      # Mock data (dev only)
│   ├── restaurants.js
│   ├── menuItems.js
│   └── users.js
├── styles/                    # Global styles
│   └── index.css
├── App.jsx
├── main.jsx
└── routes.jsx
```

---

## Immediate Next Steps

1. **Initialize React + Vite project**
2. **Configure Tailwind with BonAppi theme**
3. **Create folder structure**
4. **Build base UI components**
5. **Set up routing with placeholder screens**
6. **Create mock data**
7. **Build Discovery screen**
8. **Build Restaurant detail screen**
9. **Build Dish detail screen with customization**

---

## Success Metrics for MVP

- [ ] User can browse restaurants
- [ ] User can view restaurant menus
- [ ] User can customize and order dishes
- [ ] User can complete checkout with Stripe
- [ ] User can make reservations
- [ ] User can save "usual" orders
- [ ] User can write reviews
- [ ] Basic status/gamification visible

---

*Last Updated: December 22, 2024*
