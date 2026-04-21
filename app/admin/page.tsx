import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { updateProductStatus, deleteProductAdmin } from "./actions";
import Link from "next/link";
import { formatCurrencyUSD } from "@/lib/format";
import { AdminDeleteButton } from "@/components/AdminDeleteButton";

type AdminProduct = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  seller_name: string;
  seller_email: string;
  created_at: Date;
};

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session || session.role !== "Admin") {
    redirect("/");
  }

  const products = await sql<AdminProduct[]>`
    SELECT p.id, p.name, p.price, p.category, p.status, p.created_at,
           u.name as seller_name, u.email as seller_email
    FROM products p
    JOIN users u ON p.seller_id = u.id
    ORDER BY 
      CASE WHEN p.status = 'pending' THEN 0 ELSE 1 END,
      p.created_at DESC
  `;

  const stats = {
    pending: products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  return (
    <AppShell 
      title="Moderation Console" 
      subtitle="Review and manage product submissions across the platform."
    >
      {/* Stats Overview */}
      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Approved</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.approved}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-500">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rejected</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.rejected}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-900 dark:bg-slate-900/50">
                <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Product</th>
                <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Seller</th>
                <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Status</th>
                <th className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                    No products found in the database.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="group transition hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {p.name}
                        </span>
                        <span className="mt-1 text-xs text-slate-500">
                          {p.category} • {formatCurrencyUSD(p.price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{p.seller_name}</span>
                        <span className="text-xs text-slate-500">{p.seller_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {p.status !== 'approved' && (
                          <form action={updateProductStatus.bind(null, p.id, 'approved')}>
                            <button className="rounded-xl bg-emerald-600 p-2 text-white shadow-sm transition hover:bg-emerald-700 active:scale-95" title="Approve">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </form>
                        )}
                        {p.status !== 'rejected' && (
                          <form action={updateProductStatus.bind(null, p.id, 'rejected')}>
                            <button className="rounded-xl bg-amber-600 p-2 text-white shadow-sm transition hover:bg-amber-700 active:scale-95" title="Reject">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </form>
                        )}
                        <AdminDeleteButton productId={p.id} />
                        <Link 
                          href={`/products/${p.id}`}
                          className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                          title="View Page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-blue-50/50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
        <ShieldCheck className="h-5 w-5 flex-shrink-0" />
        <p>
          <strong>Security Notice:</strong> As an Admin, your actions are final. Rejecting a product hides it from all listing pages instantly.
        </p>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: AdminProduct['status'] }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
    rejected: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50"
  };

  const icons = {
    pending: <Clock className="h-3 w-3" />,
    approved: <CheckCircle2 className="h-3 w-3" />,
    rejected: <AlertCircle className="h-3 w-3" />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold leading-none ${styles[status]}`}>
      {icons[status]}
      {status.toUpperCase()}
    </span>
  );
}
