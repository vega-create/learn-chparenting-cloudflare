import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const revalidate = 300; // cache 5 minutes

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ totalPractices: 0 });
  }

  const { count } = await supabase
    .from("learning_activities")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({ totalPractices: count ?? 0 });
}
