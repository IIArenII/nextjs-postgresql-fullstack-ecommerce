import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCurrencyUSD } from "@/lib/format";

export function ProductCard({
  product,
}: {
  product: {
    id: number;
    name: string;
    description: string;
    price: unknown;
    category: string;
    stock_num?: number;
    discount_percent?: number;
  };
}) {
  const originalPrice = Number(product.price);
  const discountPercent = product.discount_percent || 0;
  const discountedPrice = discountPercent > 0 
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
          {discountPercent}% OFF
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${product.id}`}
            className="text-base font-semibold leading-snug tracking-tight text-slate-900 hover:text-blue-600 dark:text-slate-50 dark:hover:text-blue-400"
          >
            {product.name}
          </Link>
          <span className="inline-flex shrink-0 items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            {product.category}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {product.description}
        </p>

        {product.stock_num !== undefined && (
          <p className="mt-2 text-xs font-medium">
            {product.stock_num > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                {product.stock_num} in stock
              </span>
            ) : (
              <span className="text-red-500 font-bold dark:text-red-400">
                Out of stock
              </span>
            )}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-900">
          <div className="flex flex-col">
            {discountPercent > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrencyUSD(originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrencyUSD(discountedPrice)}
            </span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Details{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-blue-500/8 to-transparent opacity-0 transition group-hover:opacity-100 dark:from-blue-400/10" />
    </div>
  );
}
