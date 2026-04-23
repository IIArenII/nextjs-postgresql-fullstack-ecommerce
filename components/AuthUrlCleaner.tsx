"use client";

import { useEffect } from "react";

/**
 * This component handles cleaning up sensitive or messy OAuth parameters
 * from the URL after a successful login. It keeps the address bar sharp
 * by removing things like ?code=... or #access_token=...
 */
export function AuthUrlCleaner() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      
      // Check if code or error_description exists in query params
      if (url.searchParams.has("code") || url.searchParams.has("error_description")) {
        // Remove the parameters but stay on the same page
        url.searchParams.delete("code");
        url.searchParams.delete("error_description");
        
        // Update the browser history with the clean URL
        const cleanUrl = url.pathname + url.search + url.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
      
      // Also handle hash fragments (common in some Supabase auth flows)
      if (window.location.hash && (
          window.location.hash.includes("access_token") || 
          window.location.hash.includes("error")
      )) {
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
