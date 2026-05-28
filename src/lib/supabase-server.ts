import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexcvcinmphkmavgswgn.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGN2Y2lubXBoa21hdmdzd2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEwODksImV4cCI6MjA4MjY3NzA4OX0.Ur2XPKbWU0Bfm87otq4uM_33cyWRi267nBbAEZtjcis";

// Simpler client (no cookies/auth-helpers) — compatible with Cloudflare Edge runtime.
// We're only doing public newsletter signups / ebook requests (no user sessions),
// so we don't need cookie-based session handling.
export async function createServerSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
