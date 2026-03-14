import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { redirect } from "next/navigation";
import { formatCurrencyUSD } from "@/lib/format";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const session = await getSession();
  
  // If not logged in, go to auth
  if (!session) redirect("/auth");

  // If a seller navigates here, show their seller dashboard instead, or we could support separate views.
  // We'll redirect sellers to /seller mostly, but if they access /orders directly maybe we shouldn't fail.
  if (session.role === "Seller") {
    redirect("/seller");
  }

  const orders = await sql<{
    id: string;
    product_name: string;
    product_id: number;
    status: string;
    total_price: number;
    created_at: Date;
    seller_name: string;
  }[]>`
    SELECT 
      o.id,
      p.name as product_name,
      p.id as product_id,
      o.status,
      o.total_price,
      o.created_at,
      u.name as seller_name
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN users u ON p.seller_id = u.id
    WHERE o.buyer_id = ${session.userId}
    ORDER BY o.created_at DESC
  `;

  return (
    <AppShell title="My Orders" subtitle="Track and manage all your purchases.">
      <div className="flex flex-col gap-6">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-950">
            <Package className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              You haven't purchased anything yet. Time to explore our products!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              // Status Badge coloring
              const statusColors: Record<string, string> = {
                Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900",
                Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-900",
                "In Cargo": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-900",
                Delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-900",
                Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-900",
              };

              const badgeColor = statusColors[order.status] || "bg-slate-100 text-slate-800";

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col sm:flex-row gap-4 justify-between transition-hover hover:border-blue-200 dark:hover:border-blue-900 w-full"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <Link href={`/products/${order.product_id}`} className="text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400">
                        {order.product_name}
                      </Link>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Order ID: <span className="font-mono text-xs">{order.id}</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Seller: {order.seller_name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Purchased on: {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="sm:text-right flex flex-col justify-center">
                    <div className="text-sm text-slate-500 mb-1">Total Amount</div>
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {formatCurrencyUSD(order.total_price)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
