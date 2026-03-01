"use client";
import { UI_UNITS as UNITS } from "@/data/upper-intermediate";
import { useState, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { speak, stopSpeaking } from "@/lib/speech";

/* ─── Utils ─── */
const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);
const pick = <T,>(a: T[], n: number): T[] => shuffle(a).slice(0, n);
const r = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

/* ─── Data pools ─── */
const allVocab = UNITS.flatMap(u => u.vocab);
const allQuiz = UNITS.flatMap(u => u.quiz);
const allListening = UNITS.flatMap(u => u.listening);
const allReading = UNITS.flatMap(u => {
  const readings = Array.isArray(u.reading) ? u.reading : [u.reading];
  return readings.flatMap(r => r.questions.map((q, i) => ({ passage: r.passage, ...q })));
});

const SENTENCES = [
  { parts: ["I", "am", "a", "student"], zh: "我是一個學生" },
  { parts: ["She", "likes", "to", "read", "books"], zh: "她喜歡看書" },
  { parts: ["The", "cat", "is", "on", "the", "table"], zh: "貓在桌子上" },
  { parts: ["We", "go", "to", "school", "every", "day"], zh: "我們每天去上學" },
  { parts: ["He", "can", "play", "the", "piano"], zh: "他會彈鋼琴" },
  { parts: ["They", "are", "playing", "in", "the", "park"], zh: "他們在公園裡玩" },
  { parts: ["Do", "you", "like", "ice", "cream"], zh: "你喜歡冰淇淋嗎" },
  { parts: ["My", "mother", "cooks", "dinner", "every", "evening"], zh: "我媽媽每天晚上煮晚餐" },
  { parts: ["I", "want", "to", "be", "a", "doctor"], zh: "我想當醫生" },
  { parts: ["The", "weather", "is", "nice", "today"], zh: "今天天氣很好" },
  { parts: ["She", "went", "to", "the", "supermarket", "yesterday"], zh: "她昨天去了超市" },
  { parts: ["There", "are", "many", "students", "in", "our", "class"], zh: "我們班有很多學生" },
];

const READALOUD = [
  { text: "I like to eat apples.", zh: "我喜歡吃蘋果。" },
  { text: "The cat is sleeping on the bed.", zh: "貓在床上睡覺。" },
  { text: "She goes to school by bus.", zh: "她搭公車上學。" },
  { text: "My father is a doctor.", zh: "我爸爸是醫生。" },
  { text: "We play basketball after school.", zh: "我們放學後打籃球。" },
  { text: "It is sunny today.", zh: "今天是晴天。" },
  { text: "Can you help me, please?", zh: "你可以幫我嗎？" },
  { text: "I usually get up at seven o'clock.", zh: "我通常七點起床。" },
  { text: "Do you like to listen to music?", zh: "你喜歡聽音樂嗎？" },
  { text: "We should be kind to everyone.", zh: "我們應該對每個人友善。" },
  { text: "I need to go to the supermarket.", zh: "我需要去超市。" },
  { text: "The weather is getting colder.", zh: "天氣越來越冷了。" },
];

/* ─── Types ─── */
type GameMode = "menu" | "vocab" | "spelling" | "listening" | "readaloud" | "reading" | "sentence" | "cloze" | "result";

