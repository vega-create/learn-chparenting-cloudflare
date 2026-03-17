"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      if (!supabase) {
        window.location.href = "/login";
        return;
      }

      // Supabase client-side auth automatically handles the code exchange
      // when it detects the auth callback URL parameters
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error.message);
        window.location.href = "/login";
      } else {
        window.location.href = "/dashboard";
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-slate-500">登入中，請稍候...</p>
      </div>
    </div>
  );
}
