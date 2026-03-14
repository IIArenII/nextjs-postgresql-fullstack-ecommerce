"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendOrderNotificationToSeller } from "@/lib/email";

export async function checkoutCart(items: { id: number; price: number; quantity: number }[]) {
  const session = await getSession();
  if (!session || session.role !== "Buyer") {
    return { success: false, error: "UNAUTHENTICATED" };
  }

  if (items.length === 0) throw new Error("Cart is empty");

  // Fetch buyer info
  const [buyer] = await sql`SELECT name, email FROM users WHERE id = ${session.userId}`;

  try {
    const notifications: any[] = [];

    await (sql as any).begin(async (t: any) => {
      for (const item of items) {
        // 1. Check stock and decrement atomically, returning the name and updated stock
        const result = await t`
          UPDATE products
          SET stock_num = stock_num - ${item.quantity}
          WHERE id = ${item.id} AND stock_num >= ${item.quantity}
          RETURNING id, name, stock_num, seller_id
        `;

        if (result.count === 0) {
          const [p] = await t`SELECT name FROM products WHERE id = ${item.id}`;
          throw new Error(`NOT_ENOUGH_STOCK:${p?.name || 'Unknown product'}`);
        }

        const product = result[0];

        // 2. Fetch seller email
        const [seller] = await t`SELECT email FROM users WHERE id = ${product.seller_id}`;

        // 3. Create the order record
        await t`
          INSERT INTO orders (buyer_id, product_id, quantity, total_price, status)
          VALUES (${session.userId}, ${item.id}, ${item.quantity}, ${item.price * item.quantity}, 'Pending')
        `;

        // Queue notification info
        notifications.push({
          sellerEmail: seller.email,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          productName: product.name,
          productId: product.id,
          quantity: item.quantity,
          remainingStock: product.stock_num
        });
      }
    });

    // Send emails after successful transaction
    for (const note of notifications) {
      await sendOrderNotificationToSeller(note);
    }

    revalidatePath("/orders");
    revalidatePath("/seller");
    return { success: true };
  } catch (e: any) {
    if (e.message.startsWith("NOT_ENOUGH_STOCK:")) {
      const productName = e.message.split(":")[1];
      return { success: false, error: `Sorry, there isn't enough stock for "${productName}".` };
    }
    console.error("Checkout error:", e);
    return { success: false, error: "Something went wrong during checkout. Please try again." };
  }
}

// Keep createOrder for backward compatibility if needed, but redirects to bag or handles single item
export async function createOrder(productId: number, price: number, quantity: number = 1) {
  const result = await checkoutCart([{ id: productId, price, quantity }]);
  if (result.success) {
    redirect("/orders");
  } else {
    throw new Error(result.error);
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  // Only allow updating if the order belongs to this seller's products
  await sql`
    UPDATE orders 
    SET status = ${newStatus}::order_status, updated_at = NOW()
    WHERE id = ${orderId} AND product_id IN (
      SELECT id FROM products WHERE seller_id = ${session.userId}
    )
  `;

  revalidatePath("/seller");
}
