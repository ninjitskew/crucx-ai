# Crucx.ai — project rules for Claude Code

Claude Code auto-reads this file at the start of every session. Anything
listed here is a permanent rule — do not violate without explicit user
approval, and never make the user repeat these requests.

## Stack

- Next.js 16.1.6 App Router with `output: "export"` (static export)
- Tailwind v4 with design tokens (`bg-bg-primary`, `text-text-primary`,
  `border-border-default`, `accent-blue`, `accent-purple`, etc.)
- Supabase (Mumbai free tier) — Postgres + auth + RLS
- Razorpay test mode (client-side only)
- Hostinger FTP deploy via GitHub Actions on push to `main`
- Live URL: https://crucx.ai

## Non-negotiable UX rules

1. **Global navbar + footer** — every page on the site must show the top
   navbar (logo, Marketplace, Authors, Pricing, My Library / user menu) and
   footer. These are mounted in `src/app/layout.tsx`. Never re-import them
   inside individual pages; never wrap a page in anything that hides them.
2. **Admin link placement** — the "Admin CMS" link must only appear in the
   signed-in user's profile dropdown (and only when `useAdmin().isAdmin`
   is true). Never add an Admin link to the public top-level nav.
3. **Responsive** — every page must work in light mode, dark mode, and
   mobile widths (single column, 44px touch targets, sticky-safe).
4. **Pricing is USD** everywhere user-facing.
5. **Authentication UX** — sign-in and sign-up must offer:
   - Google OAuth (`signInWithOAuth`)
   - Email + password (with show/hide, live rules checklist on sign-up:
     8+ chars, upper, lower, number, special)
   - Magic link toggle as fallback
   - Forgot password → `/auth/forgot-password/` → reset email →
     `/auth/reset-password/`
6. **Admin management** — `/admin/settings/` must allow the primary admin
   to promote another user to admin by email and to revoke non-primary
   admins. `alcubis@gmail.com` is the primary owner and cannot be revoked.

## Admin access

- Primary admin is hardcoded in `src/lib/hooks/useAdmin.ts` →
  `ADMIN_EMAILS = ["alcubis@gmail.com"]`. This gives instant admin access
  on email match, no DB round-trip.
- Secondary admins live in `app_user.role = 'admin'` (promoted via
  `/admin/settings/`). RLS policies in
  `supabase/migrations/0003_admin_cms.sql` enforce admin-only writes.
- All `/admin/*` pages are gated by the admin layout which redirects
  non-admins to sign-in.

## Deploy workflow

- Every push to `main` triggers `.github/workflows/deploy.yml` which
  builds with env vars from GitHub secrets and FTPs `./out/` to Hostinger.
- Required GitHub secrets: `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`,
  `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Never commit `.env.local`.

## File conventions

- Use the design tokens, never hex colors.
- Use `window.location.assign(...)` for client-side navigation that needs
  to replace the history entry (works in Claude Preview where
  `location.href = ...` sometimes fails).
- When adding a new page, do NOT import Navbar/Footer — they're global.
- Static export: dynamic segments need `generateStaticParams`. Prefer
  `?id=` query strings over dynamic admin edit routes.

## Current state (as of 2026-04)

- Supabase project: `gruihugbdzpjpykeegsr` (Mumbai)
- Primary admin: `alcubis@gmail.com`
- Google OAuth client configured in Google Cloud project `crucx-ai`,
  wired to Supabase Auth Providers → Google
- All three migrations applied: `0001_init.sql`, `0002_orders.sql`,
  `0003_admin_cms.sql`
