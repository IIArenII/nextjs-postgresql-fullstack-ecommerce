"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Sync with URL params
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/products");
    }
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="relative flex items-center w-full max-w-[40px] sm:max-w-[200px] md:max-w-sm transition-all duration-300 group"
    >
      <button 
        type="submit" 
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-blue-500 transition-colors"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-10 pr-4 text-sm outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white placeholder:text-transparent sm:placeholder:text-slate-400 focus:placeholder:text-slate-400 transition-all cursor-pointer focus:cursor-text"
      />
    </form>
  );
}
