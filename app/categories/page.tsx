import Link from "next/link";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";

type CategoryRow = { category: string; count: number };

export default async function CategoriesPage() {
  const rows = await sql<CategoryRow[]>`
    SELECT category, COUNT(*)::int AS count
    FROM products
    GROUP BY category
    ORDER BY count DESC, category ASC
  `;

  // Standard category image mapping used across the project
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
      title="All Categories"
      subtitle="Explore our full collection of products by category. Hand-picked and organized for you."
    >
      {rows.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          No categories found yet. Start listing products to see them here.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((row) => (
            <Link
              key={row.category}
              href={`/categories/${encodeURIComponent(row.category)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-sm transition hover:shadow-xl hover:-translate-y-1"
            >
              <img 
                src={categoryImages[row.category] || categoryImages["Other"]} 
                alt={row.category} 
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              {/* Overlay with subtle blur for the text box area */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white transform transition duration-500 group-hover:translate-y-[-4px]">
                <h2 className="text-base sm:text-2xl font-bold tracking-tight">{row.category}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-[1px] w-6 bg-blue-500 group-hover:w-8 transition-all" />
                  <span className="text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors">
                    {row.count} PRODUCTS
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
