import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-me",
);

export type SessionPayload = { userId: string; role: "Buyer" | "Seller" | "Admin" };

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const { userId, role } = payload as { userId: string; role: string };
    if (!userId || (role !== "Buyer" && role !== "Seller" && role !== "Admin")) return null;
    return { userId, role: role as "Buyer" | "Seller" | "Admin" };
  } catch {
    return null;
  }
}
