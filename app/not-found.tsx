import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell
      title="Page not found"
      subtitle="That page doesn’t exist (or the product/category was removed)."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <div className="text-sm">Try one of these:</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Categories
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
          >
            Products
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

