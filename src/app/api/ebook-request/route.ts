import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const BOOK_NAMES: Record<string, string> = {
  "gept-elementary": "GEPT 初級家長陪伴指南",
  "gept-intermediate": "GEPT 中級家長陪伴指南",
  "gept-upper-intermediate": "GEPT 中高級家長陪伴指南",
  "japanese-n5": "日文 N5 家長陪伴指南",
  "japanese-n4": "日文 N4 家長陪伴指南",
  "japanese-n3": "日文 N3 家長陪伴指南",
  "japanese-n2": "日文 N2 家長陪伴指南",
  "japanese-n1": "日文 N1 家長陪伴指南",
};

export async function POST(request: Request) {
  try {
    const { email, ebookSlug } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!ebookSlug || !BOOK_NAMES[ebookSlug]) {
      return NextResponse.json({ error: "Invalid ebook" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      // Fallback: still return success so user doesn't see error
      return NextResponse.json({ success: true, message: "Request received" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Upsert into newsletter_subscribers (reuse existing table)
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: cleanEmail,
          source: `ebook-${ebookSlug}`,
          is_active: true,
        },
        { onConflict: "email" }
      );

    if (dbError) {
      console.error("Supabase error:", dbError);
      // Still return success - we don't want user to see an error
      return NextResponse.json({ success: true, message: "Request received" });
    }

    // TODO: When Resend is configured, send email with ebook download link
    // For now, just store the email. The ebook sending will be added later.

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
