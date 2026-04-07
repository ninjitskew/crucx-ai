# crucx.ai Admin CMS

Zero-cost, client-only CMS built on top of the static Next.js export + Supabase free tier.
There are no server routes — every admin page is a client component calling Supabase with RLS-enforced access. The only admin is **alcubis@gmail.com** (hardcoded fallback + DB trigger).

## 5-step manual setup

1. **Apply migrations in order** (Supabase SQL editor or `supabase db push`):
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_orders.sql`
   - `supabase/migrations/0003_admin_cms.sql`
2. **Set env vars** in `.env.local` (and in your host):
   - `NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>`
   - *(optional, build-time only)* `SUPABASE_SERVICE_ROLE_KEY=<service role key>` — enables `scripts/snapshot-from-supabase.mjs` to overwrite `src/content/{books,authors}.json` with published CMS rows before `next build`. Leave unset for local dev.
3. **Sign up as admin**: go to `/auth/sign-in/`, request a magic link for `alcubis@gmail.com`, click the email link. The `tg_app_user_auto_admin` trigger promotes you to `role='admin'` on first insert; the `is_admin()` helper also trusts the JWT email as a fallback.
4. **Open `/admin/`**. Non-admins are redirected to `/auth/sign-in/?next=/admin/`. If Supabase env vars are missing the admin shell renders a configuration notice instead of crashing.
5. **Use the CMS**:
   - *Books*: create / edit / publish / archive, with an inline chapter subtable.
   - *Authors*: create / edit / delete (requires an existing `app_user.id` since `author_profile.user_id` is the PK).
   - *Reviews*: moderation queue with Pending / Approved / Rejected tabs. Readers only see `approved` reviews publicly; their own pending reviews show on `/reader/reviews/`.
   - *Audit log*: read-only admin action history.
   - *Settings*: placeholder.

## How image URLs work

Per spec, the admin never uploads files. The `ImageUrlInput` component accepts either a Drive-hosted URL or a relative `/public/...` path synced from Drive via `npm run sync:content`. It shows a live thumbnail preview.

## Build flow

```
prebuild: node scripts/snapshot-from-supabase.mjs && node scripts/build-search-index.mjs
build:    next build   # static export via next.config.ts { output: "export" }
```

If `SUPABASE_SERVICE_ROLE_KEY` is unset the snapshot script is a silent no-op and existing JSON fixtures are used. If the snapshot fails for any reason it falls back to the on-disk JSON so builds stay green.

## Files added

- `supabase/migrations/0003_admin_cms.sql`
- `src/lib/hooks/useAdmin.ts`, `src/lib/admin.ts`
- `src/app/admin/layout.tsx` + `page.tsx`
- `src/app/admin/books/{page.tsx,new/page.tsx,edit/page.tsx}`
- `src/app/admin/authors/{page.tsx,new/page.tsx,edit/page.tsx}`
- `src/app/admin/reviews/page.tsx`
- `src/app/admin/audit/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/components/admin/{AdminSidebar,DataTable,FormField,StatusBadge,ConfirmDialog,ImageUrlInput,BookForm,AuthorForm}.tsx`
- `scripts/snapshot-from-supabase.mjs`

## Files touched

- `package.json` — prebuild now runs the snapshot script first
- `src/lib/types.ts` — added optional `status` to `Book`
- `src/app/books/page/[page]/MarketplaceClient.tsx` — filter published-only
- `src/app/books/[slug]/page.tsx` — filter published-only (both `generateStaticParams` and lookup)
- `src/components/marketplace/ReviewComposer.tsx` — submits with `moderation_status: pending` + “awaiting moderation” toast
- `src/app/reader/reviews/page.tsx` — shows moderation status badge
