"use server";

import { sql } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-me",
);

export async function handleAuth(formData: FormData) {
  const type = formData.get("type");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  let userId: string;
  let role: "Buyer" | "Seller" = "Buyer";

  if (type === "register") {
    const hash = await bcrypt.hash(password, 10);
    role = formData.get("role") === "seller" ? "Seller" : "Buyer";
    // UUID is generated automatically by 'gen_random_uuid()' in your SQL schema
    const [newUser] = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${hash}, ${name}, ${role})
      RETURNING id
    `;
    userId = newUser.id;
  } else {
    const [user] =
      await sql`SELECT id, password_hash, role FROM users WHERE email = ${email}`;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error("Invalid email or password");
    }
    userId = user.id;
    role = user.role as "Buyer" | "Seller";
  }

  // Create JWT Session with the UUID
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  // Set as HttpOnly cookie for security
  const cookieStore = await cookies(); // Add 'await' here
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  return { success: true, role };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return { success: true };
}