const GAMES = [
  { id: "vocab" as GameMode, icon: "📚", title: "單字大冒險", desc: "看英文猜中文", color: "#f59e0b", skill: "讀" },
  { id: "spelling" as GameMode, icon: "🔤", title: "拼字高手", desc: "看提示拼出單字", color: "#ff6b35", skill: "寫" },
  { id: "listening" as GameMode, icon: "🎧", title: "聽力挑戰", desc: "聽問題選答案", color: "#2563eb", skill: "聽" },
  { id: "readaloud" as GameMode, icon: "🗣️", title: "跟讀挑戰", desc: "唸句子拿分數", color: "#dc2626", skill: "說" },
  { id: "sentence" as GameMode, icon: "✍️", title: "句子排排站", desc: "排出正確句子", color: "#7c3aed", skill: "寫" },
  { id: "cloze" as GameMode, icon: "🧩", title: "填空小達人", desc: "選正確的字", color: "#ec4899", skill: "寫" },
  { id: "reading" as GameMode, icon: "📖", title: "閱讀理解", desc: "讀短文答問題", color: "#059669", skill: "讀" },
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
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(false);
  // Sentence game
  const [sentArr, setSentArr] = useState<any[]>([]);
  const [sentRem, setSentRem] = useState<any[]>([]);
  // ReadAloud
  const [recording, setRecording] = useState(false);
  const [raResult, setRaResult] = useState<any>(null);
  const [matchedWords, setMatchedWords] = useState<number[]>([]);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) setSupported(false);
    }
  }, []);

  // Stop speech when leaving page
  useEffect(() => { return () => { stopSpeaking(); }; }, []);

  const startGame = (m: GameMode) => {
    setMode(m); setScore(0); setCombo(0); setQi(0); setSel(null); setShow(false); setInput(""); setHint(false);
    setRaResult(null); setMatchedWords([]); setRecording(false);

    switch (m) {
      case "vocab": {
        const qs = pick(allVocab, 10).map(w => {
          const wrong = shuffle(allVocab.filter(v => v.en !== w.en)).slice(0, 3).map(v => v.zh);
          const opts = shuffle([w.zh, ...wrong]);
          return { q: w.en, opts, ans: opts.indexOf(w.zh), audio: w.en, pts: 15 };
        });
        setQuestions(qs); setTotal(10); break;
      }
      case "spelling": setQuestions(pick(allVocab, 35)); setTotal(35); break;
      case "listening": setQuestions(pick(allListening, 8)); setTotal(8); break;
      case "readaloud": setQuestions(pick(READALOUD, 6)); setTotal(6); break;
      case "reading": {
        const rawRd = UNITS[r(0, UNITS.length - 1)].reading;
        const rds = Array.isArray(rawRd) ? rawRd : [rawRd];
        const rd = rds[r(0, rds.length - 1)];
        setQuestions(rd.questions.map(q => ({ ...q, passage: rd.passage }))); setTotal(rd.questions.length); break;
      }
      case "sentence": {
        const qs = pick(SENTENCES, 8);
        setQuestions(qs); setTotal(8);
        setSentArr([]); setSentRem(shuffle(qs[0].parts.map((p: string, i: number) => ({ t: p, id: `0-${i}` }))));
        break;
      }
      case "cloze": setQuestions(pick(allQuiz, 10)); setTotal(10); break;
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
    setQi(q => q + 1); setSel(null); setShow(false); setInput(""); setHint(false);
    setRaResult(null); setMatchedWords([]);
  };

  const handleSpelling = () => {
    if (show || !questions[qi]) return;
    setShow(true);
    const isOk = input.trim().toLowerCase() === questions[qi].en.toLowerCase();
    addPt(hint ? 8 : 15, isOk);
    setTimeout(() => advance(), 1400);
  };

  const handleSentenceCheck = () => {
    const isOk = sentArr.map((w: any) => w.t).join(" ") === questions[qi].parts.join(" ");
    setShow(true); addPt(15, isOk);
    setTimeout(() => advance(), 1300);
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = "en-US"; recog.interimResults = false; recog.maxAlternatives = 3;
    recog.onresult = (e: any) => {
      const target = questions[qi].text.toLowerCase().replace(/[^\w\s]/g, "");
      const targetWords = target.split(/\s+/);
      let bestScore = 0;
      let bestTranscript = "";
      const mw: number[] = [];

      for (let i = 0; i < e.results[0].length; i++) {
        const transcript = e.results[0][i].transcript.toLowerCase().replace(/[^\w\s]/g, "");
        const spokenWords = transcript.split(/\s+/);
        let matched = 0;
        const tempMw: number[] = [];
        targetWords.forEach((tw: string, idx: number) => {
          if (spokenWords.some((sw: string) => sw === tw || (tw.length > 3 && sw.includes(tw)))) {
            matched++; tempMw.push(idx);
          }
        });
        const sc = matched / targetWords.length;
        if (sc > bestScore) { bestScore = sc; bestTranscript = transcript; mw.length = 0; mw.push(...tempMw); }
      }

      const pct = Math.round(bestScore * 100);
      const pts = Math.round(bestScore * 20);
      setRaResult({ transcript: bestTranscript, pct, pts });
      setMatchedWords(mw); setShow(true); setRecording(false);
      if (pct >= 90) playPerfect();
      else addPt(pts, pct >= 50);
      // Don't auto-advance - let user retry or manually continue
    };
    recog.onerror = () => setRecording(false);
    recog.onend = () => setRecording(false);
    recog.start(); setRecording(true);
  };

  const retryReadaloud = () => {
    setRaResult(null); setMatchedWords([]); setShow(false); setRecording(false);
  };

  /* ─── Menu ─── */
  if (mode === "menu") return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🎮</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">綜合遊戲練習</h1>
        <p className="text-slate-500">7 種遊戲模式，聽說讀寫全面複習！</p>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {["聽", "說", "讀", "寫"].map(s => (
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
        <a href="/upper-intermediate" className="text-blue-600 text-sm hover:underline">← 返回初級首頁</a>
      </div>
    </div>
  );

  /* ─── Result ─── */
  if (mode === "result") {
    const maxPts = (() => {
      switch (true) {
        case questions[0]?.pts !== undefined: return total * 15;
        default: return total * 15;
      }
    })();
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

        {/* ─── VOCAB ─── */}
        {mode === "vocab" && (
          <>
            <div className="text-center mb-6">
              <button onClick={() => speak(q.audio)} className="text-lg bg-transparent border-none cursor-pointer">🔊</button>
              <div className="text-3xl font-black text-slate-800 mt-2">{q.q}</div>
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

        {/* ─── SPELLING ─── */}
        {mode === "spelling" && (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl font-black" style={{ color: gameInfo?.color }}>{q.zh}</div>
              <div className="text-sm text-slate-400 mt-2">請拼出這個單字的英文</div>
              {hint && (
                <div className="mt-2 text-lg font-mono font-semibold tracking-widest" style={{ color: gameInfo?.color }}>
                  {q.en.split("").map((ch: string, i: number) => (i === 0 || i === q.en.length - 1 || ch === " ") ? ch : "_").join(" ")}
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-4">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && input.trim() && handleSpelling()}
                disabled={show} placeholder="輸入英文..." autoComplete="off"
                className="flex-1 p-3 rounded-xl border border-slate-200 text-xl text-center font-mono font-semibold tracking-wider focus:outline-none focus:border-blue-400" onFocus={e => setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300)} />
            </div>
            <div className="flex gap-2 justify-center">
              {!hint && !show && <button onClick={() => setHint(true)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 cursor-pointer bg-transparent hover:bg-slate-50">💡 提示 (-7分)</button>}
              {input.trim() && !show && <button onClick={handleSpelling} className="px-6 py-2 rounded-lg text-white font-bold cursor-pointer border-none" style={{ background: gameInfo?.color }}>確認 ✓</button>}
            </div>
            {show && (
              <div className={`text-center mt-4 font-semibold ${input.trim().toLowerCase() === q.en.toLowerCase() ? "text-emerald-600" : "text-red-500"}`}>
                {input.trim().toLowerCase() === q.en.toLowerCase() ? `✅ 正確！${q.en}` : `❌ 答案是 "${q.en}"`}
                <button onClick={() => speak(q.en)} className="ml-2 bg-transparent border-none cursor-pointer text-base">🔊</button>
              </div>
            )}
          </>
        )}

        {/* ─── LISTENING ─── */}
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

        {/* ─── READ ALOUD ─── */}
        {mode === "readaloud" && (
          <>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div className="text-lg font-semibold text-slate-800 leading-8">
                {q.text.split(/\s+/).map((word: string, i: number) => (
                  <span key={i} className="transition" style={{
                    color: show ? (matchedWords.includes(i) ? "#059669" : "#ef4444") : "#1e293b",
                    fontWeight: show && matchedWords.includes(i) ? 700 : 500,
                  }}>{word} </span>
                ))}
              </div>
              <div className="text-sm text-slate-400 mt-2">{q.zh}</div>
            </div>
            <div className="flex gap-3 justify-center mb-5">
              <button onClick={() => speak(q.text, 0.8)} className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 text-sm cursor-pointer">🔊 先聽一次</button>
            </div>
            {!supported ? (
              <div className="text-center text-slate-400 text-sm">😢 請使用 Chrome 瀏覽器以支援語音辨識</div>
            ) : (
              <div className="text-center">
                <button onClick={recording ? undefined : startRecording} disabled={show}
                  className={`w-20 h-20 rounded-full text-3xl cursor-pointer transition border-3 ${recording ? "animate-pulse" : "hover:scale-105"}`}
                  style={{ borderColor: recording ? "#ef4444" : "#dc2626", background: recording ? "#fee2e2" : "#fef2f2" }}>
                  {recording ? "🎤" : "🎙️"}
                </button>
                <div className="text-sm text-slate-400 mt-2">{recording ? "正在聽...大聲唸！" : show ? "" : "點擊開始錄音"}</div>
              </div>
            )}
            {show && raResult && (
              <div className="text-center mt-4 animate-fadeIn">
                <div className={`inline-block px-6 py-3 rounded-xl ${raResult.pct >= 80 ? "bg-emerald-50 border-emerald-300" : raResult.pct >= 50 ? "bg-amber-50 border-amber-300" : "bg-red-50 border-red-300"} border`}>
                  <div className="text-3xl font-black" style={{ color: raResult.pct >= 80 ? "#059669" : raResult.pct >= 50 ? "#f59e0b" : "#ef4444" }}>{raResult.pct}%</div>
                  <div className="text-sm text-slate-500 mt-1">{raResult.pct >= 80 ? "🌟 發音超棒！" : raResult.pct >= 50 ? "👍 不錯唷！" : "💪 再試試看！"}</div>
                </div>
                {raResult.transcript && <div className="text-xs text-slate-400 mt-2">你說的：&quot;{raResult.transcript}&quot;</div>}
                <div className="flex gap-3 justify-center mt-4">
                  <button onClick={retryReadaloud}
                    className="px-5 py-2.5 rounded-xl border-2 border-red-300 text-red-600 font-semibold text-sm cursor-pointer bg-white hover:bg-red-50 transition">
                    🔄 再唸一次
                  </button>
                  <button onClick={advance}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-red-700 transition">
                    {qi + 1 >= total ? "看結果 →" : "下一句 →"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── SENTENCE ─── */}
        {mode === "sentence" && (
          <>
            <div className="text-center mb-4">
              <div className="font-semibold" style={{ color: gameInfo?.color }}>💡 {q.zh}</div>
            </div>
            <div className="min-h-[48px] p-3 rounded-xl border-2 border-dashed mb-4 flex flex-wrap gap-2 items-center"
              style={{ borderColor: sentArr.length ? gameInfo?.color || "" : "#e2e8f0", background: sentArr.length ? (gameInfo?.color || "") + "06" : "transparent" }}>
              {!sentArr.length && <span className="text-sm text-slate-400">👆 點擊單字排出句子</span>}
              {sentArr.map((w: any) => (
                <button key={w.id} onClick={() => { if (!show) { setSentRem(r => [...r, w]); setSentArr(a => a.filter(x => x.id !== w.id)); } }}
                  className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold cursor-pointer border-none"
                  style={{ background: gameInfo?.color }}>{w.t}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {sentRem.map((w: any) => (
                <button key={w.id} onClick={() => { if (!show) { setSentArr(a => [...a, w]); setSentRem(r => r.filter(x => x.id !== w.id)); } }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold cursor-pointer border border-slate-200 hover:bg-slate-200 transition">{w.t}</button>
              ))}
            </div>
            {sentArr.length === q.parts.length && !show && (
              <div className="text-center">
                <button onClick={handleSentenceCheck} className="px-6 py-2.5 rounded-xl text-white font-bold cursor-pointer border-none" style={{ background: gameInfo?.color }}>確認答案 ✓</button>
              </div>
            )}
            {show && (
              <div className={`text-center mt-3 font-semibold ${sentArr.map((w: any) => w.t).join(" ") === q.parts.join(" ") ? "text-emerald-600" : "text-red-500"}`}>
                {sentArr.map((w: any) => w.t).join(" ") === q.parts.join(" ") ? "✅ 完美！" : `❌ 正確：${q.parts.join(" ")}`}
              </div>
            )}
          </>
        )}

        {/* ─── CLOZE ─── */}
        {mode === "cloze" && (
          <>
            <div className="text-center mb-5">
              <div className="text-lg font-semibold text-slate-800">{q.s}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {q.opts.map((o: string, i: number) => {
                let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                if (show && i === q.ans) cls = "bg-emerald-50 border-emerald-400";
                if (show && i === sel && i !== q.ans) cls = "bg-red-50 border-red-400";
                return <button key={i} onClick={() => handleChoice(i, q.ans, 12)} className={`p-3 rounded-xl border text-sm font-medium text-center transition cursor-pointer active:scale-[0.98] ${cls}`}>{o}</button>;
              })}
            </div>
          </>
        )}

        {/* ─── READING ─── */}
        {mode === "reading" && (
          <>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-sm leading-7 text-slate-700">{q.passage}</div>
            <div className="font-semibold text-slate-800 mb-3">{q.q}</div>
            <div className="space-y-2">
              {q.opts.map((o: string, i: number) => {
                let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
                if (show && i === q.ans) cls = "bg-emerald-50 border-emerald-400";
                if (show && i === sel && i !== q.ans) cls = "bg-red-50 border-red-400";
                return <button key={i} onClick={() => handleChoice(i, q.ans, 20)} className={`w-full text-left p-3 rounded-xl border text-sm transition cursor-pointer active:scale-[0.98] ${cls}`}>{String.fromCharCode(65 + i)}. {o}</button>;
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
