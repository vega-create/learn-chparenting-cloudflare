"use client";
import { N5_UNITS } from "@/data/jlpt-n5";
import type { JlptUnit } from "@/data/jlpt-types";
import { useState, useEffect } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { speakJa as speak } from "@/lib/speech";

/* ─── Utils ─── */
const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);
const pick = <T,>(a: T[], n: number): T[] => shuffle(a).slice(0, n);
const r = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

/* ─── Data pools ─── */
const allVocab = N5_UNITS.flatMap(u => u.vocab);
const allQuiz = N5_UNITS.flatMap(u => u.quiz);
const allListening = N5_UNITS.flatMap(u => u.listening);
const allReading = N5_UNITS.flatMap(u => {
  const readings = Array.isArray(u.reading) ? u.reading : [u.reading];
  return readings.flatMap(rd => rd.questions.map(q => ({ passage: rd.passage, ...q })));
});

/* ─── Sentence data: generated from quiz questions split by common particles ─── */
const SENTENCES = [
  { parts: ["わたしは", "学生", "です"], zh: "我是學生" },
  { parts: ["田中さんは", "日本人", "です"], zh: "田中先生是日本人" },
  { parts: ["これは", "本", "です"], zh: "這是書" },
  { parts: ["わたしは", "毎日", "学校に", "行きます"], zh: "我每天去學校" },
  { parts: ["田中さんは", "先生", "ではありません"], zh: "田中先生不是老師" },
  { parts: ["あの人は", "誰", "ですか"], zh: "那個人是誰？" },
  { parts: ["りんごを", "三つ", "ください"], zh: "請給我三顆蘋果" },
  { parts: ["駅は", "どこ", "ですか"], zh: "車站在哪裡？" },
  { parts: ["今日は", "天気が", "いい", "です"], zh: "今天天氣很好" },
  { parts: ["わたしは", "朝", "六時に", "起きます"], zh: "我早上六點起床" },
  { parts: ["図書館で", "本を", "読みます"], zh: "在圖書館看書" },
  { parts: ["母は", "料理が", "上手", "です"], zh: "媽媽擅長做菜" },
];

/* ─── Types ─── */
type GameMode = "menu" | "vocab" | "reading-quiz" | "listening" | "sentence" | "reading" | "result";

const GAMES = [
  { id: "vocab" as GameMode, icon: "📚", title: "單字測驗", desc: "看日文猜中文意思", color: "#f59e0b", skill: "讀" },
  { id: "reading-quiz" as GameMode, icon: "🔤", title: "讀音測驗", desc: "看日文猜假名讀音", color: "#ff6b35", skill: "讀" },
  { id: "listening" as GameMode, icon: "🎧", title: "聽力挑戰", desc: "聽日文選正確意思", color: "#2563eb", skill: "聽" },
  { id: "sentence" as GameMode, icon: "✍️", title: "句子排排站", desc: "排出正確日文句子", color: "#7c3aed", skill: "寫" },
  { id: "reading" as GameMode, icon: "📖", title: "閱讀理解", desc: "讀日文短文答問題", color: "#059669", skill: "讀" },
];

/* ─── Shared UI ─── */
function ProgressBar({ cur, tot }: { cur: number; tot: number }) {
  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
      <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-emerald-500"
        style={{ width: `${(cur / tot) * 100}%` }} />
    </div>
  );
}

function ScoreBadge({ score, combo }: { score: number; combo: number }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-600 text-sm font-bold">⭐ {score}</span>
      {combo > 1 && <span className="px-3 py-1 rounded-full bg-red-50 border border-red-300 text-red-500 text-sm font-bold animate-pulse">🔥 x{combo}</span>}
    </div>
  );
}

