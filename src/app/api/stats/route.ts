import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const revalidate = 300; // cache 5 minutes

const BASE_COUNT = 13250; // 上線前累積的歷史練習次數

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ totalPractices: BASE_COUNT });
  }

  const { count } = await supabase
    .from("learning_activities")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({ totalPractices: BASE_COUNT + (count ?? 0) });
}
