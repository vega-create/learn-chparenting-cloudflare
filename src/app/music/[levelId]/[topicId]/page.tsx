"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTopicByIds } from "@/data/music";
import type { MusicQ } from "@/data/music";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { trackActivity } from "@/lib/tracking";
import ShareButtons from "@/components/ShareButtons";

export default function TopicPracticePage() {
  const params = useParams();
  const levelId = params.levelId as string;
  const topicId = params.topicId as string;
  const result = getTopicByIds(levelId, topicId);

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">找不到這個主題</p>
        <Link href="/music" className="text-pink-500 hover:underline no-underline mt-4 inline-block">
          ← 回到樂理基礎
        </Link>
      </div>
    );
  }

  const { level, topic } = result;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href={`/music/${levelId}`}
        className="text-sm text-pink-500 hover:underline no-underline"
      >
        ← 回到{level.title}
      </Link>

      <div className="text-center mt-4 mb-6">
        <div className="text-4xl mb-2">{topic.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{topic.title}</h1>
        <p className="text-sm text-slate-500">{level.title}</p>
      </div>

      <QuizSection
        questions={topic.questions}
        topicTitle={topic.title}
        topicId={topic.id}
        levelId={levelId}
        levelTitle={level.title}
        color={topic.color}
      />
    </div>
  );
}

function QuizSection({
  questions,
  topicTitle,
  topicId,
  levelId,
  levelTitle,
  color,
}: {
  questions: MusicQ[];
  topicTitle: string;
  topicId: string;
  levelId: string;
  levelTitle: string;
  color: string;
}) {
  const [shuffled, setShuffled] = useState<MusicQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
  }, [questions]);

  const q = shuffled[idx];

  const handleSelect = (i: number) => {
    if (selected !== null || !q) return;
    setSelected(i);
    if (i === q.ans) {
      setCorrect((c) => c + 1);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (idx + 1 >= shuffled.length) {
      setDone(true);
      if (correct + (selected === q?.ans ? 1 : 0) >= shuffled.length * 0.9) playPerfect();
      else playVictory();
    } else {
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setShuffled([...questions].sort(() => Math.random() - 0.5));
    setIdx(0);
    setSelected(null);
    setCorrect(0);
    setDone(false);
  };

  // Track completion
  useEffect(() => {
    if (done && shuffled.length > 0) {
      trackActivity({
        subject: "music",
        activityType: "quiz",
        activityId: `${levelId}-${topicId}`,
        activityName: `樂理 ${levelTitle} ${topicTitle}`,
        score: correct,
        maxScore: shuffled.length,
        stars:
          correct >= shuffled.length * 0.9
            ? 3
            : correct >= shuffled.length * 0.6
              ? 2
              : correct >= shuffled.length * 0.3
                ? 1
                : 0,
      }).catch(() => {});
    }
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!q && !done) return null;

  if (done) {
    const pct = Math.round((correct / shuffled.length) * 100);
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">
          {pct >= 90 ? "🎉" : pct >= 60 ? "👍" : "💪"}
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          練習完成！
        </h2>
        <div className="text-4xl font-black text-pink-500 my-3">
          {correct} / {shuffled.length}
        </div>
        <div className="text-sm text-slate-500 mb-4">正確率 {pct}%</div>
        <div className="text-xs text-slate-500 mb-2 mt-4">
          分享你的成績：
        </div>
        <ShareButtons
          text={`我完成了樂理「${topicTitle}」練習，答對 ${correct}/${shuffled.length} 題！🎵`}
          url="/music"
        />
        <div className="mt-4">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-pink-500 text-white font-bold cursor-pointer border-none hover:bg-pink-600 transition"
          >
            🔄 再做一次
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-400">
          第 {idx + 1} / {shuffled.length} 題
        </span>
        <span className="text-sm font-bold text-emerald-600">
          ✅ {correct} 題正確
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4">{q.s}</h3>

      <div className="space-y-2.5">
        {q.opts.map((opt, i) => {
          let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
          if (selected !== null) {
            if (i === q.ans)
              cls = "bg-emerald-50 border-emerald-400 text-emerald-700";
            else if (i === selected)
              cls = "bg-red-50 border-red-400 text-red-700";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left p-3.5 rounded-xl border-2 font-medium cursor-pointer transition ${cls} ${selected !== null ? "cursor-default" : ""}`}
            >
              <span className="text-slate-400 mr-2 text-sm">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4">
          <div
            className={`p-3 rounded-xl text-sm ${
              selected === q.ans
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {selected === q.ans
              ? "✅ 答對了！"
              : `❌ 正確答案：${String.fromCharCode(65 + q.ans)}. ${q.opts[q.ans]}`}
            {q.explain && (
              <div className="mt-1 text-slate-500">💡 {q.explain}</div>
            )}
          </div>
          <button
            onClick={handleNext}
            className={`mt-3 px-5 py-2 rounded-xl bg-gradient-to-r ${color} text-white font-bold cursor-pointer border-none hover:opacity-90 transition`}
          >
            {idx + 1 >= shuffled.length ? "看結果 →" : "下一題 →"}
          </button>
        </div>
      )}
    </div>
  );
}
