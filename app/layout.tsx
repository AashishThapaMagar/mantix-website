import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mantrix-website.vercel.app"),
  title: "MANTRIX — Designed T-Shirts | Streetwear",
  description:
    "MANTRIX is the next streetwear identity. Three precision-crafted designed T-shirts in our first limited drop. Smart fashion, sharp identity — starting from Rs. 1,399.",
  keywords: [
    "MANTRIX",
    "streetwear",
    "designed t-shirts",
    "oversized t-shirt",
    "limited drop",
    "premium streetwear",
  ],
  openGraph: {
    title: "MANTRIX — Designed T-Shirts | Streetwear",
    description:
      "The next streetwear identity. Three precision-crafted pieces in our first limited drop.",
    url: "https://mantrix-website.vercel.app",
    siteName: "MANTRIX",
    images: ["/mantrix-logo.png"],
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mantrix-website.vercel.app/#organization",
      name: "MANTRIX",
      url: "https://mantrix-website.vercel.app",
      logo: "https://mantrix-website.vercel.app/mantrix-logo.png",
      slogan: "Smart Fashion. Sharp Identity.",
      description: "Nepal's next streetwear identity — designed T-shirts.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
    },
    {
      "@type": "ItemList",
      name: "MANTRIX First Collection",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "The Phantom — Black Oversized",
            description: "Premium everyday streetwear essential",
            category: "Streetwear T-Shirt",
            brand: { "@type": "Brand", name: "MANTRIX" },
            offers: { "@type": "Offer", price: "1499", priceCurrency: "NPR", availability: "https://schema.org/PreOrder" },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "The Ghost — White Essential",
            description: "Clean minimal design for daily wear",
            category: "Streetwear T-Shirt",
            brand: { "@type": "Brand", name: "MANTRIX" },
            offers: { "@type": "Offer", price: "1399", priceCurrency: "NPR", availability: "https://schema.org/PreOrder" },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Product",
            name: "The Venom — Dark Green Signature",
            description: "Core MANTRIX identity colorway",
            category: "Streetwear T-Shirt",
            brand: { "@type": "Brand", name: "MANTRIX" },
            offers: { "@type": "Offer", price: "1499", priceCurrency: "NPR", availability: "https://schema.org/PreOrder" },
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}