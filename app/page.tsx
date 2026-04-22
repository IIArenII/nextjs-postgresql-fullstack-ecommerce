import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, MoveRight, ShoppingBag } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storefront | Premium Lifestyle Essentials",
  description: "Explore our curated collection of high-quality essentials designed to improve your daily life. Simple, functional, and built to last.",
};

import { PRODUCT_CATEGORIES, CATEGORY_IMAGES } from "@/lib/constants";
import { MotionSection, MotionDiv } from "@/components/MotionComponents";

interface Product {
  id: number;
  name: string;
  description: string;
  price: unknown;
  category: string;
  image_url?: string;
  discount_percent?: number;
  is_favorited?: boolean;
}

export default async function Home() {
  const rows = await sql<{ category: string; count: number }[]>`
    SELECT category, COUNT(*)::int AS count
    FROM products
    WHERE status = 'approved'
    GROUP BY category
  `;

  // Merge with all categories to ensure we show at least 4 items, sorted by popularity
  const featuredCategories = PRODUCT_CATEGORIES.map(catName => {
    const dbRow = rows.find(r => r.category === catName);
    return {
      category: catName,
      count: dbRow ? dbRow.count : 0
    };
  }).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, 4);

  const session = await getSession();
  const userId = session?.userId ?? '00000000-0000-0000-0000-000000000000';

  const latestProducts = await sql<Product[]>`
    SELECT id, name, description, price, category, discount_percent, image_url,
      EXISTS(SELECT 1 FROM favorite_products WHERE product_id = products.id AND user_id = ${userId}::uuid) AS is_favorited
    FROM products
    WHERE status = 'approved'
    ORDER BY id DESC
    LIMIT 8
  `;

  return (
    <AppShell 
      title={null}
      subtitle={null}
    >
      {/* Hero Section */}
      <MotionSection className="relative mb-20 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-8 px-8 py-12 sm:px-14 sm:py-16">
          
          {/* Left: Text Content — always visible */}
          <div className="flex-1 flex flex-col items-start w-full">
            <MotionDiv delay={0.1}>
              <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400 block">
                The Digital Atelier
              </span>
            </MotionDiv>
            <MotionDiv delay={0.2}>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">
                <span className="text-slate-900 dark:text-white">Empowering<br />Your<br /></span>
                <span className="text-blue-600">Commercial<br />Journey</span>
              </h1>
            </MotionDiv>
            <MotionDiv delay={0.3}>
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-xs">
                Seamless experiences for buyers, sellers, and moderators. A curated ecosystem where every transaction feels bespoke.
              </p>
            </MotionDiv>
            <MotionDiv delay={0.4} className="mt-8 flex items-center gap-6">
              <Link
                href="/products"
                className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/seller"
                className="group flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Start Selling <MoveRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </MotionDiv>
          </div>

          {/* Right: Image — hidden on tablet (md), shown on mobile (below text) and desktop (side by side) */}
          <MotionDiv
            delay={0.3}
            className="w-full lg:flex-1 lg:max-w-sm xl:max-w-md md:hidden lg:block"
          >
            <div className="overflow-hidden rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
              <Image
                src="/images/e-commerce-main-page-img.png"
                alt="Modern workspace setup"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </MotionDiv>

        </div>
      </MotionSection>

      {/* Directory Section */}
      <MotionSection className="mb-24">
        <div className="mb-8 flex items-end justify-between px-2 sm:px-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 block">
              COLLECTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredCategories.map((row, i) => (
            <MotionDiv
              key={row.category}
              delay={i * 0.1}
            >
              <Link
                href={`/categories/${encodeURIComponent(row.category)}`}
                className="group relative block aspect-[3/4] md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 transition shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <Image
                  src={CATEGORY_IMAGES[row.category] || CATEGORY_IMAGES["Other"]}
                  alt={row.category}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white transform transition duration-500 group-hover:translate-y-[-4px]">
                  <h3 className="text-sm sm:text-xl font-bold tracking-tight">{row.category}</h3>
                  <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-300 group-hover:text-white transition-colors">
                    {row.count} PRODUCTS {row.count === 0 && "(COMING SOON)"}
                  </p>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </MotionSection>

      {/* Latest Products Section */}
      <MotionSection>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2 block">
              NEW ARRIVALS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Latest Collections
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            See all products <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {latestProducts.map((p) => (
            <div key={p.id} className="text-sm">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </MotionSection>
    </AppShell>
  );
}
