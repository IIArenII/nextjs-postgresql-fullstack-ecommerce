import Link from "next/link";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  description: string;
  price: unknown;
  category: string;
  stock_num?: number;
  discount_percent?: number;
};

const PAGE_SIZE = 20;

function groupByCategory(products: Product[]) {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const key = p.category || "Other";
    const arr = map.get(key) ?? [];
    arr.push(p);
    map.set(key, arr);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const parsedPage = Number(page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (currentPage - 1) * PAGE_SIZE;

  const searchQuery = q ? `%${q}%` : null;

  const [countRows, products] = await Promise.all([
    sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE ${
        searchQuery 
          ? sql`name ILIKE ${searchQuery} OR category ILIKE ${searchQuery} OR description ILIKE ${searchQuery}` 
          : sql`TRUE`
      }
    `,
    sql<Product[]>`
      SELECT id, name, description, price, category, stock_num, discount_percent
      FROM products
      WHERE ${
        searchQuery 
          ? sql`name ILIKE ${searchQuery} OR category ILIKE ${searchQuery} OR description ILIKE ${searchQuery}` 
          : sql`TRUE`
      }
      ORDER BY category ASC, name ASC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
  ]);

  const totalCount = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const grouped = groupByCategory(products);

  return (
    <AppShell
      title="All products"
      subtitle={
        <span>
          Browse everything, grouped by category. You&apos;re seeing{" "}
          {products.length} of {totalCount} items on page {currentPage} of{" "}
          {totalPages}. Want a narrower list?{" "}
          <Link
            href="/categories"
            className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            Pick a category
          </Link>
          .
        </span>
      }
    >
      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          <p className="text-lg font-medium">No products found.</p>
          {q && (
            <div className="mt-4">
              <p className="text-slate-500">We couldn&apos;t find anything matching &quot;{q}&quot;</p>
              <Link
                href="/products"
                className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Clear search
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-12">
            {grouped.map(([category, items]) => (
              <section key={category} className="scroll-mt-24">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      {category}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {items.length} item{items.length === 1 ? "" : "s"} on this
                      page
                    </p>
                  </div>
                  <Link
                    href={`/categories/${encodeURIComponent(category)}`}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    View category
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              <div>
                Page {currentPage} of {totalPages} · Showing{" "}
                {offset + 1}-{offset + products.length} of {totalCount} items
              </div>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={
                      currentPage === 2 ? "/products" : `/products?page=${currentPage - 1}`
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-slate-100 px-3 py-1.5 text-slate-300 dark:border-slate-900 dark:text-slate-600">
                    Previous
                  </span>
                )}
                {currentPage < totalPages ? (
                  <Link
                    href={`/products?page=${currentPage + 1}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="cursor-not-allowed rounded-lg border border-slate-100 px-3 py-1.5 text-slate-300 dark:border-slate-900 dark:text-slate-600">
                    Next
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
