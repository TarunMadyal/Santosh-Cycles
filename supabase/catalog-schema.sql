-- Santosh Cycles product catalogue and administrator access.
-- Visitors can read active products. Only the verified administrator email can
-- edit products or manage product photos through the website.

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
revoke all on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;
revoke all on sequence public.products_id_seq from anon;
grant usage, select on sequence public.products_id_seq to authenticated;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products
for select
to anon, authenticated
using (
  is_active = true
  or lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Admin can view every product" on public.products;

drop policy if exists "Admin can add products" on public.products;
create policy "Admin can add products"
on public.products
for insert
to authenticated
with check (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Admin can update products" on public.products;
create policy "Admin can update products"
on public.products
for update
to authenticated
using (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
)
with check (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Admin can delete products" on public.products;
create policy "Admin can delete products"
on public.products
for delete
to authenticated
using (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

create index if not exists products_active_catalog_idx
on public.products (category, is_featured desc, sort_order, created_at desc)
where is_active = true;

comment on table public.products is
  'Public catalogue managed through the Santosh Cycles administrator page.';

create table if not exists public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  image_url text not null,
  storage_path text not null unique,
  alt_en text,
  alt_kn text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.product_images enable row level security;

revoke all on table public.product_images from anon, authenticated;
grant select on table public.product_images to anon, authenticated;
grant insert, update, delete on table public.product_images to authenticated;
revoke all on sequence public.product_images_id_seq from anon;
grant usage, select on sequence public.product_images_id_seq to authenticated;

drop policy if exists "Public can view images for active products" on public.product_images;
create policy "Public can view images for active products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
  or lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Admin can view every product image" on public.product_images;

drop policy if exists "Admin can add product images" on public.product_images;
create policy "Admin can add product images"
on public.product_images
for insert
to authenticated
with check (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Admin can update product images" on public.product_images;
create policy "Admin can update product images"
on public.product_images
for update
to authenticated
using (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
)
with check (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Admin can delete product images" on public.product_images;
create policy "Admin can delete product images"
on public.product_images
for delete
to authenticated
using (
  lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

create index if not exists product_images_product_sort_idx
on public.product_images (product_id, is_primary desc, sort_order, created_at);

create unique index if not exists product_images_one_primary_idx
on public.product_images (product_id)
where is_primary = true;

comment on table public.product_images is
  'Ordered image gallery entries for Santosh Cycles catalogue products.';

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

-- Preserve existing single-image products as the first gallery image.
insert into public.product_images (
  product_id,
  image_url,
  storage_path,
  alt_en,
  sort_order,
  is_primary
)
select
  products.id,
  products.image_url,
  regexp_replace(
    products.image_url,
    '^https://[^/]+/storage/v1/object/public/product-images/',
    ''
  ),
  products.name_en,
  0,
  true
from public.products
where products.image_url is not null
  and products.image_url like '%/storage/v1/object/public/product-images/%'
  and not exists (
    select 1
    from public.product_images
    where product_images.product_id = products.id
  );

drop policy if exists "Catalogue admin can list product photos" on storage.objects;
create policy "Catalogue admin can list product photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-images'
  and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Catalogue admin can upload product photos" on storage.objects;
create policy "Catalogue admin can upload product photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Catalogue admin can replace product photos" on storage.objects;
create policy "Catalogue admin can replace product photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
)
with check (
  bucket_id = 'product-images'
  and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);

drop policy if exists "Catalogue admin can delete product photos" on storage.objects;
create policy "Catalogue admin can delete product photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and lower(coalesce(((select auth.jwt()) ->> 'email'), '')) = 'tarunmadyal@gmail.com'
);
