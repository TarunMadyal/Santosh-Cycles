-- Santosh Cycles public product catalogue
-- Visitors can only read active products. All edits stay in Supabase Studio.

create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name_en text not null,
  name_kn text,
  description_en text,
  description_kn text,
  category text not null check (
    category in ('baby', 'kids', 'adult', 'geared', 'accessories', 'spare-parts')
  ),
  brand text,
  price numeric(10, 2) check (price is null or price >= 0),
  image_url text,
  wheel_size text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

grant usage on schema public to anon, authenticated;
grant select on table public.products to anon, authenticated;
revoke insert, update, delete on table public.products from anon, authenticated;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

create index if not exists products_active_catalog_idx
on public.products (category, is_featured desc, sort_order, created_at desc)
where is_active = true;

comment on table public.products is
  'Public catalogue managed by Santosh Cycles through Supabase Studio.';

-- Public product photos. Downloads are public; uploads remain restricted to
-- project administrators using Supabase Studio.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
