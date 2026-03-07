import Link from "next/link";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { ArrowRight } from "lucide-react";

type CategoryRow = { category: string; count: number };

export default async function CategoriesPage() {
  const rows = await sql<CategoryRow[]>`
    SELECT category, COUNT(*)::int AS count
    FROM products
    GROUP BY category
    ORDER BY category ASC
  `;

  return (
    <AppShell
      title="Categories"
      subtitle="Browse products by category. Pick one to see items in that section."
    >
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          No categories found yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <Link
              key={row.category}
              href={`/categories/${encodeURIComponent(row.category)}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
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
      )}
    </AppShell>
  );
}

