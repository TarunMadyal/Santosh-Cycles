import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://santosh-cycles-haveri.vercel.app"),
  title: {
    default: "Santosh Cycles | Cycles, Accessories & Repairs in Haveri",
    template: "%s | Santosh Cycles",
  },
  description:
    "Cycles for every age, accessories, spare parts and complete cycle repairs at Santosh Cycles, MG Road, Haveri.",
  keywords: [
    "cycle shop Haveri",
    "bicycle shop Haveri",
    "cycle repair Haveri",
    "kids cycles Haveri",
    "cycle accessories Haveri",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Santosh Cycles — Haveri",
    description: "Cycles for every age, accessories, spare parts and complete repairs on MG Road, Haveri.",
    type: "website",
    locale: "en_IN",
    alternateLocale: ["kn_IN"],
    images: [
      {
        url: "/og.png",
        width: 1728,
        height: 909,
        alt: "Santosh Cycles — cycles for every age on MG Road, Haveri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santosh Cycles — Haveri",
    description: "Cycles for every age, accessories, spare parts and complete repairs on MG Road, Haveri.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
