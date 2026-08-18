import Script from "next/script";
import { Storefront } from "./storefront";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BikeStore",
  name: "Santosh Cycles",
  description:
    "Cycles for every age, accessories, spare parts and complete cycle repairs in Haveri.",
  telephone: ["+91 99001 38902", "+91 94803 42035"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "MG Road",
    addressLocality: "Haveri",
    postalCode: "581110",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  hasMap: "https://maps.app.goo.gl/7pkGdu4PisML9RVV9",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      opens: "11:00",
      closes: "14:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      opens: "15:30",
      closes: "20:00",
    },
  ],
};

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Script
        id="santosh-cycles-local-business"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Storefront products={products} />
    </>
  );
}
