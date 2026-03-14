"use client";

import { useCart } from "@/lib/cart-context";
import { formatCurrencyUSD } from "@/lib/format";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { checkoutCart } from "@/app/orders/actions";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/AuthModal";

export function BagClient() {
  const { items, removeFromCart, updateQuantity, totalPrice, itemCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setError(null);
    setIsCheckingOut(true);

    const cartItems = items.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity
    }));

    try {
      const result = await checkoutCart(cartItems);
      
      if (result.success) {
        setShowSuccess(true);
        clearCart();
        setTimeout(() => {
          router.push("/orders");
        }, 3000);
      } else {
        if (result.error === "UNAUTHENTICATED") {
           setShowAuthModal(true);
        } else {
           setError(result.error || "Failed to process checkout.");
        }
      }
    } catch (e: any) {
      console.error(e);
      setError("An unexpected error occurred.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Thank you for shopping!
        </h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Your payment has been received successfully.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/orders"
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Track My Orders
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 overflow-hidden">
        <h1 className="text-3xl font-bold tracking-tight">Your Shopping Bag</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-900">
            <ShoppingBag className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Your bag is empty</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="h-24 w-24 flex-shrink-0 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium overflow-hidden border border-slate-100 dark:border-slate-800">
                  No image
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <Link href={`/products/${item.id}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {formatCurrencyUSD(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrencyUSD(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Free</span>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-900 flex justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrencyUSD(totalPrice)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className="mt-8 w-full rounded-xl bg-blue-600 py-4 text-base font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isCheckingOut ? "Processing..." : "Confirm & Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          router.refresh();
          handleCheckout();
        }}
      />
    </>
  );
}
