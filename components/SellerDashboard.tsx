"use client";

import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, PlusCircle, Store } from "lucide-react";
import { AddProductForm } from "./AddProductForm";
import { ProductListing } from "./ProductListing";
import { StatusSelect } from "./StatusSelect";
import { formatCurrencyUSD } from "@/lib/format";
import Link from "next/link";

type TabType = "overview" | "listings" | "orders" | "add";

interface Props {
  listings: any[];
  orders: any[];
  categories: string[];
  isSeller: boolean;
}

export function SellerDashboard({ listings, orders, categories, isSeller }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (!isSeller) {
    return (
      <div className="mb-10 rounded-2xl border border-blue-200 bg-blue-50 p-8 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">You&apos;re browsing as a Buyer</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              This is the Seller Dashboard. To list products and manage orders, you need to switch your account role to <strong>Seller</strong>.
            </p>
          </div>
          <Link
            href="/account"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:-translate-y-0.5"
          >
            Go to Account Settings → Switch to Seller
          </Link>
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const recentListings = listings.slice(0, 6);

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "listings", label: "My Listings", icon: Package, count: listings.length },
    { id: "orders", label: "Orders", icon: ShoppingCart, count: orders.length },
    { id: "add", label: "Add Product", icon: PlusCircle },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl dark:bg-slate-900/50 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400" 
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Sales</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrencyUSD(orders.reduce((acc, curr) => acc + Number(curr.total_price), 0))}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
                    <p className="text-2xl font-bold mt-1">{orders.length}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-slate-950 dark:border-slate-800 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Listings</p>
                    <p className="text-2xl font-bold mt-1">{listings.length}</p>
                </div>
            </div>

            {/* Quick Actions / Recent Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Orders */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Recent Orders</h2>
                        <button onClick={() => setActiveTab("orders")} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">View All</button>
                    </div>
                    {orders.length === 0 ? (
                        <p className="text-sm text-slate-500">No orders yet.</p>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 border rounded-2xl overflow-hidden bg-white dark:bg-slate-950 dark:border-slate-800">
                            {recentOrders.map(order => (
                                <div key={order.id} className="p-4 flex items-center justify-between text-sm">
                                    <div>
                                        <p className="font-bold">{order.product_name}</p>
                                        <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-bold">{formatCurrencyUSD(order.total_price)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Listings */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Recent Listings</h2>
                        <button onClick={() => setActiveTab("listings")} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">View All</button>
                    </div>
                    {listings.length === 0 ? (
                        <p className="text-sm text-slate-500">No listings yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {recentListings.map(product => (
                                <div key={product.id} className="p-3 border rounded-xl bg-white dark:bg-slate-950 dark:border-slate-800 flex items-center gap-3">
                                    {product.image_url && <img src={product.image_url} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                                    <div className="min-w-0">
                                        <p className="font-bold truncate text-xs">{product.name}</p>
                                        <p className="text-[10px] text-slate-500">Stock: {product.stock_num}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
            
            {/* Quick Add Button */}
            <div className="p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <PlusCircle className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Ready to sell more?</h3>
                    <p className="text-sm text-slate-500 max-w-xs">List a new product to expand your inventory and reach more customers.</p>
                </div>
                <button 
                  onClick={() => setActiveTab("add")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                >
                    Create New Listing
                </button>
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <section>
            <h2 className="text-xl font-bold mb-6">Manage Your Inventory</h2>
            {listings.length === 0 ? (
              <p className="text-slate-500 text-sm">You have not listed any products yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((product) => (
                  <ProductListing 
                    key={product.id} 
                    product={product} 
                    categories={categories} 
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "orders" && (
          <section>
            <h2 className="text-xl font-bold mb-6">Customer Orders</h2>
            {orders.length === 0 ? (
              <p className="text-slate-500 text-sm">You don't have any orders yet.</p>
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
        )}

        {activeTab === "add" && (
          <section>
            <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-2xl font-bold">List a New Product</h2>
                <p className="text-slate-500 text-sm">Fill in the details below to create your new listing.</p>
            </div>
            <AddProductForm categories={categories} />
          </section>
        )}
      </div>
    </div>
  );
}
