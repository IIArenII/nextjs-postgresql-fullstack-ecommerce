import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingBag } from "lucide-react";
import { CATEGORY_IMAGES } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const imageUrl = CATEGORY_IMAGES[decodedCategory] || CATEGORY_IMAGES["Other"];

  return {
    title: decodedCategory,
    description: `Shop the best ${decodedCategory} collection at Storefront. Premium products curated for you.`,
    openGraph: {
      title: `${decodedCategory} Collection`,
      description: `Explore our premium range of ${decodedCategory}.`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

type Product = {
  id: number;
  name: string;
  description: string;
  price: unknown;
  category: string;
  stock_num?: number;
  discount_percent?: number;
  is_favorited?: boolean;
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

  const session = await getSession();
  const userId = session?.userId ?? '00000000-0000-0000-0000-000000000000';

  const [countRows, products] = await Promise.all([
    sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM products
      WHERE category = ${decodedCategory} AND status = 'approved'
    `,
    sql<Product[]>`
      SELECT id, name, description, price, category, stock_num, discount_percent, image_url,
        EXISTS(SELECT 1 FROM favorite_products WHERE product_id = products.id AND user_id = ${userId}::uuid) AS is_favorited
      FROM products
      WHERE category = ${decodedCategory} AND status = 'approved'
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
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 rounded-full bg-slate-50 p-4 dark:bg-slate-900">
            <ShoppingBag className="h-10 w-10 text-slate-300 dark:text-slate-700" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Nothing here yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            We haven&apos;t added any products to the <strong>{decodedCategory}</strong> collection just yet. Check back soon for new arrivals!
          </p>
          <Link
            href="/products"
            className="mt-8 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-blue-700 hover:-translate-y-0.5"
          >
            EXPLORE ALL PRODUCTS
          </Link>
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

