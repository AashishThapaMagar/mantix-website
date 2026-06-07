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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}