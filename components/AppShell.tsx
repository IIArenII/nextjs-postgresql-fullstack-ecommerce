import Link from "next/link";
import { UserCircle } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { ThemeToggle } from "./ThemeToggle";
import { getSession } from "@/lib/auth";
import { BagButton } from "./BagButton";
import { SearchInput } from "./SearchInput";
import { ClientAnimationWrapper } from "./ClientAnimationWrapper";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";

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

  const navLinks = [
    { href: "/categories", label: "Categories" },
    { href: "/products", label: "Products" },
    { href: "/account/favorites", label: "Favorites" },
    ...(session?.role === "Admin" ? [{ href: "/admin", label: "Moderation" }] : []),
    { href: "/seller", label: "Sell" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 dark:bg-slate-950/80 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center h-16 sm:h-20 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center mr-6 lg:mr-10 shrink-0">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              Storefront
            </span>
          </Link>

          {/* Desktop Nav (lg+) only */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavLinks links={navLinks} />
          </nav>

          {/* Right Section */}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            {/* Search — desktop only */}
            <div className="hidden lg:block">
              <SearchInput />
            </div>

            <ThemeToggle />

            {/* Account icon */}
            <Link
              href={session ? "/account" : "/auth"}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Account"
            >
              <UserCircle className="h-6 w-6" />
            </Link>

            {/* Bag — buyers only */}
            {(!session || session.role === "Buyer") && (
              <div className="relative">
                <BagButton />
              </div>
            )}

            {/* Logout — desktop only */}
            {session && (
              <div className="hidden lg:block">
                <LogoutButton />
              </div>
            )}

            {/* Hamburger — everything below desktop (< lg) */}
            <div className="lg:hidden">
              <MobileMenu
                links={navLinks}
                isLoggedIn={!!session}
                isBuyer={!session || session.role === "Buyer"}
              />
            </div>
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

      <main className={`mx-auto max-w-6xl px-4 pb-16 sm:px-6 ${!(title || subtitle) ? "pt-4" : "pt-8"}`}>
        <ClientAnimationWrapper>
          {children}
        </ClientAnimationWrapper>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 py-10 text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/50 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Storefront. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/categories" className="hover:text-slate-900 dark:hover:text-white">Browse categories</Link>
            <Link href="/products" className="hover:text-slate-900 dark:hover:text-white">View all products</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
