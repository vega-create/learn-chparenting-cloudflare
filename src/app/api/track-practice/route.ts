export const runtime = "edge";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ success: true }); // no-op if not configured
    }

    // Read current count, then increment
    const { data } = await supabase
      .from("practice_counts")
      .select("total")
      .eq("id", 1)
      .single();

    if (data) {
      await supabase
        .from("practice_counts")
        .update({
          total: (data.total || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);
    }

    return NextResponse.json({ success: true });
  } catch {
    // Never fail — this is fire-and-forget tracking
    return NextResponse.json({ success: true });
  }
}
