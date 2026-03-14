import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AccountForm } from "@/components/AccountForm";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/auth");

  const [user] = await sql`
    SELECT id, name, email, role 
    FROM users 
    WHERE id = ${session.userId}
  `;

  if (!user) redirect("/auth");

  return (
    <AppShell 
      title="Account Settings" 
      subtitle="Manage your personal information and security settings."
    >
      <div className="max-w-xl">
        <AccountForm user={user} />
      </div>
    </AppShell>
  );
}
