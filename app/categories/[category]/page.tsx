import Link from "next/link";
import { notFound } from "next/navigation";
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

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const { page } = await searchParams;
  const decodedCategory = decodeURIComponent(category);

  const parsedPage = Number(page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (currentPage - 1) * PAGE_SIZE;

  if (!decodedCategory) notFound();

  const [countRows, products] = await Promise.all([
    sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE category = ${decodedCategory}
    `,
    sql<Product[]>`
      SELECT id, name, description, price, category, stock_num, discount_percent
      FROM products
      WHERE category = ${decodedCategory}
      ORDER BY name ASC
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `,
  ]);

  const totalCount = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <AppShell
      title={decodedCategory}
      subtitle={
        <span>
          <Link
            href="/categories"
            className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            Categories
          </Link>{" "}
          /{" "}
          <span className="text-slate-600 dark:text-slate-300">
            {decodedCategory} · Page {currentPage} of {totalPages} (
            {totalCount} item{totalCount === 1 ? "" : "s"})
          </span>
        </span>
      }
    >
      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          No products found in this category.
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
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
                      currentPage === 2
                        ? `/categories/${encodeURIComponent(decodedCategory)}`
                        : `/categories/${encodeURIComponent(
                            decodedCategory,
                          )}?page=${currentPage - 1}`
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
                    href={`/categories/${encodeURIComponent(
                      decodedCategory,
                    )}?page=${currentPage + 1}`}
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

