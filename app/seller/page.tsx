import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { addProduct, updateStock } from "./actions";
import { formatCurrencyUSD } from "@/lib/format";
import { StatusSelect } from "@/components/StatusSelect";
import { ProductListing } from "@/components/ProductListing";

export default async function SellerPage() {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  const listings = await sql<{
    id: number;
    name: string;
    description: string;
    price: unknown;
    category: string;
    stock_num: number;
    discount_percent: number;
  }[]>`
    SELECT id, name, description, price, category, stock_num, discount_percent
    FROM products
    WHERE seller_id = ${session.userId}
    ORDER BY id DESC
  `;

  const categories = await sql<{ category: string }[]>`
    SELECT DISTINCT category FROM products WHERE seller_id = ${session.userId} ORDER BY category ASC
  `;

  const PRODUCT_CATEGORIES = [
    "Books",
    "Clothing & Apparel",
    "Electronics",
    "Food & Beverages",
    "Gaming",
    "Health & Beauty",
    "Home & Garden",
    "Jewelry",
    "Music & Instruments",
    "Office Supplies",
    "Pets",
    "Sports & Outdoors",
    "Toys & Games",
    "Vehicles & Parts",
    "Other",
  ];

  const orders = await sql<{
    id: string;
    product_name: string;
    product_id: number;
    status: string;
    total_price: number;
    created_at: Date;
    buyer_name: string;
    buyer_email: string;
  }[]>`
    SELECT 
      o.id,
      p.name as product_name,
      p.id as product_id,
      o.status,
      o.total_price,
      o.created_at,
      u.name as buyer_name,
      u.email as buyer_email
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN users u ON o.buyer_id = u.id
    WHERE p.seller_id = ${session.userId}
    ORDER BY o.created_at DESC
  `;

  return (
    <AppShell
      title="Seller Dashboard"
      subtitle="Manage your listings and fulfill customer orders."
    >
      {/* Customer Orders */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Customer Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            You don't have any orders yet. Keep listing great products!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {order.product_name}
                      <div className="text-xs font-normal text-slate-400">ID: {order.product_id}</div>
                    </td>
                    <td className="p-4">
                      {order.buyer_name}
                      <div className="text-xs text-slate-400">{order.buyer_email}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {formatCurrencyUSD(order.total_price)}
                    </td>
                    <td className="p-4">
                      <StatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* My Listings */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          My Listings
        </h2>
        {listings.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            You have not listed any products yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((product) => (
              <ProductListing 
                key={product.id} 
                product={product} 
                categories={PRODUCT_CATEGORIES} 
              />
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
          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="Price (e.g. 29.99)"
              required
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              name="stock_num"
              type="number"
              step="1"
              min="0"
              placeholder="Stock"
              required
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              name="discount_percent"
              type="number"
              step="1"
              min="0"
              max="100"
              placeholder="Discount %"
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            required
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue=""
              className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 bg-white cursor-pointer"
            >
              <option value="" disabled>Select a category...</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
