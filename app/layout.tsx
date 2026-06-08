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
  metadataBase: new URL("https://mantix-website.vercel.app"),
  title: "MANTIX — Designed T-Shirts | Nepal Streetwear",
  description:
    "MANTIX is Nepal's next streetwear identity. Three precision-crafted designed T-shirts in our first limited drop. Smart fashion, sharp identity — starting from Rs. 1,399.",
  keywords: [
    "MANTIX",
    "Nepal streetwear",
    "designed t-shirts",
    "Kathmandu fashion",
    "oversized t-shirt Nepal",
  ],
  openGraph: {
    title: "MANTIX — Designed T-Shirts | Nepal Streetwear",
    description:
      "Nepal's next streetwear identity. Three precision-crafted pieces in our first limited drop.",
    url: "https://mantix-website.vercel.app",
    siteName: "MANTIX",
    images: ["/MANTIX_LOGO.png"],
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mantix-website.vercel.app/#organization",
      name: "MANTIX",
      url: "https://mantix-website.vercel.app",
      logo: "https://mantix-website.vercel.app/MANTIX_LOGO.png",
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
      name: "MANTIX First Collection",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "The Phantom — Black Oversized",
            description: "Premium everyday streetwear essential",
            category: "Streetwear T-Shirt",
            brand: { "@type": "Brand", name: "MANTIX" },
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
            brand: { "@type": "Brand", name: "MANTIX" },
            offers: { "@type": "Offer", price: "1399", priceCurrency: "NPR", availability: "https://schema.org/PreOrder" },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Product",
            name: "The Venom — Dark Green Signature",
            description: "Core MANTIX identity colorway",
            category: "Streetwear T-Shirt",
            brand: { "@type": "Brand", name: "MANTIX" },
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