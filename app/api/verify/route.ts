import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    // Check if token exists and is not expired
    const [verificationToken] = await sql`
      SELECT identifier, expires 
      FROM verification_tokens 
      WHERE token = ${token}
    `;

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Update user to verified
    await sql`
      UPDATE users
      SET email_verified = TRUE
      WHERE email = ${verificationToken.identifier}
    `;

    // Delete token so it can't be used again
    await sql`
      DELETE FROM verification_tokens
      WHERE identifier = ${verificationToken.identifier}
    `;

    // Redirect to auth page with success message
    // In Next.js App Router we can use redirect, or just return an HTML response that redirect visually
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.search = "?verified=true";

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
