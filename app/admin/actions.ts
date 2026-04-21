"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProductStatus(productId: number, status: 'approved' | 'rejected' | 'pending') {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    throw new Error("Unauthorized");
  }

  await sql`
    UPDATE products
    SET status = ${status}
    WHERE id = ${productId}
  `;

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
