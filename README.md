# RadeeshBike Accesorios

An e-commerce storefront for bike spare parts and accessories, built with Next.js (App Router), TypeScript and Tailwind CSS.

## Features

- **Home page**: hero with search, shop-by-category grid, deals and top-rated sections.
- **Catalogue** (`/products`):
  - Free-text search across name, brand, tags, category and description (every word must match; results ranked by relevance).
  - Filters: category, compatible bike type, brand, price range (presets or exact values), minimum rating, in stock, on sale.
  - Sorting: featured, price low/high, top rated, newest, name A–Z.
  - Active-filter chips, result count, empty state, mobile filter drawer.
  - Filter state lives in the URL, so filtered views can be shared and the back button works.
- **Product page** (`/products/[slug]`): gallery, price with discount, stock status, quantity selector, features, specifications, compatibility, related products.
- **Cart** (`/cart`): quantity controls, remove, savings, free-shipping progress. Persists in the browser (localStorage) and syncs across tabs.
- **Checkout** (`/checkout`): contact and delivery form with validation, payment method choice, order confirmation.
- **Currency:** prices in Sri Lankan Rupees (LKR). Free shipping over LKR 3,500; shipping fee LKR 350.
- **Languages:** English and Sinhala (සිංහල). Switch with the header button; the choice is remembered. Product names and descriptions are translated too (`src/data/catalog-si.ts`). Search matches both languages.
- **Dark mode:** switch with the header button, or follow the system setting on first visit. The choice is remembered and applied before the page paints.
- Responsive layout, keyboard-accessible controls, reduced-motion support, skip link.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

## Project structure

```
src/
  data/catalog.ts        Products (LKR prices), categories, brands and bike types
  data/catalog-si.ts     Sinhala product names, descriptions and features
  i18n/messages.ts       All UI strings in English and Sinhala (Sinhala must match every key)
  i18n/i18n-context.tsx  Language provider and translation hook
  lib/filters.ts         Pure search / filter / sort logic and URL (de)serialisation
  lib/format.ts          LKR currency formatting
  lib/order.ts           Shipping rules (LKR)
  components/
    cart-context.tsx     Cart store (localStorage-backed)
    theme-context.tsx    Dark/light theme store and pre-paint init script
    preferences-toggles.tsx  Language and theme buttons
    catalog-view.tsx     Catalogue page: search, sort, chips, grid, drawer
    filter-panel.tsx     Sidebar / drawer filter controls
    product-card.tsx     Product tile
    product-art.tsx      Placeholder artwork, star ratings
    site-header.tsx      Header, search, cart badge, mobile menu
    site-footer.tsx      Footer
  app/                   Routes: /, /products, /products/[slug], /cart, /checkout
```

## Current limitations

These are intentional gaps for a first version and need a backend before going live:

- **Catalogue data is static** (`src/data/catalog.ts`). Move it to a database or CMS for live inventory.
- **Orders are not transmitted.** Checkout validates the form and clears the cart, but nothing is saved server-side and no confirmation email is sent.
- **No payment gateway.** The UPI and cash-on-delivery options are recorded only; wire in a provider such as Razorpay or Stripe.
- **Product images are placeholders.** Replace `ProductArt` with `next/image` and real photos.
- **Catalogue filtering runs in the browser**, so the product list is filled in after JavaScript loads.
- **Specification labels and values stay in English** (for example "Material: Ceramic"). Translate them via `catalog-si.ts` if needed.
- **Page titles and meta descriptions are English only.**
- **Prices are sample values** converted from earlier INR figures at roughly 1 INR = 3.5 LKR. Replace them with real LKR prices.
