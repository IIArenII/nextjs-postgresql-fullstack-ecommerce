import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-context";
import { DemoDisclaimer } from "@/components/DemoDisclaimer";
import { AuthUrlCleaner } from "@/components/AuthUrlCleaner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://storefront.com"),
  title: {
    default: "Storefront | Premium Lifestyle Essentials",
    template: "%s | Storefront",
  },
  description: "Discover a carefully selected collection of premium lifestyle products designed for functionality and longevity at Storefront.",
  keywords: ["ecommerce", "premium", "lifestyle", "essentials", "minimalist", "quality", "storefront"],
  authors: [{ name: "Storefront Team" }],
  creator: "Storefront",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://storefront.com",
    siteName: "Storefront",
    title: "Storefront | Premium Lifestyle Essentials",
    description: "Curated collection of high-quality essentials for your lifestyle.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Storefront Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Storefront | Premium Lifestyle Essentials",
    description: "Curated collection of high-quality essentials for your lifestyle.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-id", // Placeholder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          <AuthUrlCleaner />
          {children}
          <DemoDisclaimer />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Storefront",
                "url": "https://storefront.com",
                "logo": "https://storefront.com/favicon.ico",
                "sameAs": [
                  "https://twitter.com/storefront",
                  "https://instagram.com/storefront"
                ]
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Storefront",
                "url": "https://storefront.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://storefront.com/products?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }),
            }}
          />
        </CartProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
