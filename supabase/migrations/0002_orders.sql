-- crucx.ai marketplace v1: orders, addresses, downloads, cart, follow-by-slug
-- Run after 0001_init.sql.

-- ===== Cart (server mirror of localStorage cart) =====
create table if not exists public.cart (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.cart enable row level security;
create policy "cart owner all" on public.cart
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== Addresses =====
create table if not exists public.address (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  line1 text,
  line2 text,
  city text,
  region text,
  postal_code text,
  country text,
  created_at timestamptz not null default now()
);
alter table public.address enable row level security;
create policy "address owner all" on public.address
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ===== Orders =====
create table if not exists public."order" (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  total_usd numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  payment_id text,
  created_at timestamptz not null default now()
);
alter table public."order" enable row level security;
create policy "order owner read" on public."order"
  for select using (auth.uid() = user_id);
create policy "order owner write" on public."order"
  for insert with check (auth.uid() = user_id);

create table if not exists public.order_item (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public."order"(id) on delete cascade,
  book_slug text not null,
  title text not null,
  price_usd numeric(10,2) not null,
  qty int not null default 1
);
alter table public.order_item enable row level security;
create policy "order_item owner read" on public.order_item
  for select using (
    exists (select 1 from public."order" o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_item owner write" on public.order_item
  for insert with check (
    exists (select 1 from public."order" o where o.id = order_id and o.user_id = auth.uid())
  );

-- ===== Download grants (entitlements) =====
create table if not exists public.download_grant (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_slug text not null,
  order_id text references public."order"(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, book_slug)
);
alter table public.download_grant enable row level security;
create policy "grant owner read" on public.download_grant
  for select using (auth.uid() = user_id);
create policy "grant owner write" on public.download_grant
  for insert with check (auth.uid() = user_id);

-- ===== Slug-based wishlist & follow (so client can use static seed slugs) =====
-- Replace previous wishlist that used book.id with a slug version.
create table if not exists public.wishlist_v2 (
  user_id uuid references auth.users(id) on delete cascade,
  book_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, book_slug)
);
alter table public.wishlist_v2 enable row level security;
create policy "wishlist_v2 owner" on public.wishlist_v2
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- For convenience, the app reads/writes a `wishlist` view-or-table with (user_id, book_slug).
-- If you prefer the original table, drop this and add a `book_slug` column there instead.
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='wishlist' and column_name='book_slug') then
    alter table public.wishlist add column if not exists book_slug text;
  end if;
end $$;

-- ===== Follow by slug (so client can follow seeded authors) =====
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='follow' and column_name='author_slug') then
    alter table public.follow add column if not exists author_slug text;
  end if;
end $$;
