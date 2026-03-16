"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/auth/actions";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      title="Log out"
      onClick={() => {
        startTransition(async () => {
          await logout();
          router.push("/auth");
        });
      }}
      className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white disabled:opacity-60"
      disabled={isPending}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">
        {isPending ? "Logging out..." : "Log out"}
      </span>
    </button>
  );
}

