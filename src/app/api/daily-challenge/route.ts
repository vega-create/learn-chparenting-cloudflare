import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// GET: fetch today's stats
export async function GET() {
  const today = getToday();
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ total: 0, correct: 0 });
  }

  const { data } = await supabase
    .from("daily_challenge_stats")
    .select("total_attempts, correct_attempts")
    .eq("date", today)
    .single();

  return NextResponse.json({
    total: data?.total_attempts ?? 0,
    correct: data?.correct_attempts ?? 0,
  });
}

// POST: record an attempt
export async function POST(request: Request) {
  try {
    const { questionId, subject, isCorrect } = await request.json();
    const today = getToday();

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ ok: true });
    }

    // Upsert: create row if not exists, increment counters
    const { data: existing } = await supabase
      .from("daily_challenge_stats")
      .select("total_attempts, correct_attempts")
      .eq("date", today)
      .single();

    if (existing) {
      await supabase
        .from("daily_challenge_stats")
        .update({
          total_attempts: existing.total_attempts + 1,
          correct_attempts: existing.correct_attempts + (isCorrect ? 1 : 0),
        })
        .eq("date", today);
    } else {
      await supabase.from("daily_challenge_stats").insert({
        date: today,
        subject,
        question_id: questionId,
        total_attempts: 1,
        correct_attempts: isCorrect ? 1 : 0,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
