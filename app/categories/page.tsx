import { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { PRODUCT_CATEGORIES, CATEGORY_IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse our full collection of premium lifestyle products by category.",
};

type CategoryRow = { category: string; count: number };

export default async function CategoriesPage() {
  const rows = await sql<CategoryRow[]>`
    SELECT category, COUNT(*)::int AS count
    FROM products
    GROUP BY category
  `;

  // Merge the counts with all available categories
  const allCategories = PRODUCT_CATEGORIES.map(catName => {
    const dbRow = rows.find(r => r.category === catName);
    return {
      category: catName,
      count: dbRow ? dbRow.count : 0
    };
  }).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));

  return (
    <AppShell
      title="All Categories"
      subtitle="Explore our full collection of products by category. Hand-picked and organized for you."
    >
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCategories.map((row) => (
          <Link
            key={row.category}
            href={`/categories/${encodeURIComponent(row.category)}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-sm transition hover:shadow-xl hover:-translate-y-1"
          >
            <img 
              src={CATEGORY_IMAGES[row.category] || CATEGORY_IMAGES["Other"]} 
              alt={row.category} 
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            {/* Overlay with subtle blur for the text box area */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white transform transition duration-500 group-hover:translate-y-[-4px]">
              <h2 className="text-base sm:text-2xl font-bold tracking-tight">{row.category}</h2>
              <div className="mt-1 flex items-center gap-2">
                <div className={`h-[1px] w-6 ${row.count > 0 ? "bg-blue-500 group-hover:w-8" : "bg-slate-500"} transition-all`} />
                <span className={`text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.2em] ${row.count > 0 ? "text-slate-300 group-hover:text-white" : "text-slate-400"} transition-colors`}>
                  {row.count} PRODUCTS {row.count === 0 && "(COMING SOON)"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
