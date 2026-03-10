import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { addProduct } from "./actions";

export default async function SellerPage() {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  const listings = await sql<{
    id: number;
    name: string;
    description: string;
    price: unknown;
    category: string;
  }[]>`
    SELECT id, name, description, price, category
    FROM products
    WHERE seller_id = ${session.userId}
    ORDER BY id DESC
  `;

  const categories = await sql<{ category: string }[]>`
    SELECT DISTINCT category FROM products ORDER BY category ASC
  `;

  return (
    <AppShell
      title="Seller Dashboard"
      subtitle="Manage your listings and add new products."
    >
      {/* My Listings */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          My Listings
        </h2>
        {listings.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            You have not listed any products yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Add New Product */}
      <section>
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          List a New Product
        </h2>
        <form
          action={addProduct}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col gap-4 max-w-xl"
        >
          <input
            name="name"
            placeholder="Product name"
            required
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Price (e.g. 29.99)"
            required
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            required
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div>
            <input
              name="category"
              placeholder="Category"
              list="categories"
              required
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <datalist id="categories">
              {categories.map(({ category }) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <button
            type="submit"
            className="bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-black transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            List Product
          </button>
        </form>
      </section>
    </AppShell>
  );
}
