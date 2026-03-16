"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-me",
);

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

export async function changeRole(newRole: "Buyer" | "Seller") {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  if (newRole !== "Buyer" && newRole !== "Seller") {
    throw new Error("Invalid role");
  }

  // 1. Update the database
  await sql`
    UPDATE users SET role = ${newRole} WHERE id = ${session.userId}
  `;

  // 2. Reissue the JWT cookie with the new role
  // This is critical — without this the app still reads the old role until re-login
  const token = await new SignJWT({ userId: session.userId, role: newRole })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  revalidatePath("/account");
  return { success: true };
}
