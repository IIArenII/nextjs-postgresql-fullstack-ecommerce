import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { formatCurrencyUSD } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { Tag } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: unknown;
  category: string;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const products = await sql<Product[]>`
    SELECT id, name, description, price, category
    FROM products
    WHERE id = ${productId}
    LIMIT 1
  `;
  const product = products[0];
  if (!product) notFound();

  const related = await sql<Product[]>`
    SELECT id, name, description, price, category
    FROM products
    WHERE category = ${product.category} AND id <> ${product.id}
    ORDER BY name ASC
    LIMIT 3
  `;

  return (
    <AppShell
      title={product.name}
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            Products
          </Link>
          <span className="text-slate-400">/</span>
          <Link
            href={`/categories/${encodeURIComponent(product.category)}`}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/60"
          >
            <Tag className="h-4 w-4" />
            {product.category}
          </Link>
        </span>
      }
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-slate-100 to-white shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No image
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Product photos are not configured for this demo.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Price
                </div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {formatCurrencyUSD(product.price)}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-700 dark:border-slate-900 dark:text-slate-200">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Related in {product.category}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                A few more items from the same category.
              </p>
            </div>
            <Link
              href={`/categories/${encodeURIComponent(product.category)}`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              View category
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

