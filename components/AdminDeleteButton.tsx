"use client";

import { Trash2 } from "lucide-react";
import { deleteProductAdmin } from "@/app/admin/actions";

export function AdminDeleteButton({ productId }: { productId: number }) {
  return (
    <form 
      action={async () => {
        if (confirm("Are you sure you want to permanently delete this product?")) {
          await deleteProductAdmin(productId);
        }
      }}
    >
      <button 
        type="submit"
        className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-rose-900/30 dark:hover:text-rose-500 active:scale-95" 
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
