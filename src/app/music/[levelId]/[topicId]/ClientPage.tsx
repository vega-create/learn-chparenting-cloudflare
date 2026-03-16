"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTopicByIds } from "@/data/music";
import type { MusicQ, MusicTopic, ConceptAudioDemo } from "@/data/music";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { trackActivity } from "@/lib/tracking";
import ShareButtons from "@/components/ShareButtons";

function shuffleOpts<T extends { opts: string[]; ans: number }>(item: T): T {
  const indices = item.opts.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { ...item, opts: indices.map(i => item.opts[i]), ans: indices.indexOf(item.ans) };
}

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
  const hasConcepts = topic.concepts && topic.concepts.length > 0;

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

      {hasConcepts ? (
        <TabbedView topic={topic} levelId={levelId} levelTitle={level.title} />
      ) : (
        <QuizSection
          questions={topic.questions}
          topicTitle={topic.title}
          topicId={topic.id}
          levelId={levelId}
          levelTitle={level.title}
          color={topic.color}
        />
      )}
    </div>
  );
}

type ViewTab = "concepts" | "practice";

function TabbedView({ topic, levelId, levelTitle }: { topic: MusicTopic; levelId: string; levelTitle: string }) {
  const [tab, setTab] = useState<ViewTab>("concepts");

  const tabs: { key: ViewTab; label: string }[] = [
    { key: "concepts", label: "📖 觀念教學" },
    { key: "practice", label: "✏️ 開始練習" },
  ];

  return (
    <>
      <div className="flex gap-2 justify-center mb-6">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl font-bold text-sm border-none cursor-pointer transition ${
              tab === t.key
                ? `bg-gradient-to-r ${topic.color} text-white shadow`
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "concepts" && (
        <div className="space-y-4">
          {topic.concepts!.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-2">{c.title}</h2>
              <p className="text-slate-600 leading-7 mb-3">{c.explanation}</p>
              {c.images && c.images.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3 overflow-x-auto">
                  <div className="flex justify-around items-end gap-2 min-w-0">
                    {c.images.map((img, k) => (
                      <div key={k} className="flex flex-col items-center gap-1 shrink-0">
                        <img src={img.src} alt={img.label} className="h-12 md:h-16 w-auto" />
                        <span className="text-xs font-bold text-slate-700">{img.label}</span>
                        {img.sublabel && <span className="text-[10px] text-slate-400">{img.sublabel}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {c.visual && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3 overflow-x-auto">
                  <pre className="text-sm leading-6 text-slate-700 whitespace-pre font-mono m-0">{c.visual}</pre>
                </div>
              )}
              <ul className="space-y-1.5">
                {c.keyPoints.map((kp, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-pink-400 mt-0.5">•</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
              {c.audioDemos && c.audioDemos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                  {c.audioDemos.map((demo, k) => (
                    <AudioDemoButton key={k} demo={demo} />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="text-center pt-2">
            <button onClick={() => setTab("practice")}
              className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${topic.color} text-white font-bold cursor-pointer border-none hover:opacity-90 transition`}>
              觀念看完了，開始練習 →
            </button>
          </div>
        </div>
      )}

      {tab === "practice" && (
        <QuizSection
          questions={topic.questions}
          topicTitle={topic.title}
          topicId={topic.id}
          levelId={levelId}
          levelTitle={levelTitle}
          color={topic.color}
        />
      )}
    </>
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
    setShuffled([...questions].sort(() => Math.random() - 0.5).map(shuffleOpts));
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
    setShuffled([...questions].sort(() => Math.random() - 0.5).map(shuffleOpts));
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

function AudioDemoButton({ demo }: { demo: ConceptAudioDemo }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      const { playDemoFromData } = await import("@/lib/musicAudio");
      playDemoFromData(demo);
      const gap = demo.gap ?? 0.05;
      const totalDuration = demo.chord
        ? demo.chord[1]
        : demo.steps.reduce((sum, s) => sum + s[1] + gap, 0);
      setTimeout(() => setPlaying(false), totalDuration * 1000 + 300);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={playing}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition ${
        playing
          ? "bg-pink-100 border-pink-300 text-pink-500 animate-pulse"
          : "bg-white border-slate-200 text-slate-600 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-500"
      }`}
    >
      {playing ? "🔊 播放中..." : demo.label}
    </button>
  );
}
