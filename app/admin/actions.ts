"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendProductStatusEmail } from "@/lib/email";

export async function updateProductStatus(productId: number, status: 'approved' | 'rejected' | 'pending') {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    throw new Error("Unauthorized");
  }

  // Get product name and seller email before update
  const [data] = await sql`
    SELECT p.name, u.email 
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = ${productId}
  `;

  await sql`
    UPDATE products
    SET status = ${status}
    WHERE id = ${productId}
  `;

  // Send notification if it's an approval or rejection
  if (data?.email && (status === 'approved' || status === 'rejected')) {
    await sendProductStatusEmail(data.email, data.name, status);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProductAdmin(productId: number) {
    const session = await getSession();
    if (!session || session.role !== "Admin") {
      throw new Error("Unauthorized");
    }
  
    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `;
  
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/products");
  }
