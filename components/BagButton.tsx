"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BagButton() {
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        <ShoppingBag className="h-5 w-5" />
      </div>
    );
  }

  return (
    <Link
      href="/bag"
      aria-label="Shopping bag"
      className="group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white transition-colors"
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span 
              key="counter"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white group-hover:bg-blue-700"
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="hidden sm:inline">Bag</span>
    </Link>
  );
}
