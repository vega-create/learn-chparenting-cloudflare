"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HISTORY_GEO_REGIONS, getTopicByIds } from "@/data/history-geo";
import type { HistGeoQ, HistGeoReading } from "@/data/history-geo";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { trackActivity } from "@/lib/tracking";
import ShareButtons from "@/components/ShareButtons";

type Tab = "quiz" | "reading";

export default function TopicPracticePage() {
  const params = useParams();
  const regionId = params.regionId as string;
  const topicId = params.topicId as string;
  const result = getTopicByIds(regionId, topicId);

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">找不到這個主題</p>
        <Link href="/history-geo" className="text-emerald-500 hover:underline no-underline mt-4 inline-block">
          ← 回到歷史地理
        </Link>
      </div>
    );
  }

  const { region, topic } = result;
  const hasReadings = topic.readings && topic.readings.length > 0;
  const hasQuiz = topic.questions.length > 0;

  return <TopicContent region={region} topic={topic} regionId={regionId} hasReadings={!!hasReadings} hasQuiz={hasQuiz} />;
}

function TopicContent({
  region,
  topic,
  regionId,
  hasReadings,
  hasQuiz,
}: {
  region: { id: string; title: string; icon: string; color: string; accentColor: string };
  topic: { id: string; title: string; icon: string; color: string; questions: HistGeoQ[]; readings?: HistGeoReading[] };
  regionId: string;
  hasReadings: boolean;
  hasQuiz: boolean;
}) {
  const defaultTab: Tab = hasQuiz ? "quiz" : "reading";
  const [tab, setTab] = useState<Tab>(defaultTab);

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "quiz", label: "✏️ 練習", show: hasQuiz },
    { key: "reading", label: "📗 閱讀", show: hasReadings },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href={`/history-geo/${regionId}`}
        className="text-sm text-emerald-500 hover:underline no-underline"
      >
        ← 回到{region.title}
      </Link>

      <div className="text-center mt-4 mb-6">
        <div className="text-4xl mb-2">{topic.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{topic.title}</h1>
        <p className="text-sm text-slate-500">{region.title}</p>
      </div>

      {/* Tab switcher */}
      {visibleTabs.length > 1 && (
        <div className="flex gap-2 justify-center mb-6">
          {visibleTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-xl font-bold text-sm border-none cursor-pointer transition ${
                tab === t.key
                  ? `bg-gradient-to-r ${topic.color} text-white shadow`
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === "quiz" && hasQuiz && (
        <QuizSection
          questions={topic.questions}
          topicTitle={topic.title}
          topicId={topic.id}
          regionId={regionId}
          regionTitle={region.title}
          color={topic.color}
        />
      )}
      {tab === "reading" && hasReadings && topic.readings && (
        <ReadingSection
          readings={topic.readings}
          topicTitle={topic.title}
          topicId={topic.id}
          regionId={regionId}
          regionTitle={region.title}
          color={topic.color}
        />
      )}
    </div>
  );
}

/* ─── Quiz Section ─── */
function QuizSection({
  questions,
  topicTitle,
  topicId,
  regionId,
  regionTitle,
  color,
}: {
  questions: HistGeoQ[];
  topicTitle: string;
  topicId: string;
  regionId: string;
  regionTitle: string;
  color: string;
}) {
  const [shuffled, setShuffled] = useState<HistGeoQ[]>([]);
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
        subject: "history-geo",
        activityType: "quiz",
        activityId: `${regionId}-${topicId}`,
        activityName: `歷史地理 ${regionTitle} ${topicTitle}`,
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
        <div className="text-4xl font-black text-emerald-500 my-3">
          {correct} / {shuffled.length}
        </div>
        <div className="text-sm text-slate-500 mb-4">正確率 {pct}%</div>
        <div className="text-xs text-slate-500 mb-2 mt-4">
          分享你的成績：
        </div>
        <ShareButtons
          text={`我完成了歷史地理「${topicTitle}」練習，答對 ${correct}/${shuffled.length} 題！🌏`}
          url="/history-geo"
        />
        <div className="mt-4">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold cursor-pointer border-none hover:bg-emerald-600 transition"
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

/* ─── Reading Section ─── */
function ReadingSection({
  readings,
  topicTitle,
  topicId,
  regionId,
  regionTitle,
  color,
}: {
  readings: HistGeoReading[];
  topicTitle: string;
  topicId: string;
  regionId: string;
  regionTitle: string;
  color: string;
}) {
  const [pIdx, setPIdx] = useState(0);
  const [sel, setSel] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const rd = readings[pIdx];
  const allAnswered = Object.keys(sel).length === rd.questions.length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const correct = rd.questions.filter((q, i) => sel[i] === q.ans).length;
    if (correct === rd.questions.length) playPerfect();
    else if (correct >= rd.questions.length * 0.6) playCorrect();
    else playWrong();

    trackActivity({
      subject: "history-geo",
      activityType: "quiz",
      activityId: `${regionId}-${topicId}-reading-${pIdx + 1}`,
      activityName: `歷史地理 ${regionTitle} ${topicTitle} 第${pIdx + 1}篇`,
      score: correct,
      maxScore: rd.questions.length,
      stars:
        correct >= rd.questions.length * 0.9
          ? 3
          : correct >= rd.questions.length * 0.6
            ? 2
            : 1,
    }).catch(() => {});
  };

  const handleNextPassage = () => {
    setPIdx((p) => (p + 1) % readings.length);
    setSel({});
    setSubmitted(false);
  };

  const correctCount = submitted
    ? rd.questions.filter((q, i) => sel[i] === q.ans).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Passage selector */}
      {readings.length > 1 && (
        <div className="flex gap-2 justify-center">
          {readings.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setPIdx(i);
                setSel({});
                setSubmitted(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border-none cursor-pointer transition ${
                pIdx === i
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              第 {i + 1} 篇
            </button>
          ))}
        </div>
      )}

      {/* Passage */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-3">
          📗 閱讀文章（第 {pIdx + 1} 篇）
        </h3>
        <div className="text-slate-700 leading-8 text-[15px] bg-slate-50 rounded-xl p-5 border border-slate-100 whitespace-pre-line">
          {rd.passage}
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">
          📝 閱讀理解題
          {submitted && (
            <span className="ml-2 text-sm font-normal text-slate-500">
              {correctCount}/{rd.questions.length} 題正確
            </span>
          )}
        </h3>
        <div className="space-y-6">
          {rd.questions.map((q, qi) => (
            <div key={qi}>
              <div className="font-medium text-slate-800 mb-2">
                {qi + 1}. {q.q}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opts.map((opt, oi) => {
                  let cls =
                    "bg-slate-50 border-slate-200 hover:bg-slate-100 cursor-pointer";
                  if (sel[qi] === oi && !submitted) {
                    cls =
                      "bg-emerald-50 border-emerald-400 text-emerald-700 cursor-pointer";
                  }
                  if (submitted) {
                    if (oi === q.ans)
                      cls =
                        "bg-emerald-50 border-emerald-400 text-emerald-700 cursor-default";
                    else if (sel[qi] === oi && oi !== q.ans)
                      cls =
                        "bg-red-50 border-red-400 text-red-700 cursor-default";
                    else cls = "bg-slate-50 border-slate-200 cursor-default";
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => {
                        if (submitted) return;
                        setSel((s) => ({ ...s, [qi]: oi }));
                      }}
                      disabled={submitted}
                      className={`text-left p-3 rounded-xl border-2 text-sm font-medium transition ${cls}`}
                    >
                      <span className="text-slate-400 mr-1">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`px-6 py-2.5 rounded-xl font-bold border-none cursor-pointer transition ${
                allAnswered
                  ? `bg-gradient-to-r ${color} text-white hover:opacity-90`
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              送出答案
            </button>
          ) : (
            <>
              <div className="w-full text-center mb-2">
                <div className="text-lg font-bold">
                  {correctCount === rd.questions.length
                    ? "🎉 全部答對！"
                    : `答對 ${correctCount}/${rd.questions.length} 題`}
                </div>
              </div>
              {readings.length > 1 && (
                <button
                  onClick={handleNextPassage}
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-bold cursor-pointer border-none hover:bg-emerald-600 transition"
                >
                  下一篇 →
                </button>
              )}
              <button
                onClick={() => {
                  setSel({});
                  setSubmitted(false);
                }}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold cursor-pointer border-none hover:bg-slate-200 transition"
              >
                🔄 重做本篇
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
