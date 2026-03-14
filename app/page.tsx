import { sql } from "@/lib/db";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: unknown;
  category: string;
  image_url?: string;
  discount_percent?: number;
}

export default async function Home() {
  const categoryRows = await sql<{ category: string; count: number }[]>`
    SELECT category, COUNT(*)::int AS count
    FROM products
    GROUP BY category
    ORDER BY count DESC, category ASC
    LIMIT 6
  `;

  const latestProducts = await sql<Product[]>`
    SELECT id, name, description, price, category, discount_percent
    FROM products
    ORDER BY id DESC
    LIMIT 9
  `;

  return (
    <AppShell
      title={
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          A modern storefront demo
        </span>
      }
      subtitle="Browse by category, open any product for details, and explore the full catalog without cramming everything onto one screen."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:col-span-2">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Browse categories
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Jump into a section to see only what you care about.
              </p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              View all <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {categoryRows.map((row) => (
              <Link
                key={row.category}
                href={`/categories/${encodeURIComponent(row.category)}`}
                className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-950 dark:to-slate-900/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                      {row.category}
                    </div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {row.count} product{row.count === 1 ? "" : "s"}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Explore
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Prefer the full catalog view?
          </p>

          <div className="mt-5 space-y-3">
            <Link
              href="/products"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:hover:bg-slate-900/50"
            >
              View all products
              <ArrowRight className="h-5 w-5 text-slate-500" />
            </Link>
            <Link
              href="/categories"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/30 dark:text-white dark:hover:bg-slate-900/50"
            >
              Browse categories
              <ArrowRight className="h-5 w-5 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Latest products
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              A quick peek at what’s in the database.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            View all <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
