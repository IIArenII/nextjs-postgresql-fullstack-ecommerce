"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: number, pathname: string) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  // Check if it's already favorited
  const [existing] = await sql`
    SELECT 1 FROM favorite_products WHERE user_id = ${session.userId} AND product_id = ${productId}
  `;

  if (existing) {
    await sql`
      DELETE FROM favorite_products WHERE user_id = ${session.userId} AND product_id = ${productId}
    `;
  } else {
    await sql`
      INSERT INTO favorite_products (user_id, product_id) VALUES (${session.userId}, ${productId})
    `;
  }

  revalidatePath(pathname);
  revalidatePath("/account/favorites");
  revalidatePath("/products");
  return { success: true, favorited: !existing };
}
