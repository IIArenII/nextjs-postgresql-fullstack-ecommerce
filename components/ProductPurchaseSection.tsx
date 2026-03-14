"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, CheckCircle2 } from "lucide-react";
import { formatCurrencyUSD } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { AuthModal } from "./AuthModal";
import { useRouter } from "next/navigation";

export function ProductPurchaseSection({
  product,
  isAuthenticated,
}: {
  product: {
    id: number;
    name: string;
    price: number;
    stock_num: number;
  };
  isAuthenticated: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToBag = () => {
    // We don't necessarily need authentication just to add to the bag,
    // but the user might want it. Let's keep it simple: anyone can add to bag.
    // If you want auth for adding to bag, uncomment the block below.
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }


    addToCart(product, quantity);
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 3000);
  };

  const increment = () => {
    if (quantity < product.stock_num) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Price
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-end gap-3">
            {formatCurrencyUSD(product.price)}
            <span className="text-sm font-medium pb-1">
              {product.stock_num > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">({product.stock_num} in stock)</span>
              ) : (
                <span className="text-red-500 font-bold dark:text-red-400">Sold Out</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {product.stock_num > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <button
                onClick={decrement}
                disabled={quantity <= 1}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-slate-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={increment}
                disabled={quantity >= product.stock_num}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToBag}
            disabled={addedToBag}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-md transition-all sm:w-auto ${
              addedToBag
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-500/50"
            } active:scale-[0.98] disabled:opacity-100`}
          >
            {addedToBag ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Added to Bag!
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                Add to Bag
              </>
            )}
          </button>
        </div>
      )}

      {product.stock_num === 0 && (
        <button disabled className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 px-6 py-4 text-base font-semibold text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800">
          Out of Stock
        </button>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          router.refresh();
        }}
      />
    </div>
  );
}
