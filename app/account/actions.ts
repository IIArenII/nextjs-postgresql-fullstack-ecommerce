"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function updateAccount(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const name = (formData.get("name") as string).trim();
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!name) throw new Error("Name is required");

  // 1. Fetch current user
  const [user] = await sql`SELECT password_hash FROM users WHERE id = ${session.userId}`;
  if (!user) throw new Error("User not found");

  // 2. If trying to change password, verify current password
  let newHash = user.password_hash;
  if (newPassword) {
    if (!currentPassword) throw new Error("Current password is required to set a new one");
    
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) throw new Error("Current password is incorrect");

    if (newPassword.length < 6) throw new Error("New password must be at least 6 characters");
    newHash = await bcrypt.hash(newPassword, 10);
  }

  // 3. Update database
  await sql`
    UPDATE users
    SET name = ${name}, password_hash = ${newHash}
    WHERE id = ${session.userId}
  `;

  revalidatePath("/account");
  return { success: true };
}
