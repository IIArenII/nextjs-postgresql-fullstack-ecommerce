"use client";

import { useState } from "react";
import { updateAccount } from "@/app/account/actions";
import { User, Lock, Mail, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export function AccountForm({ user }: { user: any }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    try {
      const result = await updateAccount(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Account settings updated successfully!' });
        // Clear password fields
        const form = document.getElementById('account-form') as HTMLFormElement;
        if (form) {
           form.querySelector<HTMLInputElement>('input[name="currentPassword"]')!.value = '';
           form.querySelector<HTMLInputElement>('input[name="newPassword"]')!.value = '';
        }
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400' 
            : 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form id="account-form" action={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Personal Info
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                Full Name
              </label>
              <div className="relative">
                <input
                  name="name"
                  defaultValue={user.name}
                  required
                  className="w-full border p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all"
                  placeholder="Your Name"
                />
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  value={user.email}
                  readOnly
                  disabled
                  className="w-full border p-3 pl-10 rounded-xl bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Email cannot be changed for security.</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                Account Role
              </label>
              <div className="relative">
                <div className="w-full border p-3 pl-10 rounded-xl bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 flex items-center cursor-not-allowed">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
                    user.role === 'Seller'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user.role}
                  </span>
                </div>
                <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Your account role cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" /> Security
          </h3>
          
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              Leave password fields empty if you don&apos;t want to change your password.
            </p>

            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type="password"
                  className="w-full border p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type="password"
                  className="w-full border p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all"
                  placeholder="At least 6 characters"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-blue-500/10"
        >
          {isPending ? "Saving changes..." : "Save Account Settings"}
        </button>
      </form>
    </div>
  );
}
