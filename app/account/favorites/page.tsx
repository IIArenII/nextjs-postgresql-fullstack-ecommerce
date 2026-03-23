import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: unknown;
  category: string;
  discount_percent?: number;
  stock_num?: number;
  is_favorited?: boolean;
}

export default async function FavoritesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth");
  }

  const products = await sql<Product[]>`
    SELECT p.id, p.name, p.description, p.price, p.category, p.discount_percent, p.stock_num, p.image_url,
      TRUE AS is_favorited
    FROM products p
    INNER JOIN favorite_products f ON p.id = f.product_id
    WHERE f.user_id = ${session.userId}::uuid
    ORDER BY f.created_at DESC
  `;

  return (
    <AppShell
      title="Saved Products"
      subtitle="Products you have favorited for later."
    >
      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          <p className="text-lg font-medium">You haven't saved any products yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
