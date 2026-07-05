export const runtime = "edge";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Practical email shape check: one @, no spaces/control chars, has a TLD.
// RFC 5321 caps addresses at 254 chars.
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service not configured" }, { status: 503 });
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === "23505") {
        // Duplicate email - treat as success
        return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
      }
      return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Subscribed" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
