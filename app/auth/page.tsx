"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { handleAuth, verifyEmailCode } from "./actions";
import { OAuthButtons } from "@/components/OAuthButtons";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we just came from a verification redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") {
        setSuccessMsg("Your email has been successfully verified! You can now log in.");
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  async function clientAction(formData: FormData) {
    setError(null);
    setSuccessMsg(null);
    setVerificationSent(false);
    try {
      const result = await handleAuth(formData);
      if (result && "success" in result && result.success) {
        if ("requiresVerification" in result && result.requiresVerification) {
          if ('email' in result && typeof result.email === 'string') {
            setPendingEmail(result.email);
          }
           setVerificationSent(true);
          return;
        }

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

  async function handleVerifySubmit(formData: FormData) {
    setError(null);
    setSuccessMsg(null);
    setIsVerifying(true);
    const code = formData.get("code") as string;
    try {
      if (!pendingEmail) throw new Error("Missing email address.");
      await verifyEmailCode(pendingEmail, code);
      setSuccessMsg("Your email has been successfully verified! You can now log in.");
      setVerificationSent(false);
      setIsLogin(true);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid code");
      }
    } finally {
      setIsVerifying(false);
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

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-300">
            {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        {verificationSent && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-200 flex flex-col gap-2">
            <p className="font-semibold text-base">Check your email!</p>
            <p>We&apos;ve sent a 6-digit verification code to your inbox. Please enter it below.</p>
            
            <form action={handleVerifySubmit} className="flex flex-col gap-3 mt-2">
              <input
                name="code"
                type="text"
                maxLength={6}
                placeholder="000000"
                className="border p-3 rounded-lg outline-none text-center text-xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
              <button 
                type="submit"
                disabled={isVerifying}
                className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <button 
              type="button" 
              onClick={() => { setIsLogin(true); setVerificationSent(false); setPendingEmail(null); }}
              className="mt-4 text-center font-medium text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300 transition-colors"
            >
              Cancel and return to Login
            </button>
          </div>
        )}

        {!verificationSent && (
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

          <button 
            type="submit"
            className="bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-black transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        )}

        {!verificationSent && (
          <>
            <OAuthButtons />
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-6 text-sm text-gray-500 hover:text-blue-600 transition-colors w-full text-center dark:text-slate-400 dark:hover:text-blue-400"
            >
              {isLogin
                ? "New here? Create an account"
                : "Have an account? Sign in instead"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
