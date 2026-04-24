"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCurrencyUSD } from "@/lib/format";
import { FavoriteButton } from "./FavoriteButton";
import { motion } from "framer-motion";

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
    is_favorited?: boolean;
    image_url?: string;
  };
}) {
  const originalPrice = Number(product.price);
  const discountPercent = product.discount_percent || 0;
  const discountedPrice = discountPercent > 0 
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
    >
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
          {discountPercent}% OFF
        </div>
      )}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300 dark:text-slate-700">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/5" />
      </Link>
      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <Link
            href={`/products/${product.id}`}
            className="text-xs sm:text-base font-bold leading-tight sm:leading-snug tracking-tight text-slate-900 hover:text-blue-600 dark:text-slate-50 dark:hover:text-blue-400 line-clamp-1 sm:line-clamp-2"
          >
            {product.name}
          </Link>
          <div className="shrink-0 -mr-1 sm:-mr-2">
            <FavoriteButton productId={product.id} isFavorited={product.is_favorited} />
          </div>
        </div>

        <p className="mt-1.5 hidden sm:line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {product.description}
        </p>

        {product.stock_num !== undefined && (
          <p className="mt-1.5 text-[10px] sm:text-xs font-semibold">
            {product.stock_num > 0 ? (
              <span className="text-emerald-500 dark:text-emerald-400">
                {product.stock_num} IN STOCK
              </span>
            ) : (
              <span className="text-rose-500 dark:text-rose-400">
                OUT OF STOCK
              </span>
            )}
          </p>
        )}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-50 pt-3 dark:border-slate-900">
          <div className="flex flex-col">
            {discountPercent > 0 && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatCurrencyUSD(originalPrice)}
              </span>
            )}
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              {formatCurrencyUSD(discountedPrice)}
            </span>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-[10px] sm:text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            DETAILS{" "}
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-blue-500/8 to-transparent opacity-0 transition group-hover:opacity-100 dark:from-blue-400/10" />
    </motion.div>
  );
}
