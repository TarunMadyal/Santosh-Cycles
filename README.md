# Santosh Cycles

Mobile-first bilingual website for Santosh Cycles, MG Road, Haveri. It includes English/Kannada switching, WhatsApp and call actions, store information, repair services, local SEO, and a Supabase-powered product catalogue.

## Getting Started

## Local development

Copy `.env.example` to `.env.local`, add the Supabase project URL and publishable key, then run `pnpm dev`.

Open [http://localhost:3000](http://localhost:3000).

## Catalogue

The public site reads active products from Supabase. Visitors have read-only access through RLS; catalogue updates are made in Supabase Studio. See `docs/PRODUCT_CATALOGUE.md`.

## Deployment

The `main` branch is the production source for Vercel. Other branches create preview deployments before changes are merged.
