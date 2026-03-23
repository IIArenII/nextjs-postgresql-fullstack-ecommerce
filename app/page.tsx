import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, MoveRight, ShoppingBag } from "lucide-react";

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
  const categoryRows = await sql<{ category: string; count: number }[]>`
    SELECT category, COUNT(*)::int AS count
    FROM products
    GROUP BY category
    ORDER BY count DESC, category ASC
    LIMIT 4
  `;

  const session = await getSession();
  const userId = session?.userId ?? '00000000-0000-0000-0000-000000000000';

  const latestProducts = await sql<Product[]>`
    SELECT id, name, description, price, category, discount_percent, image_url,
      EXISTS(SELECT 1 FROM favorite_products WHERE product_id = products.id AND user_id = ${userId}::uuid) AS is_favorited
    FROM products
    ORDER BY id DESC
    LIMIT 6
  `;

  const categoryImages: Record<string, string> = {
    "Books": "/images/cat_books.webp",
    "Electronics": "/images/electronics_minimalist",
    "Home & Garden": "/images/cat_home.webp",
    "Home & Living": "/images/cat_home.webp",
    "Clothing & Apparel": "/images/cat_fashion.webp",
    "Fashion": "/images/cat_fashion.webp",
    "Sports & Outdoors": "/images/sports_minimalist",
    "Other": "/images/elevate_minimalits"
  };

  return (
    <AppShell 
      title={null}
      subtitle={null}
    >
      {/* Hero Section */}
      <section className="relative mb-20 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/elevate_minimalits" 
            alt="Hero background" 
            className="h-full w-full object-cover opacity-60 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-50 via-slate-50/70 to-transparent dark:from-slate-900 dark:via-slate-900/70" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-16 sm:px-16 sm:py-32 lg:max-w-3xl">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            ESTABLISHED 2026
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-7xl leading-[1.1]">
            Essentials for <br className="hidden sm:block" />
            your lifestyle.
          </h1>
          <p className="mt-6 text-sm sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-sm sm:max-w-md">
            A carefully selected collection of products designed to improve your daily life. Simple, functional, and built to last.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <Link
              href="/products"
              className="w-full sm:w-auto text-center rounded-full bg-blue-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0"
            >
              SHOP NOW
            </Link>
            <Link
              href="/categories"
              className="group flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-slate-900 dark:text-white pl-2 sm:pl-0"
            >
              EXPLORE ALL <MoveRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="mb-24">
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

        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {categoryRows.map((row) => (
            <Link
              key={row.category}
              href={`/categories/${encodeURIComponent(row.category)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-slate-800 transition shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <img 
                src={categoryImages[row.category] || categoryImages["Other"]} 
                alt={row.category} 
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white transform transition duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-sm sm:text-xl font-bold tracking-tight">{row.category}</h3>
                <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-300 group-hover:text-white transition-colors">
                  {row.count} PRODUCTS
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products Section */}
      <section>
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
