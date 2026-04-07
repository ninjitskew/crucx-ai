-- crucx.ai — Admin CMS migration
-- Adds moderation, audit log, admin RLS, and a trigger that auto-promotes
-- alcubis@gmail.com to admin on first sign-up.

-- ============================================================
-- 1. Verify / extend existing columns
-- ============================================================

-- app_user.role already exists (0001). No-op guard:
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='app_user' and column_name='role'
  ) then
    alter table public.app_user add column role text not null default 'reader'
      check (role in ('reader','author','admin'));
  end if;
end $$;

-- book.status / book.published_at already exist (0001). No-op guard:
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='book' and column_name='status'
  ) then
    alter table public.book add column status text not null default 'draft'
      check (status in ('draft','published','archived'));
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='book' and column_name='published_at'
  ) then
    alter table public.book add column published_at timestamptz;
  end if;
end $$;

-- Review moderation fields
alter table public.review
  add column if not exists moderation_status text not null default 'pending'
    check (moderation_status in ('pending','approved','rejected')),
  add column if not exists moderated_by uuid references public.app_user(id) on delete set null,
  add column if not exists moderated_at timestamptz,
  add column if not exists moderation_note text;

-- ============================================================
-- 2. Audit log
-- ============================================================
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.app_user(id) on delete set null,
  entity text not null,
  entity_id text,
  action text not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- ============================================================
-- 3. is_admin() helper
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.app_user where id = auth.uid()),
    false
  ) or coalesce(
    (auth.jwt() ->> 'email') = 'alcubis@gmail.com',
    false
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- 4. Auto-promote alcubis@gmail.com trigger
-- ============================================================
create or replace function public.tg_auto_admin()
returns trigger
language plpgsql
as $$
begin
  if new.email = 'alcubis@gmail.com' then
    new.role := 'admin';
  end if;
  return new;
end;
$$;

drop trigger if exists tg_app_user_auto_admin on public.app_user;
create trigger tg_app_user_auto_admin
  before insert on public.app_user
  for each row execute function public.tg_auto_admin();

-- Backfill if the account already exists
update public.app_user set role = 'admin' where email = 'alcubis@gmail.com';

-- ============================================================
-- 5. Admin RLS policies
-- ============================================================

-- book: admin full control (in addition to existing public read + author write)
drop policy if exists "book admin all" on public.book;
create policy "book admin all" on public.book
  for all using (public.is_admin()) with check (public.is_admin());

-- author_profile: admin full control
drop policy if exists "author admin all" on public.author_profile;
create policy "author admin all" on public.author_profile
  for all using (public.is_admin()) with check (public.is_admin());

-- chapter: admin full control + allow admin read of all chapters (not just samples)
drop policy if exists "chapter admin all" on public.chapter;
create policy "chapter admin all" on public.chapter
  for all using (public.is_admin()) with check (public.is_admin());

-- review: tighten public read to approved-only; admin sees & mutates everything
drop policy if exists "reviews readable" on public.review;
create policy "reviews public approved" on public.review
  for select using (moderation_status = 'approved' or public.is_admin() or auth.uid() = user_id);

drop policy if exists "review admin update" on public.review;
create policy "review admin update" on public.review
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "review admin delete" on public.review;
create policy "review admin delete" on public.review
  for delete using (public.is_admin());

-- audit_log: admin-only read; inserts happen via server-side or admin clients
drop policy if exists "audit admin read" on public.audit_log;
create policy "audit admin read" on public.audit_log
  for select using (public.is_admin());

drop policy if exists "audit admin insert" on public.audit_log;
create policy "audit admin insert" on public.audit_log
  for insert with check (public.is_admin());

-- app_user: admin can read everyone (for reviewer emails, etc.)
drop policy if exists "app_user admin read" on public.app_user;
create policy "app_user admin read" on public.app_user
  for select using (public.is_admin() or auth.uid() = id);
