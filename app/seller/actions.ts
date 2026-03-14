"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function addProduct(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  const name = (formData.get("name") as string).trim();
  const price = parseFloat(formData.get("price") as string);
  const stock_num = parseInt(formData.get("stock_num") as string, 10);
  const description = (formData.get("description") as string).trim();
  const category = (formData.get("category") as string).trim();
  const discount_percent = parseInt(formData.get("discount_percent") as string, 10) || 0;

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

  await sql`
    INSERT INTO products (name, price, stock_num, description, category, seller_id, discount_percent)
    VALUES (${name}, ${price}, ${stock_num}, ${description}, ${category}, ${session.userId}, ${discount_percent})
  `;

  redirect("/seller");
}

export async function updateStock(formData: FormData) {
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

  await sql`
    UPDATE products
    SET name = ${name}, price = ${price}, description = ${description}, category = ${category}, discount_percent = ${discount_percent}
    WHERE id = ${productId} AND seller_id = ${session.userId}
  `;

  revalidatePath("/seller");
}
