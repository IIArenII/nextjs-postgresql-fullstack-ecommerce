import Link from "next/link";
import { ShoppingBag, Store, Tag, UserCircle } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { ThemeToggle } from "./ThemeToggle";
import { getSession } from "@/lib/auth";
import { BagButton } from "./BagButton";

export async function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold tracking-tight hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">
              Storefront<span className="text-blue-600">.</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <Tag className="h-4 w-4" />
              Categories
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              Products
            </Link>
            {session?.role === "Buyer" && (
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                My Orders
              </Link>
            )}
            {session?.role === "Seller" && (
              <Link
                href="/seller"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <Store className="h-4 w-4" />
                Sell
              </Link>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {(!session || session.role === "Buyer") && <BagButton />}
            <ThemeToggle />
            {session ? (
              <Link
                href="/account"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <UserCircle className="h-5 w-5 text-blue-600" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Account</span>
              </Link>
            )}
            {session && <LogoutButton />}
          </div>
        </div>
      </header>

      {(title || subtitle) && (
        <div className="mx-auto max-w-6xl px-4 pb-2 pt-10 sm:px-6">
          {title && (
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-3 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 py-10 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/50 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Storefront demo with Next.js + Postgres.</p>
          <div className="flex gap-4">
            <Link href="/categories" className="hover:text-slate-900 dark:hover:text-white">
              Browse categories
            </Link>
            <Link href="/products" className="hover:text-slate-900 dark:hover:text-white">
              View all products
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

