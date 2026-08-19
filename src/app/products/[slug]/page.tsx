import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { ProductDetail } from "./product-detail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "This Santosh Cycles product is not currently available.",
      robots: { index: false, follow: false },
      openGraph: { images: [] },
      twitter: { images: [] },
    };
  }

  const description =
    product.description_en ??
    `${product.name_en} available at Santosh Cycles on MG Road near Head Post Office, Haveri.`;
  const image = product.images[0]?.image_url;

  return {
    title: product.name_en,
    description,
    alternates: { canonical: `/products/${encodeURIComponent(product.slug)}` },
    openGraph: {
      title: `${product.name_en} | Santosh Cycles`,
      description,
      type: "website",
      images: image ? [{ url: image, alt: product.name_en }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${product.name_en} | Santosh Cycles`,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
