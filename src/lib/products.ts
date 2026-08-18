import { createClient } from "@supabase/supabase-js";

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

export async function getProducts(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return [];

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

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
