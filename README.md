# ShopVerse

A full-stack e-commerce storefront built with React and Supabase — browsing, cart, wishlist, checkout, and order history, backed by a Postgres schema with row-level security.

## Features

- Email/password auth (Supabase Auth) with an auto-created customer profile on signup
- Product catalog with categories, discount pricing, and stock tracking
- Cart and wishlist, persisted per user
- Checkout with shipping address management and multiple payment methods
- Order history with line items and payment status
- Coupon-driven promo banner and live category item counts on the homepage
- Row-level security throughout: customers only ever see their own cart, orders, addresses, and wishlist

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for client-side routing
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.com/) (Postgres, Auth, RLS) for the backend

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then open its SQL Editor and run every file in `sql/` **in numeric order** (`part0` → `part10`):

| File | What it does |
| --- | --- |
| `part0_profiles.sql` | `profiles` table |
| `part1_catalog.sql` | Categories, products, product images, inventory, cart, wishlist |
| `part2_orders.sql` | Shipping addresses, orders, order items, payments, reviews, coupons, notifications |
| `part3_indexes_triggers.sql` | Indexes, `updated_at` triggers, inventory-reduction trigger, `product_ratings` / `order_summary` views, `dashboard_stats()` |
| `part4_security.sql` | Enables RLS and adds policies for every table |
| `part5_auto_profile.sql` | Trigger that creates a `profiles` row on signup |
| `part6_seed.sql` | Sample categories and products |
| `part7_visual_fixes.sql` | Fixes for a couple of seeded image URLs |
| `part8_coupons.sql` | Sample coupon used by the homepage promo banner |
| `part9_more_products.sql` | Additional seeded products |
| `part10_inr_pricing.sql` | Converts seeded prices to INR |

Then go to **Authentication → Sign In / Providers → Email** and turn off **Confirm email** — Supabase's built-in test email sender has a very low rate limit, so leaving confirmation on will eventually block signups.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your project's URL and anon/publishable key (Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the app

```bash
npm run dev
```

## Project structure

```
src/
  components/   Navbar, Footer, ProductCard, AddressForm, ProtectedRoute
  context/      AuthContext, CartContext, WishlistContext
  lib/          Supabase client
  pages/        Home, ProductDetail, Cart, Checkout, Orders, Login, Signup
sql/            Schema, RLS policies, triggers, and seed data (see table above)
```

## Available scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint
