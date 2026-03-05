"use client";
import { N2_UNITS } from "@/data/jlpt-n2";
import type { JlptUnit, JlptVocabItem, JlptGrammarPoint, JlptListenQ, JlptReadingSection, JlptQuizQ } from "@/data/jlpt-types";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect } from "@/lib/sounds";
import { speakJa as speak, stopSpeaking, pauseSpeaking, resumeSpeaking } from "@/lib/speech";
import WorksheetActions from "@/components/WorksheetActions";
import EbookModal from "@/components/EbookModal";

/* Speech Recognition types (not natively typed in TS) */
interface SRResult { transcript: string; confidence: number }
interface SRResultList { length: number; [index: number]: SRResult }
interface SREvent { results: { length: number; [index: number]: SRResultList } }
interface SRecognition { lang: string; interimResults: boolean; maxAlternatives: number; onresult: ((e: SREvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void }

const LANG = "ja-JP";

const TABS = [
  { id: "vocab", label: "📖 單字" },
  { id: "grammar", label: "📝 文法" },
  { id: "speaking", label: "🎙️ 口說" },
  { id: "listening", label: "🎧 聽力" },
  { id: "reading", label: "📗 閱讀" },
  { id: "quiz", label: "✏️ 測驗" },
];

export default function JlptUnitPage() {
  const params = useParams();
  const router = useRouter();
  const uid = Number(params.id);
  const unit = N2_UNITS.find(u => u.id === uid);
  const [tab, setTab] = useState("vocab");
  const tabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabRef.current) {
      const activeBtn = tabRef.current.querySelector('[data-active="true"]');
      if (activeBtn) activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [tab]);

  useEffect(() => { stopSpeaking(); window.scrollTo({ top: 0, behavior: "smooth" }); }, [tab]);
  useEffect(() => { return () => { stopSpeaking(); }; }, []);

  if (!unit) return <div className="text-center py-20">找不到此單元</div>;
  const unitId = `unit-${String(uid).padStart(2, "0")}`;

  const nextUnit = N2_UNITS.find(u => u.id === uid + 1);
  const prevUnit = N2_UNITS.find(u => u.id === uid - 1);

  return (
    <div>
      <div className="text-white py-4 md:py-6 px-4" style={{ background: unit.color }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/jlpt-n2")}
            className="bg-white/20 border-none text-white text-sm rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-white/30 transition flex-shrink-0">←</button>
          <span className="text-2xl md:text-3xl">{unit.icon}</span>
          <div className="min-w-0">
            <div className="text-xs opacity-80">Unit {unit.id} · {unit.titleJa}</div>
            <div className="text-base md:text-xl font-bold truncate">{unit.title}</div>
          </div>
        </div>
      </div>

      {/* Download & Answer Actions */}
      <div className="max-w-4xl mx-auto px-3 md:px-4 pt-3">
        <WorksheetActions toolSlug="japanese" level="n2" unitId={unitId} unitName={unit.title} color="amber" />
      </div>

      <div ref={tabRef} className="flex border-b border-slate-200 bg-white overflow-x-auto sticky top-14 z-40">
        {TABS.map(t => (
          <button key={t.id} data-active={tab === t.id} onClick={() => setTab(t.id)}
            className={`px-4 md:px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 ${
              tab === t.id ? "font-bold" : "border-transparent text-slate-400"
            }`} style={tab === t.id ? { borderColor: unit.color, color: unit.color } : {}}>{t.label}</button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6 animate-fadeIn">
        {tab === "vocab" && <VocabTab unit={unit} />}
        {tab === "grammar" && <GrammarTab unit={unit} />}
        {tab === "speaking" && <SpeakingTab key={uid + "s"} unit={unit} />}
        {tab === "listening" && <ListeningTab key={uid + "l"} unit={unit} />}
        {tab === "reading" && <ReadingTab key={uid + "r"} unit={unit} />}
        {tab === "quiz" && <QuizTab key={uid + "q"} unit={unit} />}
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8 flex justify-between items-center gap-3">
        {prevUnit ? (
          <button onClick={() => { router.push(`/jlpt-n2/unit/${prevUnit.id}`); setTab("vocab"); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 transition">
            ← {prevUnit.icon}
          </button>
        ) : <div />}
        {nextUnit ? (
          <button onClick={() => { router.push(`/jlpt-n2/unit/${nextUnit.id}`); setTab("vocab"); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-bold cursor-pointer border-none hover:opacity-90 transition"
            style={{ background: nextUnit.color }}>
            {nextUnit.icon} Unit {nextUnit.id} →
          </button>
        ) : (
          <a href="/jlpt-n2/game" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold no-underline hover:bg-amber-600 transition">
            🎮 去遊戲練習 →
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Vocab Tab (Japanese: ja + reading + zh) ─── */
function VocabTab({ unit }: { unit: JlptUnit }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">點擊卡片看例句，點 🔊 聽日文發音</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
        {unit.vocab.map((w: JlptVocabItem, i: number) => (
          <div key={i} onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
            className="p-3.5 md:p-4 rounded-xl cursor-pointer transition-all border active:scale-[0.98]"
            style={{ background: flipped[i] ? unit.color + "08" : "white", borderColor: flipped[i] ? unit.color + "40" : "#e2e8f0" }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xl font-bold text-slate-800">{w.ja}</span>
                {w.ja !== w.reading && <span className="text-sm text-slate-400 ml-2">({w.reading})</span>}
                <span className="text-xs text-slate-400 ml-2 italic">{w.pos}</span>
                <div className="text-sm font-semibold mt-0.5" style={{ color: unit.color }}>{w.zh}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); speak(w.reading); }}
                className="text-xl bg-transparent border-none cursor-pointer p-2 -mr-1 -mt-1 active:scale-90 transition">🔊</button>
            </div>
            {flipped[i] && (
              <div className="mt-2.5 pt-2.5 border-t border-dashed border-slate-200 animate-fadeIn">
                <p className="text-sm text-slate-700">{w.ex}</p>
                <p className="text-xs text-slate-400 mt-1">{w.exZh}</p>
                <button onClick={e => { e.stopPropagation(); speak(w.ex, 0.8); }}
                  className="mt-2 text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-transparent cursor-pointer text-slate-500 active:bg-slate-100 transition">🔊 聽例句</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Grammar Tab ─── */
function GrammarTab({ unit }: { unit: JlptUnit }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="space-y-3">
      {unit.grammar.map((g: JlptGrammarPoint, i: number) => (
        <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200 shadow-sm"
          style={{ borderLeftWidth: 4, borderLeftColor: unit.color }}>
          <div onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="flex justify-between items-center cursor-pointer">
            <h4 className="text-base font-bold m-0" style={{ color: unit.color }}>{g.title}</h4>
            <span className="text-slate-400 p-1">{openIdx === i ? "▲" : "▼"}</span>
          </div>
          {openIdx === i && (
            <div className="mt-3 animate-fadeIn">
              <div className="whitespace-pre-line text-slate-600 text-sm leading-7">{g.explain}</div>
              <div className="mt-3 p-3 rounded-xl" style={{ background: unit.color + "08" }}>
                <div className="text-xs font-semibold mb-2" style={{ color: unit.color }}>📌 例句</div>
                {g.examples.map((ex: string, j: number) => (
                  <div key={j} className="mb-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => speak(ex, 0.8)}
                        className="bg-transparent border-none cursor-pointer text-base p-1 active:scale-90 transition flex-shrink-0">🔊</button>
                      <span className="text-sm text-slate-800 font-medium">{ex}</span>
                    </div>
                    {g.examplesZh[j] && <div className="text-xs text-slate-400 ml-8">{g.examplesZh[j]}</div>}
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-xl bg-amber-50 flex gap-2 items-start">
                <span className="flex-shrink-0">💡</span>
                <span className="text-sm text-amber-800">{g.tip}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Speaking Tab ─── */
function SpeakingTab({ unit }: { unit: JlptUnit }) {
  useEffect(() => { return () => { stopSpeaking(); }; }, []);
  const [subMode, setSubMode] = useState<"word" | "sentence">("word");
  const [wordIdx, setWordIdx] = useState(0);
  const [sentIdx, setSentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<{ transcript: string; pct: number; matchedWords: number[] } | null>(null);
  const [supported, setSupported] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = window as unknown as Record<string, unknown>;
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!SR) setSupported(false);
    }
  }, []);

  const words = unit.vocab;
  const sentences = unit.listening;
  const resetForNew = () => { setResult(null); setAttempts(0); setBestScore(0); setShowText(false); };

  /** 日文正規化：漢字數字→阿拉伯、ぐ↔く等發音等價 */
  const normalizeJa = (s: string) => {
    let t = s.replace(/[。、！？「」（）\s・]/g, "");
    // 漢字數字→阿拉伯（常見）
    const kanjiMap: Record<string, string> = { '一': '1', '二': '2', '三': '3', '四': '4', '五': '5', '六': '6', '七': '7', '八': '8', '九': '9', '十': '10', '百': '100', '千': '1000', '万': '10000', '零': '0' };
    // 處理複合數字：十一→11, 二十→20, etc.
    t = t.replace(/十([一二三四五六七八九])/g, (_, d) => '1' + kanjiMap[d]);
    t = t.replace(/([二三四五六七八九])十/g, (_, d) => kanjiMap[d] + '0');
    for (const [k, v] of Object.entries(kanjiMap)) t = t.replaceAll(k, v);
    // 發音等價
    t = t.replace(/ぐ/g, 'く').replace(/グ/g, 'ク');   // ぐらい = くらい
    t = t.replace(/づ/g, 'ず').replace(/ヅ/g, 'ズ');   // つづく = つずく
    t = t.replace(/ぢ/g, 'じ').replace(/ヂ/g, 'ジ');   // はなぢ = はなじ
    t = t.replace(/を/g, 'お').replace(/ヲ/g, 'オ');   // を → お (pronunciation)
    t = t.replace(/は([^行])/g, 'わ$1');               // 助詞 は → わ
    // 全形→半形數字
    t = t.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFF10 + 0x30));
    return t;
  };

  const scoreJaResult = (targetText: string, allTranscripts: string[][]) => {
    const target = normalizeJa(targetText);
    const targetChars = Array.from(target);
    let bestPct = 0;
    let bestTranscript = "";
    const bestMatched: number[] = [];

    for (const alternatives of allTranscripts) {
      for (const raw of alternatives) {
        const transcript = normalizeJa(raw);
        const spokenChars = Array.from(transcript);
        const matched: number[] = [];
        targetChars.forEach((tc: string, idx: number) => {
          if (spokenChars.includes(tc)) matched.push(idx);
        });
        const pct = Math.round((matched.length / targetChars.length) * 100);
        if (pct > bestPct) { bestPct = pct; bestTranscript = raw; bestMatched.length = 0; bestMatched.push(...matched); }
      }
    }

    setResult({ transcript: bestTranscript, pct: bestPct, matchedWords: bestMatched });
    setAttempts(a => a + 1);
    setBestScore(s => Math.max(s, bestPct));
    setRecording(false);
    if (bestPct >= 90) playPerfect();
    else if (bestPct >= 50) playCorrect();
    else playWrong();
  };

  const startRecording = (targetText: string, isSentence = false) => {
    const w = window as unknown as Record<string, unknown>;
    const SRClass = (w.SpeechRecognition || w.webkitSpeechRecognition) as { new(): SRecognition } | undefined;
    if (!SRClass) return;
    const recog = new SRClass();
    recog.lang = LANG; recog.interimResults = false; recog.maxAlternatives = 5;

    if (isSentence) {
      (recog as any).continuous = true;
      const collected: string[][] = [];
      let stopTimer: ReturnType<typeof setTimeout>;
      const charCount = targetText.replace(/[。、！？「」（）\s]/g, "").length;
      const duration = Math.min(15000, Math.max(5000, charCount * 400));

      recog.onresult = ((e: any) => {
        for (let r = 0; r < e.results.length; r++) {
          if (e.results[r].isFinal && !collected[r]) {
            const alts: string[] = [];
            for (let a = 0; a < e.results[r].length; a++) {
              alts.push(e.results[r][a].transcript);
            }
            collected[r] = alts;
          }
        }
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => { try { recog.stop(); } catch {} }, 2000);
      }) as any;

      recog.onend = () => {
        clearTimeout(stopTimer);
        if (collected.length > 0) {
          const merged: string[][] = [];
          const fullTranscript = collected.map(alts => alts[0]).join("");
          merged.push([fullTranscript]);
          for (const alts of collected) merged.push(alts);
          scoreJaResult(targetText, merged);
        } else {
          setRecording(false);
        }
      };
      recog.onerror = () => { clearTimeout(stopTimer); setRecording(false); };

      recog.start();
      setRecording(true);
      setResult(null);
      setTimeout(() => { try { recog.stop(); } catch {} }, duration);
    } else {
      recog.onresult = ((e: SREvent) => {
        const alts: string[] = [];
        for (let i = 0; i < e.results[0].length; i++) {
          alts.push(e.results[0][i].transcript);
        }
        scoreJaResult(targetText, [alts]);
      }) as any;
      recog.onerror = () => setRecording(false);
      recog.onend = () => setRecording(false);
      recog.start();
      setRecording(true);
      setResult(null);
    }
  };

  const getScoreEmoji = (pct: number) => pct >= 90 ? "🌟" : pct >= 70 ? "😊" : pct >= 50 ? "💪" : "🔄";
  const getScoreLabel = (pct: number) => pct >= 90 ? "太厲害了！" : pct >= 70 ? "很不錯！" : pct >= 50 ? "加油，再試一次！" : "沒關係，多聽幾次再試！";
  const getScoreColor = (pct: number) => pct >= 90 ? "#059669" : pct >= 70 ? "#2563eb" : pct >= 50 ? "#f59e0b" : "#ef4444";

  if (!supported) return (
    <div className="bg-white rounded-xl p-8 border border-slate-200 text-center">
      <div className="text-4xl mb-3">😅</div>
      <h3 className="font-bold text-slate-800 mb-2">你的瀏覽器不支援語音辨識</h3>
      <p className="text-sm text-slate-500">請使用 Chrome 或 Edge 瀏覽器來使用口說練習功能</p>
    </div>
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setSubMode("word"); resetForNew(); setWordIdx(0); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer ${subMode === "word" ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-500"}`}
          style={subMode === "word" ? { background: unit.color } : {}}>🔤 單字發音</button>
        <button onClick={() => { setSubMode("sentence"); resetForNew(); setSentIdx(0); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition cursor-pointer ${subMode === "sentence" ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-500"}`}
          style={subMode === "sentence" ? { background: unit.color } : {}}>💬 句子跟讀</button>
      </div>

      {subMode === "word" && (
        <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: unit.color + "15", color: unit.color }}>
              {wordIdx + 1} / {words.length}
            </span>
            {bestScore > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">最高 {bestScore}%</span>}
          </div>
          <div className="text-center py-4">
            <div className="text-4xl md:text-5xl font-black text-slate-800 mb-1">{words[wordIdx].ja}</div>
            {words[wordIdx].ja !== words[wordIdx].reading && (
              <div className="text-lg text-slate-400 mb-1">{words[wordIdx].reading}</div>
            )}
            <div className="text-lg font-medium mb-1" style={{ color: unit.color }}>{words[wordIdx].zh}</div>
            <div className="text-xs text-slate-400 italic mb-6">{words[wordIdx].pos}</div>
            <button onClick={() => speak(words[wordIdx].reading, 0.75)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border mb-4 cursor-pointer transition active:scale-95"
              style={{ borderColor: unit.color + "60", color: unit.color }}>🔊 先聽一次</button>
            <div className="my-5">
              <button onClick={() => startRecording(words[wordIdx].ja)} disabled={recording}
                className={`w-24 h-24 rounded-full text-4xl cursor-pointer transition-all border-none ${recording ? "animate-pulse" : "active:scale-90"}`}
                style={{ background: recording ? "#ef4444" : unit.color, color: "white", boxShadow: recording ? "0 0 0 8px rgba(239,68,68,0.2)" : `0 0 0 4px ${unit.color}25` }}>
                {recording ? "⏹️" : "🎙️"}
              </button>
              <div className="text-sm text-slate-400 mt-2">{recording ? "正在聽你說..." : "點擊錄音，大聲唸出來"}</div>
            </div>
            {result && (
              <div className="animate-fadeIn rounded-xl p-4 mb-4" style={{ background: getScoreColor(result.pct) + "10", border: `2px solid ${getScoreColor(result.pct)}30` }}>
                <div className="text-3xl mb-1">{getScoreEmoji(result.pct)}</div>
                <div className="text-2xl font-black mb-1" style={{ color: getScoreColor(result.pct) }}>{result.pct}%</div>
                <div className="text-sm font-medium mb-2" style={{ color: getScoreColor(result.pct) }}>{getScoreLabel(result.pct)}</div>
                <div className="text-xs text-slate-400">聽到的：<span className="font-mono">{result.transcript}</span></div>
              </div>
            )}
            <div className="flex justify-center gap-3 flex-wrap">
              <button onClick={() => { setWordIdx(i => Math.max(0, i - 1)); resetForNew(); }}
                disabled={wordIdx === 0} className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white cursor-pointer disabled:opacity-30">← 上一個</button>
              {result && result.pct < 90 && (
                <button onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer transition"
                  style={{ borderColor: unit.color, color: unit.color }}>🔄 再試一次</button>
              )}
              <button onClick={() => { setWordIdx(i => Math.min(words.length - 1, i + 1)); resetForNew(); }}
                disabled={wordIdx >= words.length - 1}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white border-none cursor-pointer disabled:opacity-30"
                style={{ background: unit.color }}>下一個 →</button>
            </div>
          </div>
        </div>
      )}

      {subMode === "sentence" && (
        <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: unit.color + "15", color: unit.color }}>
              句子 {sentIdx + 1} / {sentences.length}
            </span>
            {bestScore > 0 && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">最高 {bestScore}%</span>}
          </div>
          <div className="text-center py-2">
            <p className="text-sm text-slate-400 mb-4">① 先聽句子 → ② 按錄音唸一遍 → ③ 看結果</p>
            <div className="flex justify-center gap-3 mb-5">
              <button onClick={() => speak(sentences[sentIdx].text, 0.55)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer transition active:scale-95"
                style={{ borderColor: unit.color + "60", color: unit.color }}>🐢 慢速</button>
              <button onClick={() => speak(sentences[sentIdx].text, 0.8)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white border-none cursor-pointer transition active:scale-95"
                style={{ background: unit.color }}>🔊 播放</button>
              <button onClick={() => speak(sentences[sentIdx].text, 1.0)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border cursor-pointer transition active:scale-95"
                style={{ borderColor: unit.color + "60", color: unit.color }}>🐇 快速</button>
            </div>
            <button onClick={() => setShowText(!showText)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 cursor-pointer bg-white mb-4 transition hover:bg-slate-50">
              {showText ? "🙈 隱藏文字" : "👁️ 偷看文字"}
            </button>
            {showText && !result && (
              <div className="bg-slate-50 rounded-xl p-4 mb-4 text-left animate-fadeIn">
                <p className="text-base text-slate-700 leading-7">{sentences[sentIdx].text}</p>
                <p className="text-sm text-slate-400 mt-1">{sentences[sentIdx].zh}</p>
              </div>
            )}
            <div className="my-5">
              <button onClick={() => startRecording(sentences[sentIdx].text, true)} disabled={recording}
                className={`w-24 h-24 rounded-full text-4xl cursor-pointer transition-all border-none ${recording ? "animate-pulse" : "active:scale-90"}`}
                style={{ background: recording ? "#ef4444" : unit.color, color: "white", boxShadow: recording ? "0 0 0 8px rgba(239,68,68,0.2)" : `0 0 0 4px ${unit.color}25` }}>
                {recording ? "⏹️" : "🎙️"}
              </button>
              <div className="text-sm text-slate-400 mt-2">{recording ? "正在聽你說...（說完會自動停止）" : "點擊開始錄音"}</div>
            </div>
            {result && (
              <div className="animate-fadeIn rounded-xl p-5 mb-4 text-left" style={{ background: getScoreColor(result.pct) + "08", border: `2px solid ${getScoreColor(result.pct)}25` }}>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-1">{getScoreEmoji(result.pct)}</div>
                  <div className="text-3xl font-black" style={{ color: getScoreColor(result.pct) }}>{result.pct}%</div>
                  <div className="text-sm font-medium" style={{ color: getScoreColor(result.pct) }}>{getScoreLabel(result.pct)}</div>
                </div>
                <div className="bg-white rounded-xl p-4 mb-3">
                  <div className="text-xs text-slate-400 mb-2 font-medium">原文：</div>
                  <div className="text-base text-slate-700 leading-7">{sentences[sentIdx].text}</div>
                  <div className="text-sm text-slate-400 mt-1">{sentences[sentIdx].zh}</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-xs text-slate-400 mb-2 font-medium">你唸的：</div>
                  <div className="text-sm text-slate-600">{result.transcript || "(未偵測到語音)"}</div>
                </div>
              </div>
            )}
            <div className="flex justify-center gap-3 flex-wrap">
              <button onClick={() => { setSentIdx(i => Math.max(0, i - 1)); resetForNew(); }}
                disabled={sentIdx === 0} className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white cursor-pointer disabled:opacity-30">← 上一句</button>
              {result && result.pct < 90 && (
                <button onClick={() => setResult(null)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border cursor-pointer animate-fadeIn"
                  style={{ borderColor: unit.color, color: unit.color }}>🔄 再試一次</button>
              )}
              <button onClick={() => { setSentIdx(i => Math.min(sentences.length - 1, i + 1)); resetForNew(); }}
                disabled={sentIdx >= sentences.length - 1}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white border-none cursor-pointer disabled:opacity-30"
                style={{ background: unit.color }}>下一句 →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Listening Tab ─── */
function ListeningTab({ unit }: { unit: JlptUnit }) {
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQs, setShuffledQs] = useState<JlptListenQ[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const qs = shuffledQs.length > 0 ? shuffledQs : unit.listening;

  useEffect(() => { setShuffledQs([...unit.listening].sort(() => Math.random() - 0.5)); }, [unit.listening]);
  useEffect(() => { return () => { stopSpeaking(); setIsSpeaking(false); setIsPaused(false); }; }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const interval = setInterval(() => {
      const s = window.speechSynthesis;
      if (!s.speaking && !s.pending) { setIsSpeaking(false); setIsPaused(false); }
      else if (s.paused) { setIsPaused(true); }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const playQuestion = () => { stopSpeaking(); setIsPaused(false); speak(qs[qi].text, 0.8); setIsSpeaking(true); };
  const handlePause = () => { pauseSpeaking(); setIsPaused(true); };
  const handleResume = () => { resumeSpeaking(); setIsPaused(false); };
  const handleStop = () => { stopSpeaking(); setIsSpeaking(false); setIsPaused(false); };
  const handle = (idx: number) => { if (show) return; setSel(idx); setShow(true); if (idx === qs[qi].ans) { setScore(s => s + 1); playCorrect(); } else { playWrong(); } };
  const next = () => { stopSpeaking(); setIsSpeaking(false); setIsPaused(false); setQi(q => q + 1); setSel(null); setShow(false); };
  const resetQuiz = () => { stopSpeaking(); setIsSpeaking(false); setIsPaused(false); setQi(0); setSel(null); setShow(false); setScore(0); setShuffledQs([...unit.listening].sort(() => Math.random() - 0.5)); };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: unit.color + "15", color: unit.color }}>第 {qi + 1} / {qs.length} 題</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">✓ {score}</span>
      </div>
      <div className="text-center my-5">
        <div className="flex justify-center items-center gap-3 mb-3">
          {(!isSpeaking || isPaused) ? (
            <button onClick={isSpeaking && isPaused ? handleResume : playQuestion}
              className="w-20 h-20 rounded-full text-3xl cursor-pointer transition active:scale-95"
              style={{ border: `3px solid ${unit.color}`, background: unit.color + "12" }}>{isPaused ? "▶️" : "🔊"}</button>
          ) : (
            <button onClick={handlePause}
              className="w-20 h-20 rounded-full text-3xl cursor-pointer transition active:scale-95"
              style={{ border: `3px solid ${unit.color}`, background: unit.color + "12" }}>⏸️</button>
          )}
          {isSpeaking && (
            <button onClick={handleStop}
              className="w-12 h-12 rounded-full text-xl cursor-pointer transition active:scale-95 border border-slate-300 bg-white text-slate-500">⏹️</button>
          )}
        </div>
        <div className="text-slate-400 text-sm mt-2">{isSpeaking ? (isPaused ? "已暫停" : "播放中...") : "點擊聽題目"}</div>
        <div className="text-sm mt-1" style={{ color: unit.color }}>💡 {qs[qi].zh}</div>
      </div>
      <div className="space-y-2">
        {qs[qi].opts.map((o: string, i: number) => {
          let cls = "bg-white border-slate-200";
          if (show && i === qs[qi].ans) cls = "bg-emerald-50 border-emerald-400";
          if (show && i === sel && i !== qs[qi].ans) cls = "bg-red-50 border-red-400";
          return (
            <button key={i} onClick={() => handle(i)}
              className={`w-full text-left p-3.5 rounded-xl border text-sm transition active:scale-[0.98] ${cls} ${show ? "" : "cursor-pointer"}`}>
              {String.fromCharCode(65 + i)}. {o}
            </button>
          );
        })}
      </div>
      {show && (
        <div className="text-center mt-5">
          <div className={`font-semibold mb-3 ${sel === qs[qi].ans ? "text-emerald-600" : "text-red-500"}`}>
            {sel === qs[qi].ans ? "✅ 答對了！" : `❌ 正確：${qs[qi].opts[qs[qi].ans]}`}
          </div>
          {qi + 1 < qs.length ? (
            <button onClick={next} className="px-6 py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none min-w-[120px] active:scale-95 transition"
              style={{ background: unit.color }}>下一題 →</button>
          ) : (
            <div>
              <div className="text-emerald-600 font-bold text-lg mb-3">🎉 完成！得分 {score} / {qs.length}</div>
              <button onClick={resetQuiz} className="px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer bg-transparent border-2 active:scale-95 transition"
                style={{ borderColor: unit.color, color: unit.color }}>🔀 重新出題</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Reading Tab ─── */
function ReadingTab({ unit }: { unit: JlptUnit }) {
  const readings = Array.isArray(unit.reading) ? unit.reading : [unit.reading];
  const [pIdx, setPIdx] = useState(0);
  const [sel, setSel] = useState<Record<number, number>>({});
  const [show, setShow] = useState(false);
  const rd = readings[pIdx];
  const allDone = Object.keys(sel).length === rd.questions.length;
  const score = show ? rd.questions.filter((q: { ans: number }, i: number) => sel[i] === q.ans).length : 0;

  return (
    <div>
      {readings.length > 1 && (
        <div className="flex gap-2 mb-3">
          {readings.map((_: JlptReadingSection, i: number) => (
            <button key={i} onClick={() => { setPIdx(i); setSel({}); setShow(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition cursor-pointer ${pIdx === i ? "text-white border-transparent" : "bg-white border-slate-200 text-slate-500"}`}
              style={pIdx === i ? { background: unit.color } : {}}>📗 篇 {i + 1}</button>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200 shadow-sm mb-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: unit.color + "15", color: unit.color }}>文章</span>
          <button onClick={() => speak(rd.passage, 0.8)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-transparent cursor-pointer text-slate-500 active:bg-slate-100 transition">🔊 聽文章</button>
        </div>
        <p className="text-sm md:text-base leading-7 md:leading-8 text-slate-700">{rd.passage}</p>
      </div>
      {rd.questions.map((q: { q: string; opts: string[]; ans: number }, qi: number) => (
        <div key={qi} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-2.5">
          <div className="font-semibold text-slate-800 mb-3 text-sm">{qi + 1}. {q.q}</div>
          <div className="grid grid-cols-2 gap-2">
            {q.opts.map((o: string, oi: number) => {
              let cls = "bg-slate-50 border-transparent";
              if (sel[qi] === oi && !show) cls = "border-current";
              if (show && oi === q.ans) cls = "bg-emerald-50 border-emerald-400";
              if (show && sel[qi] === oi && oi !== q.ans) cls = "bg-red-50 border-red-400";
              return (
                <button key={oi} onClick={() => !show && setSel(s => ({ ...s, [qi]: oi }))}
                  className={`p-2.5 rounded-lg border text-sm text-left transition active:scale-[0.97] ${cls} ${show ? "" : "cursor-pointer"}`}
                  style={sel[qi] === oi && !show ? { borderColor: unit.color, background: unit.color + "08" } : {}}>
                  {String.fromCharCode(65 + oi)}. {o}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="text-center mt-4">
        {!show && allDone && (
          <button onClick={() => { setShow(true); const s = rd.questions.filter((q: { ans: number }, i: number) => sel[i] === q.ans).length; if (s === rd.questions.length) playPerfect(); else if (s >= rd.questions.length / 2) playCorrect(); else playWrong(); }}
            className="px-8 py-3 rounded-xl text-white font-bold cursor-pointer border-none active:scale-95 transition"
            style={{ background: unit.color }}>送出答案</button>
        )}
        {show && <div className="text-emerald-600 font-bold text-lg">得分 {score} / {rd.questions.length}</div>}
      </div>
    </div>
  );
}

/* ─── Quiz Tab ─── */
function QuizTab({ unit }: { unit: JlptUnit }) {
  const [sel, setSel] = useState<Record<number, number>>({});
  const [show, setShow] = useState(false);
  const [shuffled, setShuffled] = useState<JlptQuizQ[]>([]);

  useEffect(() => { setShuffled([...unit.quiz].sort(() => Math.random() - 0.5)); }, [unit.quiz]);
  const qs = shuffled.length > 0 ? shuffled : unit.quiz;
  const allDone = Object.keys(sel).length === qs.length;
  const score = show ? qs.filter((q: JlptQuizQ, i: number) => sel[i] === q.ans).length : 0;
  const [ebookOpen, setEbookOpen] = useState(false);
  const retry = () => { setSel({}); setShow(false); setShuffled([...unit.quiz].sort(() => Math.random() - 0.5)); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">✏️ 綜合測驗</h3>
        {show && <span className={`text-sm font-bold ${score >= 4 ? "text-emerald-600" : "text-red-500"}`}>
          {score >= 4 ? "🎉 通過！" : "💪 再加油！"} {score}/{qs.length}
        </span>}
      </div>
      {qs.map((q: JlptQuizQ, qi: number) => (
        <div key={qi} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-2.5">
          <div className="font-semibold text-slate-800 mb-3">{qi + 1}. {q.s}</div>
          <div className="grid grid-cols-2 gap-2">
            {q.opts.map((o: string, oi: number) => {
              let cls = "bg-slate-50 border-transparent";
              if (sel[qi] === oi && !show) cls = "border-current";
              if (show && oi === q.ans) cls = "bg-emerald-50 border-emerald-400";
              if (show && sel[qi] === oi && oi !== q.ans) cls = "bg-red-50 border-red-400";
              return (
                <button key={oi} onClick={() => !show && setSel(s => ({ ...s, [qi]: oi }))}
                  className={`p-3 rounded-lg border text-sm font-medium text-center transition active:scale-[0.97] ${cls} ${show ? "" : "cursor-pointer"}`}
                  style={sel[qi] === oi && !show ? { borderColor: unit.color, background: unit.color + "08" } : {}}>{o}</button>
              );
            })}
          </div>
          {show && sel[qi] !== q.ans && <div className="mt-2 text-xs text-red-500">正確答案：{q.opts[q.ans]}</div>}
        </div>
      ))}
      <div className="text-center mt-5">
        {!show && allDone && (
          <button onClick={() => { setShow(true); const s = qs.filter((q: JlptQuizQ, i: number) => sel[i] === q.ans).length; if (s === qs.length) playPerfect(); else if (s >= qs.length / 2) playCorrect(); else playWrong(); }}
            className="px-8 py-3 rounded-xl text-white font-bold text-base cursor-pointer border-none active:scale-95 transition"
            style={{ background: unit.color }}>送出答案</button>
        )}
        {!show && !allDone && <p className="text-slate-400 text-sm">請完成所有題目後送出</p>}
        {show && (
          <div>
            <div className="text-4xl font-black my-3" style={{ color: score >= 4 ? "#059669" : "#ef4444" }}>
              {score >= 4 ? "⭐⭐⭐" : score >= 3 ? "⭐⭐" : "⭐"}
            </div>
            <button onClick={retry}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer bg-transparent border-2 active:scale-95 transition"
              style={{ borderColor: unit.color, color: unit.color }}>🔀 重新出題</button>

            <div className="mt-6 space-y-3 text-center">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">📥 下載本單元練習單，讓孩子再練一次</p>
                <a href={`/worksheets/japanese/n2/unit-${String(unit.id).padStart(2,"0")}.pdf`} download
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm no-underline hover:bg-blue-700 transition">
                  📥 下載練習單 (PDF)
                </a>
              </div>
              <button onClick={() => setEbookOpen(true)}
                className="w-full p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-left cursor-pointer hover:bg-indigo-100 transition">
                <p className="text-sm font-medium text-indigo-800">📚 不知道怎麼陪孩子複習嗎？</p>
                <p className="text-xs text-indigo-600 mt-1">免費索取《日文 N2家長陪伴指南》→ 立即索取</p>
              </button>
            </div>
          </div>
        )}
      </div>
      <EbookModal toolName="日文 N2" ebookSlug="japanese-n2" isOpen={ebookOpen} onClose={() => setEbookOpen(false)} />
    </div>
  );
}
