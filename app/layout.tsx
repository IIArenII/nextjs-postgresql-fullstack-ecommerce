import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Storefront | Premium Lifestyle Essentials",
    template: "%s | Storefront",
  },
  description: "A carefully selected collection of premium lifestyle products designed for functionality and longevity.",
  keywords: ["ecommerce", "premium", "lifestyle", "essentials", "minimalist", "quality"],
  authors: [{ name: "Storefront Team" }],
  creator: "Storefront",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://storefront-ecommerce.vercel.app",
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
          {children}
        </CartProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
