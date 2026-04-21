import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { SellerDashboard } from "@/components/SellerDashboard";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Manage your listings and fulfill customer orders at Storefront.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SellerPage() {
  const session = await getSession();
  if (!session) redirect("/auth");

  const isSeller = session.role === "Seller";

  const listings = isSeller ? await sql<{
    id: number;
    name: string;
    description: string;
    price: unknown;
    category: string;
    stock_num: number;
    discount_percent: number;
    image_url: string;
    status: string;
  }[]>`
    SELECT id, name, description, price, category, stock_num, discount_percent, image_url, status
    FROM products
    WHERE seller_id = ${session.userId}
    ORDER BY id DESC
  ` : [];

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

  const orders = isSeller ? await sql<{
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
  ` : [];

  return (
    <AppShell
      title="Seller Dashboard"
      subtitle={isSeller ? "Manage your listings and fulfill customer orders." : "Want to start selling? Switch your role in account settings."}
    >
      <SellerDashboard 
        listings={listings} 
        orders={orders} 
        categories={PRODUCT_CATEGORIES} 
        isSeller={isSeller} 
      />
    </AppShell>
  );
}
