"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/favorites/actions";
import { usePathname } from "next/navigation";

export function FavoriteButton({ 
  productId, 
  isFavorited = false,
  className = "",
  size = 20
}: { 
  productId: number; 
  isFavorited?: boolean;
  className?: string;
  size?: number;
}) {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(() => {
          toggleFavorite(productId, pathname);
        });
      }}
      disabled={isPending}
      className={`relative inline-flex items-center justify-center rounded-full bg-white/50 p-2 shadow-sm backdrop-blur-md transition hover:scale-110 hover:bg-white disabled:opacity-50 dark:bg-slate-900/50 dark:hover:bg-slate-900 ${className}`}
    >
      <Heart 
        size={size} 
        className={`transition ${isFavorited ? "fill-red-500 text-red-500" : "text-slate-400 group-hover:text-red-400"}`} 
      />
    </button>
  );
}
