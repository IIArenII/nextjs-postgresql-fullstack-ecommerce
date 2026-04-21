"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingBag, ChevronRight } from "lucide-react";

type NavLink = { href: string; label: string };

export function MobileMenu({
  links,
  isLoggedIn,
  isBuyer,
}: {
  links: NavLink[];
  isLoggedIn: boolean;
  isBuyer: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Mount for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 z-[1000] h-dvh w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-xl font-black tracking-tighter text-slate-900 dark:text-white"
          >
            Storefront
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Navigation Section */}
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Navigation
          </p>
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl mb-1 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.label}
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 opacity-30 shrink-0" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

          {/* Account Section */}
          <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Account
          </p>
          {isLoggedIn ? (
            <Link
              href="/account"
              className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl mb-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              Account Settings
              <ChevronRight className="h-4 w-4 opacity-30 shrink-0" />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl mb-1 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
            >
              Sign In / Register
            </Link>
          )}

          {/* Search */}
          <div className="mt-5">
            <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Search
            </p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      window.location.href = `/products?q=${encodeURIComponent(val)}`;
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          {isBuyer && (
            <Link
              href="/bag"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              View Bag
            </Link>
          )}
          <p className="text-[10px] text-slate-400 ml-auto">
            © {new Date().getFullYear()} Storefront
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Render drawer via portal so it escapes all parent stacking contexts */}
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
