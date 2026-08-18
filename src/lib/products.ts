import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import type { Database } from "@/lib/database.types";

export type ProductCategory =
  | "baby"
  | "kids"
  | "adult"
  | "geared"
  | "accessories"
  | "spare-parts";

export type Product = {
  id: number;
  slug: string;
  name_en: string;
  name_kn: string | null;
  description_en: string | null;
  description_kn: string | null;
  category: ProductCategory;
  brand: string | null;
  price: number | null;
  image_url: string | null;
  wheel_size: string | null;
  is_featured: boolean;
};

export type ProductImage = {
  id: number;
  image_url: string;
  storage_path: string;
  alt_en: string | null;
  alt_kn: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type ProductDetails = Product & {
  images: ProductImage[];
};

function createCatalogueClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createCatalogueClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,slug,name_en,name_kn,description_en,description_kn,category,brand,price,image_url,wheel_size,is_featured",
    )
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error("Unable to load the product catalogue", error.message);
    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,
    price: product.price === null ? null : Number(product.price),
  })) as Product[];
}

export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetails | null> => {
    const supabase = createCatalogueClient();

    if (!supabase) return null;

    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        "id,slug,name_en,name_kn,description_en,description_kn,category,brand,price,image_url,wheel_size,is_featured",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (productError) {
      console.error("Unable to load product details", productError.message);
      return null;
    }

    if (!product) return null;

    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("id,image_url,storage_path,alt_en,alt_kn,sort_order,is_primary")
      .eq("product_id", product.id)
      .order("is_primary", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (imagesError) {
      console.error("Unable to load product images", imagesError.message);
    }

    const gallery = (images ?? []) as ProductImage[];

    if (!gallery.length && product.image_url) {
      gallery.push({
        id: 0,
        image_url: product.image_url,
        storage_path: "",
        alt_en: product.name_en,
        alt_kn: product.name_kn,
        sort_order: 0,
        is_primary: true,
      });
    }

    return {
      ...product,
      category: product.category as ProductCategory,
      price: product.price === null ? null : Number(product.price),
      images: gallery,
    } as ProductDetails;
  },
);
