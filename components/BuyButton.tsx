"use client";

import { useTransition, useState } from "react";
import { createOrder } from "@/app/orders/actions";
import { ShoppingBag } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { useRouter } from "next/navigation";

export function BuyButton({
  productId,
  price,
  isAuthenticated,
}: {
  productId: number;
  price: number;
  isAuthenticated: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleBuy = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    startTransition(async () => {
      await createOrder(productId, price);
    });
  };

  return (
    <>
      <button
        onClick={handleBuy}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 sm:w-auto"
      >
        <ShoppingBag className="h-5 w-5" />
        {isPending ? "Purchasing..." : "Buy Now"}
      </button>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Force a full refresh to get the session back to the server components
          router.refresh();
        }}
      />
    </>
  );
}
