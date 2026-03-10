"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { handleAuth } from "./actions";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function clientAction(formData: FormData) {
    setError(null);
    try {
      const result = await handleAuth(formData);
      if (result && "success" in result && result.success) {
        if (result.role === "Seller") {
          router.push("/seller");
        } else {
          router.push("/");
        }
        return;
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 dark:bg-slate-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-slate-100">
          {isLogin ? "Welcome Back" : "Join Our Store"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <form action={clientAction} className="flex flex-col gap-4">
          <input
            type="hidden"
            name="type"
            value={isLogin ? "login" : "register"}
          />

          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name"
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          )}

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
                I am a...
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    defaultChecked
                    className="accent-blue-600"
                  />
                  Buyer
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    className="accent-blue-600"
                  />
                  Seller
                </label>
              </div>
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />

          <button className="bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-black transition-all">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm text-gray-500 hover:text-blue-600 transition-colors w-full text-center dark:text-slate-400 dark:hover:text-blue-400"
        >
          {isLogin
            ? "New here? Create an account"
            : "Have an account? Sign in instead"}
        </button>
      </div>
    </div>
  );
}
