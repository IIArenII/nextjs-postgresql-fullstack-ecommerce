"use client";
import { useState, useEffect } from "react";
import { handleAuth, verifyEmailCode } from "@/app/auth/actions";
import { X } from "lucide-react";

export function AuthModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; }
  }, [isOpen]);

  if (!isOpen) return null;

  async function clientAction(formData: FormData) {
    setError(null);
    setVerificationSent(false);
    setIsPending(true);
    try {
      // Force role to buyer for this specific checkout modal
      if (!isLogin) {
        formData.set("role", "buyer");
      }
      formData.set("type", isLogin ? "login" : "register");
      
      const result = await handleAuth(formData);
      if (result && "success" in result && result.success) {
        if ("requiresVerification" in result && result.requiresVerification) {
          if ('email' in result && typeof result.email === 'string') {
            setPendingEmail(result.email);
          }
          setVerificationSent(true);
        } else {
          onSuccess();
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsPending(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            {isLogin ? "Sign in to continue" : "Create an account"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You need to be logged in to purchase items.
          </p>

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

          {verificationSent ? (
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-200 flex flex-col gap-2">
              <p className="font-semibold text-base">Check your email!</p>
              <p>We&apos;ve sent a 6-digit verification code to your inbox. Please enter it below.</p>
              
              <form action={handleVerifySubmit} className="flex flex-col gap-3 mt-2">
                <input
                  name="code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full border p-3 rounded-lg outline-none text-center text-xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-all"
                  required
                />
                <button 
                  disabled={isVerifying}
                  className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-50 text-sm shadow-sm"
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
          ) : (
            <form action={clientAction} className="flex flex-col gap-4">
              {!isLogin && (
                <input
                  name="name"
                  placeholder="Full Name"
                  className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-all text-sm"
                  required
                />
              )}
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-all text-sm"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-all text-sm"
                required
              />

              <button 
                disabled={isPending}
                className="mt-2 bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 transition-all text-sm shadow-sm"
              >
                {isPending ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setVerificationSent(false);
              }}
              className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
