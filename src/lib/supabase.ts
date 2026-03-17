import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

// Supabase anon key is public by design — safe to hardcode
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexcvcinmphkmavgswgn.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGN2Y2lubXBoa21hdmdzd2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEwODksImV4cCI6MjA4MjY3NzA4OX0.Ur2XPKbWU0Bfm87otq4uM_33cyWRi267nBbAEZtjcis";

// Browser client — use in "use client" components
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

export function isSupabaseConfigured() {
  return true;
}
