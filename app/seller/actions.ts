"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendProductPendingEmail } from "@/lib/email";

export async function addProduct(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  // --- Rate Limiting (10 products per hour) ---
  const [countResult] = await sql`
    SELECT COUNT(*) as count 
    FROM products 
    WHERE seller_id = ${session.userId} 
    AND created_at > NOW() - INTERVAL '1 hour'
  `;
  
  if (parseInt(countResult.count, 10) >= 10) {
    throw new Error("Security Alert: You have reached the limit of 10 new listings per hour. This is to prevent spam. Please try again later.");
  }

  const name = (formData.get("name") as string).trim();
  const price = parseFloat(formData.get("price") as string);
  const stock_num = parseInt(formData.get("stock_num") as string, 10);
  const description = (formData.get("description") as string).trim();
  const category = (formData.get("category") as string).trim();
  const discount_percent = parseInt(formData.get("discount_percent") as string, 10) || 0;
  const image_url = (formData.get("image_url") as string || "").trim();

  if (image_url && !image_url.startsWith("https://")) {
    throw new Error("Only secure image URLs (starting with https://) are allowed. Local files or insecure links are not accepted.");
  }

  if (
    !category ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock_num) ||
    stock_num < 0 ||
    !Number.isInteger(discount_percent) ||
    discount_percent < 0 ||
    discount_percent > 100
  ) {
    throw new Error("All fields are required. Price, Stock, and Discount (0-100) must be valid.");
  }

  // All new products start as 'pending' for manual approval
  await sql`
    INSERT INTO products (name, price, stock_num, description, category, seller_id, discount_percent, image_url, status)
    VALUES (${name}, ${price}, ${stock_num}, ${description}, ${category}, ${session.userId}, ${discount_percent}, ${image_url}, 'pending')
  `;

  // Send email notification to seller
  const [user] = await sql`SELECT email FROM users WHERE id = ${session.userId}`;
  if (user?.email) {
    await sendProductPendingEmail(user.email, name);
  }

  revalidatePath("/seller");
  return { success: true };
}

export async function updateStock(formData: FormData) {
// ... updateStock implementation stays the same ...
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  const productId = parseInt(formData.get("productId") as string, 10);
  const stock_num = parseInt(formData.get("stock_num") as string, 10);

  if (!Number.isInteger(productId) || !Number.isInteger(stock_num) || stock_num < 0) {
    throw new Error("Invalid product ID or stock amount.");
  }

  // Ensure this product actually belongs to the user
  await sql`
    UPDATE products
    SET stock_num = ${stock_num}
    WHERE id = ${productId} AND seller_id = ${session.userId}
  `;

  revalidatePath("/seller");
}

export async function updateProduct(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  const productId = parseInt(formData.get("productId") as string, 10);
  const name = (formData.get("name") as string).trim();
  const price = parseFloat(formData.get("price") as string);
  const description = (formData.get("description") as string).trim();
  const category = (formData.get("category") as string).trim();
  const discount_percent = parseInt(formData.get("discount_percent") as string, 10) || 0;
  const image_url = (formData.get("image_url") as string || "").trim();

  if (image_url && !image_url.startsWith("https://")) {
    throw new Error("Only secure image URLs (starting with https://) are allowed.");
  }

  if (
    !description ||
    !category ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(discount_percent) ||
    discount_percent < 0 ||
    discount_percent > 100
  ) {
    throw new Error("All fields are required and must be valid.");
  }

  // Reset status to 'pending' when a product is updated so admin can re-verify it
  await sql`
    UPDATE products
    SET name = ${name}, price = ${price}, description = ${description}, category = ${category}, discount_percent = ${discount_percent}, image_url = ${image_url}, status = 'pending'
    WHERE id = ${productId} AND seller_id = ${session.userId}
  `;

  // Send email notification to seller
  const [user] = await sql`SELECT email FROM users WHERE id = ${session.userId}`;
  if (user?.email) {
    await sendProductPendingEmail(user.email, name);
  }

  revalidatePath("/seller");
  return { success: true };
}
