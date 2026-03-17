export const runtime = "edge";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexcvcinmphkmavgswgn.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGN2Y2lubXBoa21hdmdzd2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEwODksImV4cCI6MjA4MjY3NzA4OX0.Ur2XPKbWU0Bfm87otq4uM_33cyWRi267nBbAEZtjcis",
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: Record<string, unknown>) {
            cookieStore.set(name, "", options);
          },
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard after successful login
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
