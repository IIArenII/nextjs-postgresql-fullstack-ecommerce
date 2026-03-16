import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/db";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-me",
);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth?error=no_code`);
  }

  const supabase = await createClient();

  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${origin}/auth?error=oauth_failed`);
  }

  const { user } = data;
  const email = user.email!;
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.user_name ||
    email.split("@")[0];

  // Upsert user in our custom public.users table
  // If they already exist (e.g., registered normally), just fetch them
  // If they're new, create them as a Buyer, auto-verified
  const [existingUser] = await sql`
    SELECT id, role FROM users WHERE email = ${email}
  `;

  let userId: string;
  let role: "Buyer" | "Seller";

  if (existingUser) {
    userId = existingUser.id;
    role = existingUser.role as "Buyer" | "Seller";
  } else {
    const [newUser] = await sql`
      INSERT INTO users (email, name, password_hash, role, email_verified)
      VALUES (${email}, ${name}, 'oauth-no-password', 'Buyer', TRUE)
      RETURNING id, role
    `;
    userId = newUser.id;
    role = "Buyer";
  }

  // Issue our standard JWT cookie so the rest of the app works unchanged
  const token = await new SignJWT({ userId, role })
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

  return NextResponse.redirect(`${origin}/`);
}
