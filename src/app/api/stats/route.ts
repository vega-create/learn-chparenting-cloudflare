export const runtime = "edge";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const BASE_COUNT = 13250; // 上線前累積的歷史練習次數

export async function GET() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ totalPractices: BASE_COUNT });
  }

  // Primary: read from practice_counts table (tracks ALL users including anonymous)
  const { data: counterData } = await supabase
    .from("practice_counts")
    .select("total")
    .eq("id", 1)
    .single();

  if (counterData?.total != null) {
    return NextResponse.json({ totalPractices: BASE_COUNT + counterData.total });
  }

  // Fallback: count from learning_activities (only logged-in users)
  const { count } = await supabase
    .from("learning_activities")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({ totalPractices: BASE_COUNT + (count ?? 0) });
}