function ResultScreen({ score, total, onBack }: { score: number; total: number; onBack: () => void }) {
  const pct = Math.round((score / Math.max(total, 1)) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  return (
    <div className="max-w-sm mx-auto mt-16 text-center bg-white rounded-2xl p-10 border border-slate-200 shadow-lg animate-slideUp">
      <div className="text-5xl mb-4">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">
        {pct >= 90 ? "太厲害了！🎉" : pct >= 60 ? "做得好！👏" : "繼續加油！💪"}
      </h2>
      <div className="text-5xl font-black text-amber-500 my-4">{score} 分</div>
      <div className="text-slate-400 mb-6">正確率 {pct}%</div>
      <button onClick={onBack} className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold cursor-pointer border-none text-base hover:opacity-90 transition">
        回到選單
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Game Component
   ═══════════════════════════════════════════════════════════════ */
export default function GamePage() {
  const [mode, setMode] = useState<GameMode>("menu");
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  // Sentence game
  const [sentArr, setSentArr] = useState<any[]>([]);
  const [sentRem, setSentRem] = useState<any[]>([]);

  // Stop speech when leaving page
  useEffect(() => { return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }; }, []);

  const startGame = (m: GameMode) => {
    setMode(m); setScore(0); setCombo(0); setQi(0); setSel(null); setShow(false);

    switch (m) {
      case "vocab": {
        const qs = pick(allVocab, 10).map(w => {
          const wrong = shuffle(allVocab.filter(v => v.zh !== w.zh)).slice(0, 3).map(v => v.zh);
          const opts = shuffle([w.zh, ...wrong]);
          return { q: w.ja, reading: w.reading, opts, ans: opts.indexOf(w.zh), audio: w.ja, pts: 15 };
        });
        setQuestions(qs); setTotal(10); break;
      }
      case "reading-quiz": {
        // Only use words where ja differs from reading (has kanji)
        const kanjiWords = allVocab.filter(v => v.ja !== v.reading);
        const pool = kanjiWords.length >= 10 ? kanjiWords : allVocab;
        const qs = pick(pool, 10).map(w => {
          const wrong = shuffle(pool.filter(v => v.reading !== w.reading)).slice(0, 3).map(v => v.reading);
          const opts = shuffle([w.reading, ...wrong]);
          return { q: w.ja, zh: w.zh, opts, ans: opts.indexOf(w.reading), correctReading: w.reading, pts: 15 };
        });
        setQuestions(qs); setTotal(10); break;
      }
      case "listening": {
        const qs = pick(allListening, 10).map(lq => ({
          ...lq,
          pts: 15,
        }));
        setQuestions(qs); setTotal(10); break;
      }
      case "sentence": {
        const qs = pick(SENTENCES, 10);
        setQuestions(qs); setTotal(10);
        setSentArr([]); setSentRem(shuffle(qs[0].parts.map((p: string, i: number) => ({ t: p, id: `0-${i}` }))));
        break;
      }
      case "reading": {
        const rawRd = N5_UNITS[r(0, N5_UNITS.length - 1)].reading;
        const rds = Array.isArray(rawRd) ? rawRd : [rawRd];
        const rd = rds[r(0, rds.length - 1)];
        const qs = rd.questions.map(q => ({ ...q, passage: rd.passage }));
        setQuestions(qs); setTotal(Math.min(qs.length, 10)); break;
      }
    }
  };

  // Auto-play listening audio
  useEffect(() => {
    if (mode === "listening" && questions[qi]) setTimeout(() => speak(questions[qi].text, 0.8), 300);
  }, [qi, mode, questions]);

  // Victory sound on game complete
  useEffect(() => {
    if (mode === "result") playVictory();
  }, [mode]);

  // Init sentence game on qi change
  useEffect(() => {
    if (mode === "sentence" && questions[qi] && !show) {
      setSentArr([]);
      setSentRem(shuffle(questions[qi].parts.map((p: string, i: number) => ({ t: p, id: `${qi}-${i}` }))));
    }
  }, [qi, mode, questions, show]);

  const addPt = (pts: number, isOk: boolean) => {
    if (isOk) { setScore(s => s + pts + combo * 3); setCombo(c => c + 1); playCorrect(); }
    else { setCombo(0); playWrong(); }
  };

  const handleChoice = (idx: number, correctAns: number, pts: number) => {
    if (show) return;
    setSel(idx); setShow(true);
    addPt(pts, idx === correctAns);
    setTimeout(() => advance(), 1300);
  };

  const advance = () => {
    if (qi + 1 >= total) { setMode("result"); return; }
    setQi(q => q + 1); setSel(null); setShow(false);
  };

  const handleSentenceCheck = () => {
    const isOk = sentArr.map((w: any) => w.t).join("") === questions[qi].parts.join("");
    setShow(true); addPt(15, isOk);
    setTimeout(() => advance(), 1300);
  };

  /* ─── Menu ─── */
  if (mode === "menu") return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🎮</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">綜合遊戲練習</h1>
        <p className="text-slate-500">5 種遊戲模式，全面複習 JLPT N5！</p>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {["聽", "讀", "寫"].map(s => (
            <span key={s} className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">{s}</span>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {GAMES.map(g => (
          <button key={g.id} onClick={() => startGame(g.id)}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover-lift text-left cursor-pointer transition">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: g.color + "15" }}>{g.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-slate-800 text-base">{g.title}</div>
              <div className="text-sm text-slate-400 mt-0.5">{g.desc}</div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: g.color + "15", color: g.color }}>{g.skill}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a href="/jlpt-n5" className="text-blue-600 text-sm hover:underline">← 返回 JLPT N5 首頁</a>
      </div>
    </div>
  );

  /* ─── Result ─── */
  if (mode === "result") {
    const maxPts = total * 15;
    return <ResultScreen score={score} total={maxPts} onBack={() => setMode("menu")} />;
  }

  const q = questions[qi];
  if (!q) return null;

  const gameInfo = GAMES.find(g => g.id === mode);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setMode("menu")} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer bg-transparent border-none">← 選單</button>
        <span className="text-lg">{gameInfo?.icon}</span>
        <span className="font-bold text-sm" style={{ color: gameInfo?.color }}>{gameInfo?.title}</span>
        <span className="text-xs text-slate-400 ml-auto">{qi + 1}/{total}</span>
      </div>
      <ProgressBar cur={qi + 1} tot={total} />
      <div className="flex justify-end mb-3"><ScoreBadge score={score} combo={combo} /></div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-fadeIn">

        {/* ─── VOCAB QUIZ: Show Japanese, choose Chinese ─── */}
        {mode === "vocab" && (
          <>
            <div className="text-center mb-6">
              <button onClick={() => speak(q.audio)} className="text-lg bg-transparent border-none cursor-pointer">🔊</button>
              <div className="text-3xl font-black text-slate-800 mt-2">{q.q}</div>
              {q.reading && q.q !== q.reading && (
                <div className="text-sm text-slate-400 mt-1">{q.reading}</div>
              )}
              <div className="text-sm text-slate-400 mt-1">這個單字的中文意思是？</div>
            </div>
            <div className="space-y-2">
              {q.opts.map((o: string, i: number) => {
                let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                if (show && i === q.ans) cls = "bg-emerald-50 border-emerald-400";
                if (show && i === sel && i !== q.ans) cls = "bg-red-50 border-red-400";
                return <button key={i} onClick={() => handleChoice(i, q.ans, 15)} className={`w-full text-left p-4 rounded-xl border text-base transition cursor-pointer active:scale-[0.98] ${cls}`}>{o}</button>;
              })}
            </div>
          </>
        )}

        {/* ─── READING QUIZ: Show Japanese word, choose correct reading (假名) ─── */}
        {mode === "reading-quiz" && (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl font-black text-slate-800 mt-2">{q.q}</div>
              <div className="text-sm text-blue-500 mt-1">{q.zh}</div>
              <div className="text-sm text-slate-400 mt-2">這個字的讀音（假名）是？</div>
            </div>
            <div className="space-y-2">
              {q.opts.map((o: string, i: number) => {
                let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                if (show && i === q.ans) cls = "bg-emerald-50 border-emerald-400";
                if (show && i === sel && i !== q.ans) cls = "bg-red-50 border-red-400";
                return <button key={i} onClick={() => handleChoice(i, q.ans, 15)} className={`w-full text-left p-4 rounded-xl border text-base transition cursor-pointer active:scale-[0.98] ${cls}`}>{o}</button>;
              })}
            </div>
            {show && (
              <div className="text-center mt-4 text-sm text-slate-500">
                正確讀音：<span className="font-bold text-emerald-600">{q.correctReading}</span>
                <button onClick={() => speak(q.q)} className="ml-2 bg-transparent border-none cursor-pointer text-base">🔊</button>
              </div>
            )}
          </>
        )}

        {/* ─── LISTENING: Play Japanese audio, choose correct meaning ─── */}
        {mode === "listening" && (
          <>
            <div className="text-center mb-6">
              <button onClick={() => speak(q.text, 0.8)}
                className="w-20 h-20 rounded-full text-3xl cursor-pointer transition hover:scale-105 border-2"
                style={{ borderColor: gameInfo?.color, background: gameInfo?.color + "12" }}>🔊</button>
              <div className="text-sm text-slate-400 mt-2">點擊聽題目</div>
              <div className="text-sm mt-1" style={{ color: gameInfo?.color }}>💡 {q.zh}</div>
            </div>
            <div className="space-y-2">
              {q.opts.map((o: string, i: number) => {
                let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                if (show && i === q.ans) cls = "bg-emerald-50 border-emerald-400";
                if (show && i === sel && i !== q.ans) cls = "bg-red-50 border-red-400";
                return <button key={i} onClick={() => handleChoice(i, q.ans, 15)} className={`w-full text-left p-3.5 rounded-xl border text-sm transition cursor-pointer active:scale-[0.98] ${cls}`}>{String.fromCharCode(65 + i)}. {o}</button>;
              })}
            </div>
          </>
        )}

        {/* ─── SENTENCE ORDERING: Arrange Japanese sentence parts ─── */}
        {mode === "sentence" && (
          <>
            <div className="text-center mb-4">
              <div className="font-semibold" style={{ color: gameInfo?.color }}>💡 {q.zh}</div>
            </div>
            <div className="min-h-[48px] p-3 rounded-xl border-2 border-dashed mb-4 flex flex-wrap gap-2 items-center"
              style={{ borderColor: sentArr.length ? gameInfo?.color || "" : "#e2e8f0", background: sentArr.length ? (gameInfo?.color || "") + "06" : "transparent" }}>
              {!sentArr.length && <span className="text-sm text-slate-400">👆 點擊單字排出句子</span>}
              {sentArr.map((w: any) => (
                <button key={w.id} onClick={() => { if (!show) { setSentRem(rem => [...rem, w]); setSentArr(a => a.filter(x => x.id !== w.id)); } }}
                  className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold cursor-pointer border-none"
                  style={{ background: gameInfo?.color }}>{w.t}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {sentRem.map((w: any) => (
                <button key={w.id} onClick={() => { if (!show) { setSentArr(a => [...a, w]); setSentRem(rem => rem.filter(x => x.id !== w.id)); } }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold cursor-pointer border border-slate-200 hover:bg-slate-200 transition">{w.t}</button>
              ))}
            </div>
            {sentArr.length === q.parts.length && !show && (
              <div className="text-center">
                <button onClick={handleSentenceCheck} className="px-6 py-2.5 rounded-xl text-white font-bold cursor-pointer border-none" style={{ background: gameInfo?.color }}>確認答案 ✓</button>
              </div>
            )}
            {show && (
              <div className={`text-center mt-3 font-semibold ${sentArr.map((w: any) => w.t).join("") === q.parts.join("") ? "text-emerald-600" : "text-red-500"}`}>
                {sentArr.map((w: any) => w.t).join("") === q.parts.join("") ? "✅ 完美！" : `❌ 正確：${q.parts.join("")}`}
              </div>
            )}
          </>
        )}

        {/* ─── READING COMPREHENSION ─── */}
        {mode === "reading" && (
          <>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-sm leading-7 text-slate-700">{q.passage}</div>
            <div className="font-semibold text-slate-800 mb-3">{q.q}</div>
            <div className="space-y-2">
              {q.opts.map((o: string, i: number) => {
                let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                if (show && i === q.ans) cls = "bg-emerald-50 border-emerald-400";
                if (show && i === sel && i !== q.ans) cls = "bg-red-50 border-red-400";
                return <button key={i} onClick={() => handleChoice(i, q.ans, 15)} className={`w-full text-left p-3 rounded-xl border text-sm transition cursor-pointer active:scale-[0.98] ${cls}`}>{String.fromCharCode(65 + i)}. {o}</button>;
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
