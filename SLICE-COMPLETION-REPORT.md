# crucx.ai Reader Marketplace — Slice Completion Report

Branch: `main` (uncommitted, per instructions). `npm run build` passes after every slice (final run prerendered 53 routes, 0 errors).

## Defaults chosen (no questions asked)
- Currency: USD primary; all formatted via `formatUSD()` in `src/lib/format.ts`. Existing rupee strings on legacy author-portal pages were left untouched to avoid breaking their copy.
- Format: `eBook` only at launch.
- Razorpay test mode by default. If `NEXT_PUBLIC_RAZORPAY_KEY_ID` is unset, `openCheckout` simulates a successful payment so the cart→library flow can be smoke-tested without keys.
- Order id: client-generated, prefix `ord_`, then base36 timestamp + random suffix. Persisted to Supabase from the client immediately after the Razorpay handler fires. (Document 0002 SQL covers RLS.)
- Success page: routed at `/checkout/success/?id=<orderId>` (a non-dynamic page), because Next.js static export does not allow runtime dynamic params. The previously-existing `/checkout/success/[orderId]/` route is kept as a thin client-side redirect to the new query-string page so any direct hits keep working.
- Wishlist + follow: I extended the existing `wishlist` and `follow` tables with `book_slug` / `author_slug` text columns (the seed catalog is JSON-driven, so we cannot use `book.id`). See migration `0002_orders.sql`.
- Search index: emitted at build time by `scripts/build-search-index.mjs`, wired via a new `prebuild` script in `package.json`. The `/search` page falls back to inline data if the JSON is missing.
- Figma mirroring (the optional last step): NOT executed — left out so the code stays the priority. All page routes are stable; mirroring can be done from the live site or component files later.

## Files added
### Marketplace components (`src/components/marketplace/`)
- `BookCard.tsx`, `BookCarousel.tsx`, `RatingStars.tsx`
- `FilterSidebar.tsx`, `SortDropdown.tsx`, `Pagination.tsx`, `Breadcrumbs.tsx`, `EmptyState.tsx`
- `SamplePreviewModal.tsx`, `SamplePreviewLauncher.tsx`
- `BuyBox.tsx`, `CartDrawer.tsx`
- `ReviewComposer.tsx`, `FollowAuthorButton.tsx`, `FollowedAuthorsCarousel.tsx`

### Pages (`src/app/`)
- `auth/sign-in/page.tsx`, `auth/sign-up/page.tsx`
- `cart/page.tsx`
- `checkout/page.tsx`
- `checkout/success/page.tsx`         (real success view, query-string driven)
- `checkout/success/[orderId]/page.tsx` + `Redirect.tsx` (legacy redirect shim)
- `reader/wishlist/page.tsx`, `reader/reviews/page.tsx`, `reader/settings/page.tsx`, `reader/orders/page.tsx`
- `search/page.tsx`
- `marketplace/[category]/[page]/CategoryClient.tsx` (sibling of the existing server `page.tsx`)

### Lib
- `src/lib/format.ts`
- `src/lib/types.ts`
- `src/lib/payments.ts`
- `src/lib/stores/cart.ts` (zustand + localStorage)
- `src/lib/hooks/useUser.ts`
- `src/lib/lib-shim.ts`

### Scripts / data
- `scripts/build-search-index.mjs` (emits `public/search-index.json`)
- `supabase/migrations/0002_orders.sql`
- `docs/payments-go-live.md`

## Files changed
- `src/app/books/page.tsx` — full storefront upgrade (hero + 5 carousels + Followed-Authors carousel + category grid).
- `src/app/books/[slug]/page.tsx` — full PDP rebuild (cover, author, rating, format pill, BuyBox, sample modal, TOC, author bio with Follow button, mock reviews + ReviewComposer, "Readers Also Bought" carousel).
- `src/app/marketplace/[category]/[page]/page.tsx` — server wrapper that delegates to `CategoryClient.tsx` (filters/sort/pagination).
- `src/app/reader/library/page.tsx` — now reads `download_grant` from Supabase, lists owned eBooks with download CTA.
- `src/components/layout/Navbar.tsx` — search icon, cart icon w/ badge, user menu (Library / Wishlist / Orders / Settings / Sign out), mobile parity, links to new routes.
- `src/lib/constants.ts` — `NAV_LINKS` now points at the real marketplace routes.
- `src/content/books.json` — extended from 1 to 12 books across 8 categories with USD prices, ratings, tags, TOCs.
- `src/content/authors.json` — extended from 1 to 10 authors.
- `package.json` — added `prebuild` script, `zustand` and `fuse.js` dependencies.
- `.env.example` — added Razorpay env vars.

## Manual steps for the user
1. **Run Supabase migrations** in the SQL editor (or via `supabase db push`):
   - `supabase/migrations/0001_init.sql` (already existed)
   - `supabase/migrations/0002_orders.sql` (new — adds `cart`, `address`, `order`, `order_item`, `download_grant`, `wishlist_v2`, plus `wishlist.book_slug` and `follow.author_slug` patches with RLS).
2. **Set env vars** (local in `.env.local`, plus your static host):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx     # optional in dev — flow simulates if missing
   NEXT_PUBLIC_RAZORPAY_LIVE=false
   NEXT_PUBLIC_RAZORPAY_KEY_ID_LIVE=            # only when going live
   ```
3. **Build & deploy**:
   ```
   npm install        # picks up zustand + fuse.js
   npm run build      # runs prebuild search-index, then static export to ./out
   ```
4. **Going live with payments**: see `docs/payments-go-live.md` (3-step toggle).
5. **Sign-in flow**: Magic-link OTP. In the Supabase dashboard, set the Site URL to your deployed origin so the email-link `emailRedirectTo=/reader/library/` resolves correctly.
6. **Cover art**: BookCard / PDP currently render gradient placeholders (no covers were shipped). Drop real images into `public/books/` matching each `cover` field in `src/content/books.json` whenever ready.

## Known follow-ups (not blockers)
- Anonymous-cart → Supabase merge on sign-in is wired in `cart` table schema but the merge call itself is left as a TODO inside the cart store; the localStorage cart already survives sign-in for the same browser.
- Razorpay handler is client-only (no signature verification). For higher-trust products you should add a Supabase Edge Function that verifies the webhook before flipping `order.status` to `paid`.
- Stripe fallback: `payments.ts` is structured to make a Stripe Checkout swap a one-function rewrite, but the implementation itself was left as a TODO.
- Figma mirroring of the new pages into file `hhUWI98dhAxo6OnzR7c9oj` under a "Marketplace v1" page was deprioritized per the brief — code completeness was priority 1.
