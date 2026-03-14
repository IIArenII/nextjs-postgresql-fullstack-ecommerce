"use server";

import { sql } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

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
    // Check if the user already exists to provide a friendly error message
    const [existingUser] = await sql`SELECT id, email_verified FROM users WHERE email = ${email}`;
    
    const token = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    if (existingUser) {
      if (!existingUser.email_verified) {
        // Unverified user trying to register again - resend the code
        await sql`DELETE FROM verification_tokens WHERE identifier = ${email}`;
        await sql`
          INSERT INTO verification_tokens (identifier, token, expires)
          VALUES (${email}, ${token}, ${expires})
        `;
        await sendVerificationEmail(email, token);
        return { success: true, requiresVerification: true, email };
      }
      throw new Error("Email already in use");
    }

    const hash = await bcrypt.hash(password, 10);
    role = formData.get("role") === "seller" ? "Seller" : "Buyer";

    await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${hash}, ${name}, ${role})
    `;

    await sql`
      INSERT INTO verification_tokens (identifier, token, expires)
      VALUES (${email}, ${token}, ${expires})
    `;

    // Send the email
    await sendVerificationEmail(email, token);

    return { success: true, requiresVerification: true, email };
  } else {
    const [user] =
      await sql`SELECT id, password_hash, role, email_verified FROM users WHERE email = ${email}`;

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error("Invalid email or password");
    }

    if (!user.email_verified) {
      throw new Error("Please check your email to verify your account before logging in.");
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

export async function verifyEmailCode(email: string, code: string) {
  // Check if token exists and is not expired
  const [verificationToken] = await sql`
    SELECT identifier, expires 
    FROM verification_tokens 
    WHERE identifier = ${email} AND token = ${code}
  `;

  if (!verificationToken) {
    throw new Error("Invalid verification code.");
  }

  if (new Date(verificationToken.expires) < new Date()) {
    throw new Error("Verification code has expired.");
  }

  // Update user to verified
  await sql`
    UPDATE users
    SET email_verified = TRUE
    WHERE email = ${email}
  `;

  // Delete token
  await sql`
    DELETE FROM verification_tokens
    WHERE identifier = ${email}
  `;

  return { success: true };
}
