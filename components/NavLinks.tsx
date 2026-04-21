"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

export function NavLinks({
  links,
}: {
  links: NavLink[];
}) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative text-sm font-medium transition-colors pb-0.5 ${
              isActive
                ? "text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {link.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
            )}
          </Link>
        );
      })}
    </>
  );
}
