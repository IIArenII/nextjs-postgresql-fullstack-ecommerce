"use client";

import { useState } from "react";
import { ImageIcon, X, Upload } from "lucide-react";

export function ProductImageInput({ defaultValue = "" }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState(false);

  return (
    <div className="space-y-3">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        Product Image URL
      </label>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <div className="relative group">
            <input
              name="image_url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => {
                const val = e.target.value;
                setUrl(val);
                if (val && !val.startsWith("https://")) {
                  setError(true);
                } else {
                  setError(false);
                }
              }}
              className={`w-full border p-3 rounded-xl outline-none focus:ring-2 transition-all pr-10 ${
                error && url ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-950/20 animate-shake" : "focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              }`}
            />
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setError(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {error && url && !url.startsWith("https://") && (
            <p className="text-[10px] text-red-500 font-bold animate-pulse">
              ❌ Security Error: Only secure HTTPS links are allowed.
            </p>
          )}
          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
            Tip: You can use direct links from Unsplash, Imgur, or your own hosting.
          </p>
        </div>

        <div className={`w-full md:w-32 h-32 rounded-xl border-2 border-dashed bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center overflow-hidden shrink-0 transition-all group relative ${
          error && url ? "border-red-300" : "border-slate-200 dark:border-slate-800 hover:border-blue-400"
        }`}>
          {url && !error ? (
            <img
              src={url}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => setError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors text-center px-2">
              <Upload className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {error && url ? "Invalid Image" : "Preview"}
              </span>
            </div>
          )}
          {error && url && (
            <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center text-red-600 p-2 text-center leading-tight">
              <span className="text-[10px] font-bold">
                {url.startsWith("https://") ? "Failed to load image" : "HTTPS Required"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
