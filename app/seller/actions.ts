"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "Seller") redirect("/auth");

  const name = (formData.get("name") as string).trim();
  const price = parseFloat(formData.get("price") as string);
  const description = (formData.get("description") as string).trim();
  const category = (formData.get("category") as string).trim();

  if (
    !name ||
    !description ||
    !category ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    throw new Error("All fields are required and price must be a valid number.");
  }

  await sql`
    INSERT INTO products (name, price, description, category, seller_id)
    VALUES (${name}, ${price}, ${description}, ${category}, ${session.userId})
  `;

  redirect("/seller");
}
