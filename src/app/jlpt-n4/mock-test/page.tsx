"use client";
import { N4_UNITS } from "@/data/jlpt-n4";
import { useState, useEffect, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { trackActivity } from "@/lib/tracking";
import { speakJa as speak } from "@/lib/speech";
import ShareButtons from "@/components/ShareButtons";

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const allListening = N4_UNITS.flatMap(u => u.listening);
const allQuiz = N4_UNITS.flatMap(u => u.quiz);
const allReading = N4_UNITS.flatMap(u => Array.isArray(u.reading) ? u.reading : [u.reading]);

type Phase = "intro" | "listening" | "vocabulary" | "reading" | "result" | "review";

export default function MockTestPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [listenQs, setListenQs] = useState<any[]>([]);
  const [vocabQs, setVocabQs] = useState<any[]>([]);
  const [readingData, setReadingData] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [listenPlays, setListenPlays] = useState<Record<number, number>>({});

  const startTest = () => {
    setListenQs(shuffle(allListening).slice(0, 10));
    setVocabQs(shuffle(allQuiz).slice(0, 15));
    const shuffled = shuffle(allReading);
    setReadingData(shuffled.slice(0, 1));
    setAnswers({});
    setTimer(0);
    setStarted(true);
    setListenPlays({});
    setPhase("listening");
  };

  useEffect(() => {
    if (!started || phase === "intro" || phase === "result" || phase === "review") return;
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [started, phase]);

  // Stop speech when leaving page
  useEffect(() => { return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }; }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const setAns = (key: string, val: number) => setAnswers(a => ({ ...a, [key]: val }));

  const playListen = (idx: number, text: string) => {
    const plays = listenPlays[idx] || 0;
    if (plays < 3) { speak(text, 0.8); setListenPlays(p => ({ ...p, [idx]: plays + 1 })); }
  };

  const calcScore = useCallback(() => {
    let correct = 0, total = 0;
    const details: any[] = [];

    // Listening section
    listenQs.forEach((q, i) => {
      total++;
      const ok = answers[`l${i}`] === q.ans;
      if (ok) correct++;
      details.push({ section: "聽力", idx: i, question: q.text, userAns: answers[`l${i}`] ?? -1, correctAns: q.ans, opts: q.opts, correct: ok, zh: q.zh });
    });

    // Vocabulary & Grammar section
    vocabQs.forEach((q, i) => {
      total++;
      const ok = answers[`v${i}`] === q.ans;
      if (ok) correct++;
      details.push({ section: "語彙・文法", idx: i, question: q.s, userAns: answers[`v${i}`] ?? -1, correctAns: q.ans, opts: q.opts, correct: ok });
    });

    // Reading section
    readingData.forEach((rd: any, pi: number) => {
      rd.questions.forEach((q: any, qi: number) => {
        total++;
        const ok = answers[`r${pi}_${qi}`] === q.ans;
        if (ok) correct++;
        details.push({ section: "讀解", passageIdx: pi, idx: qi, question: q.q, userAns: answers[`r${pi}_${qi}`] ?? -1, correctAns: q.ans, opts: q.opts, correct: ok, passage: rd.passage });
      });
    });

    return { correct, total, details };
  }, [listenQs, vocabQs, readingData, answers]);

  // Track mock test completion
  const mockTracked = useRef(false);
  useEffect(() => {
    if (phase === "result" && !mockTracked.current) {
      mockTracked.current = true;
      const { correct, total } = calcScore();
      const pct = total > 0 ? correct / total : 0;
      trackActivity({
        subject: "jlpt", activityType: "mock-test", activityId: "jlpt-n4-mock",
        activityName: "JLPT N4 模擬測驗", score: correct, maxScore: total,
        stars: pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0,
        durationSeconds: timer,
      }).catch(() => {});
    }
    if (phase === "intro") mockTracked.current = false;
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Section answer counts
  const lDone = listenQs.filter((_, i) => answers[`l${i}`] !== undefined).length;
  const vDone = vocabQs.filter((_, i) => answers[`v${i}`] !== undefined).length;
  const readingQTotal = readingData.reduce((sum: number, rd: any) => sum + rd.questions.length, 0);
  const readingQDone = readingData.reduce((sum: number, rd: any, pi: number) => sum + rd.questions.filter((_: any, qi: number) => answers[`r${pi}_${qi}`] !== undefined).length, 0);

  // ─── INTRO ───
  if (phase === "intro") return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">JLPT N4 模擬測驗</h1>
        <p className="text-slate-500 mb-6">日本語能力試驗 N4 級模擬考（考完看成績與答案）</p>
        <div className="bg-blue-50 rounded-xl p-5 text-left mb-6 text-sm text-slate-700 space-y-3">
          <div className="font-bold text-blue-700 mb-1">測驗內容：</div>
          <div>🎧 <strong>第一部分 — 聽力（聴解）</strong>：10 題（每題最多播放 3 次）</div>
          <div>📖 <strong>第二部分 — 語彙・文法（語彙・文法）</strong>：15 題</div>
          <div>📗 <strong>第三部分 — 讀解（読解）</strong>：1 篇文章 + 數題</div>
          <div className="pt-2 border-t border-blue-200 text-blue-600 font-medium">
            ⚠️ 及格標準：60% 以上。考完才顯示成績與答案詳解。
          </div>
        </div>
        <button onClick={startTest} className="px-10 py-4 bg-rose-300 text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:bg-rose-400 transition active:scale-95">
          🚀 開始測驗
        </button>
        <div className="mt-4"><a href="/jlpt-n4" className="text-sm text-blue-500 hover:underline">← 返回 JLPT N4 首頁</a></div>
      </div>
    </div>
  );

  // ─── RESULT ───
  if (phase === "result") {
    const { correct, total } = calcScore();
    const pct = Math.round((correct / total) * 100);
    const pass = pct >= 60;
    const lS = listenQs.filter((q, i) => answers[`l${i}`] === q.ans).length;
    const vS = vocabQs.filter((q, i) => answers[`v${i}`] === q.ans).length;
    const rTotal2 = readingData.reduce((sum: number, rd: any) => sum + rd.questions.length, 0);
    const rS = readingData.reduce((sum: number, rd: any, pi: number) => sum + rd.questions.filter((q: any, qi: number) => answers[`r${pi}_${qi}`] === q.ans).length, 0);
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-lg">
          <div className="text-6xl mb-3">{pass ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">測驗完成</h2>
          <div className="text-sm text-slate-400 mb-4">用時：{fmt(timer)}</div>
          <div className="text-5xl font-black my-4" style={{ color: pass ? "#059669" : "#f59e0b" }}>{correct}/{total}</div>
          <div className="text-lg font-bold mb-2" style={{ color: pass ? "#059669" : "#f59e0b" }}>得分：{pct}%</div>
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${pass ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {pass ? "✅ 合格（達到 60%）" : "❌ 不合格（未達 60%）"}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between"><span>🎧 聽力（聴解）</span><span className="font-bold">{lS}/{listenQs.length}</span></div>
            <div className="flex justify-between"><span>📖 語彙・文法</span><span className="font-bold">{vS}/{vocabQs.length}</span></div>
            <div className="flex justify-between"><span>📗 讀解</span><span className="font-bold">{rS}/{rTotal2}</span></div>
          </div>
          <div className="text-xs text-slate-500 mb-2">分享你的成績：</div>
          <ShareButtons text={`我在 JLPT N4 模擬考答對了 ${correct}/${total} 題！你也來試試 💪`} url="/jlpt-n4/mock-test" />
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            <button onClick={() => setPhase("review")} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-indigo-700 transition">📋 查看答案</button>
            <button onClick={startTest} className="px-6 py-2.5 rounded-xl bg-rose-300 text-white font-semibold text-sm cursor-pointer border-none hover:bg-rose-400 transition">🔄 再測一次</button>
            <a href="/jlpt-n4" className="px-6 py-2.5 rounded-xl border-2 border-rose-300 text-rose-400 font-semibold text-sm no-underline hover:bg-rose-50 transition">← 返回</a>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEW ───
  if (phase === "review") {
    const { details, correct, total } = calcScore();
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 sticky top-16 z-10">
          <h2 className="text-base font-bold text-slate-800 m-0">📋 答案詳解</h2>
          <div className="flex gap-2"><span className="text-sm font-bold text-emerald-600">✓{correct}</span><span className="text-sm font-bold text-red-500">✗{total - correct}</span></div>
        </div>
        {["聽力", "語彙・文法", "讀解"].map(section => {
          const items = details.filter((d: any) => d.section === section);
          if (!items.length) return null;
          return (
            <div key={section} className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">{section === "聽力" ? "🎧" : section === "語彙・文法" ? "📖" : "📗"} {section}</h3>
              {section === "讀解" && readingData.length > 0 && (
                <div className="space-y-3 mb-3">{readingData.map((rd: any, pi: number) => (
                  <div key={pi} className="bg-blue-50 rounded-xl p-4 text-sm leading-7 text-slate-700 whitespace-pre-line"><div className="text-xs font-semibold text-blue-600 mb-2">文章 {pi + 1}</div>{rd.passage}</div>
                ))}</div>
              )}
              <div className="space-y-3">
                {items.map((item: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 border ${item.correct ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">{item.correct ? "✅" : "❌"}</span>
                      <div className="font-medium text-sm text-slate-800">
                        {item.idx + 1}. {item.question}
                        {item.zh && <span className="text-slate-400 ml-2">({item.zh})</span>}
                      </div>
                    </div>
                    <div className="ml-7 space-y-1">
                      {item.opts.map((o: string, oi: number) => {
                        let cls = "text-slate-500";
                        if (oi === item.correctAns) cls = "text-emerald-700 font-bold";
                        if (oi === item.userAns && oi !== item.correctAns) cls = "text-red-500 line-through";
                        return <div key={oi} className={`text-sm ${cls}`}>{String.fromCharCode(65 + oi)}. {o}{oi === item.correctAns ? " ✓" : ""}{oi === item.userAns && oi !== item.correctAns ? "（你的答案）" : ""}</div>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="text-center py-6 flex gap-3 justify-center flex-wrap">
          <button onClick={() => setPhase("result")} className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold text-sm cursor-pointer bg-white">← 回到成績</button>
          <button onClick={startTest} className="px-6 py-2.5 rounded-xl bg-rose-300 text-white font-semibold text-sm cursor-pointer border-none">🔄 再測一次</button>
        </div>
      </div>
    );
  }

  // ─── TEST PHASES ───
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Sticky header bar */}
      <div className="flex items-center justify-between mb-5 bg-white p-3 md:p-4 rounded-xl border border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          {phase === "vocabulary" && <button onClick={() => setPhase("listening")} className="text-sm text-blue-500 bg-transparent border-none cursor-pointer p-1">← 上一部分</button>}
          {phase === "reading" && <button onClick={() => setPhase("vocabulary")} className="text-sm text-blue-500 bg-transparent border-none cursor-pointer p-1">← 上一部分</button>}
          <span className="text-sm font-bold text-blue-600">
            {phase === "listening" ? "🎧 第一部分：聽力（聴解）" : phase === "vocabulary" ? "📖 第二部分：語彙・文法" : "📗 第三部分：讀解"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
            {phase === "listening" ? `${lDone}/${listenQs.length}` : phase === "vocabulary" ? `${vDone}/${vocabQs.length}` : `${readingQDone}/${readingQTotal}`}
          </span>
          <span className="font-mono text-sm text-slate-400">{fmt(timer)}</span>
        </div>
      </div>

      {/* ─── LISTENING PHASE ─── */}
      {phase === "listening" && (
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">⚠️ 每題最多播放 <strong>3 次</strong>，請仔細聽。</div>
          {listenQs.map((q, i) => (
            <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-slate-800 flex-shrink-0">第{i + 1}題</span>
                <button onClick={() => playListen(i, q.text)} disabled={(listenPlays[i] || 0) >= 3}
                  className={`border rounded-lg px-3 py-1.5 text-sm cursor-pointer transition flex-shrink-0 ${(listenPlays[i] || 0) >= 3 ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"}`}>
                  🔊 播放 {(listenPlays[i] || 0) >= 3 ? "(已達上限)" : `(剩 ${3 - (listenPlays[i] || 0)} 次)`}
                </button>
              </div>
              <div className="space-y-1.5">
                {q.opts.map((o: string, oi: number) => (
                  <button key={oi} onClick={() => setAns(`l${i}`, oi)}
                    className={`w-full text-left p-3 rounded-lg border text-sm cursor-pointer transition ${answers[`l${i}`] === oi ? "bg-blue-50 border-blue-400 font-medium" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>
                    {String.fromCharCode(65 + oi)}. {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center py-4">
            <button onClick={() => setPhase("vocabulary")} disabled={lDone < listenQs.length}
              className="px-8 py-3 rounded-xl bg-rose-300 text-white font-bold cursor-pointer border-none disabled:opacity-40 hover:bg-rose-400 transition">下一部分：語彙・文法 →</button>
            {lDone < listenQs.length && <p className="text-xs text-slate-400 mt-2">請回答所有題目後再進入下一部分。</p>}
          </div>
        </div>
      )}

      {/* ─── VOCABULARY & GRAMMAR PHASE ─── */}
      {phase === "vocabulary" && (
        <div className="space-y-4">
          {vocabQs.map((q, i) => (
            <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
              <div className="font-medium text-slate-800 mb-3 text-sm">{i + 1}. {q.s}</div>
              <div className="grid grid-cols-2 gap-2">
                {q.opts.map((o: string, oi: number) => (
                  <button key={oi} onClick={() => setAns(`v${i}`, oi)}
                    className={`p-2.5 rounded-lg border text-sm text-center cursor-pointer transition ${answers[`v${i}`] === oi ? "bg-blue-50 border-blue-400 font-medium" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center py-4">
            <button onClick={() => setPhase("reading")} disabled={vDone < vocabQs.length}
              className="px-8 py-3 rounded-xl bg-rose-300 text-white font-bold cursor-pointer border-none disabled:opacity-40 hover:bg-rose-400 transition">下一部分：讀解 →</button>
            {vDone < vocabQs.length && <p className="text-xs text-slate-400 mt-2">請回答所有題目後再進入下一部分。</p>}
          </div>
        </div>
      )}

      {/* ─── READING PHASE ─── */}
      {phase === "reading" && (
        <div className="space-y-4">
          {readingData.map((rd: any, pi: number) => (
            <div key={pi}>
              {pi > 0 && <div className="border-t border-dashed border-slate-300 my-6" />}
              <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 mb-4">
                <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">文章 {pi + 1}：</div>
                <p className="text-sm md:text-base leading-7 md:leading-8 text-slate-700 whitespace-pre-line">{rd.passage}</p>
              </div>
              {rd.questions.map((q: any, qi: number) => (
                <div key={qi} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 mb-4">
                  <div className="font-medium text-slate-800 mb-3 text-sm">{qi + 1}. {q.q}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.opts.map((o: string, oi: number) => (
                      <button key={oi} onClick={() => setAns(`r${pi}_${qi}`, oi)}
                        className={`p-2.5 rounded-lg border text-sm text-left cursor-pointer transition ${answers[`r${pi}_${qi}`] === oi ? "bg-blue-50 border-blue-400 font-medium" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>{String.fromCharCode(65 + oi)}. {o}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="text-center py-6">
            <button onClick={() => {
              setStarted(false);
              setPhase("result");
              const s = calcScore();
              const p = Math.round((s.correct / s.total) * 100);
              if (p === 100) playPerfect();
              else if (p >= 60) playVictory();
              else playWrong();
            }} disabled={readingQDone < readingQTotal}
              className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:bg-emerald-700 transition disabled:opacity-40">📊 交卷</button>
            {readingQDone < readingQTotal && <p className="text-xs text-slate-400 mt-2">請回答所有題目後再交卷。</p>}
          </div>
        </div>
      )}
    </div>
  );
}
