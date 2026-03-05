"use client";
import { useState, useEffect } from "react";
import { playCorrect, playWrong, playPerfect } from "@/lib/sounds";
import { speakJa, stopSpeaking } from "@/lib/speech";

/** 50音專用：單一假名重複讀三次、大幅降速，使用女聲（Kyoko） */
const speak = (text: string, rate = 0.8) => {
  const finalText = text.length <= 2 ? `${text}、、、${text}、、、${text}` : text;
  const finalRate = text.length <= 2 ? 0.3 : rate;
  speakJa(finalText, finalRate);
};

const HIRAGANA = [
  ["あ","い","う","え","お"],
  ["か","き","く","け","こ"],
  ["さ","し","す","せ","そ"],
  ["た","ち","つ","て","と"],
  ["な","に","ぬ","ね","の"],
  ["は","ひ","ふ","へ","ほ"],
  ["ま","み","む","め","も"],
  ["や","","ゆ","","よ"],
  ["ら","り","る","れ","ろ"],
  ["わ","","を","","ん"],
];

const KATAKANA = [
  ["ア","イ","ウ","エ","オ"],
  ["カ","キ","ク","ケ","コ"],
  ["サ","シ","ス","セ","ソ"],
  ["タ","チ","ツ","テ","ト"],
  ["ナ","ニ","ヌ","ネ","ノ"],
  ["ハ","ヒ","フ","ヘ","ホ"],
  ["マ","ミ","ム","メ","モ"],
  ["ヤ","","ユ","","ヨ"],
  ["ラ","リ","ル","レ","ロ"],
  ["ワ","","ヲ","","ン"],
];

const ROMAJI = [
  ["a","i","u","e","o"],
  ["ka","ki","ku","ke","ko"],
  ["sa","shi","su","se","so"],
  ["ta","chi","tsu","te","to"],
  ["na","ni","nu","ne","no"],
  ["ha","hi","fu","he","ho"],
  ["ma","mi","mu","me","mo"],
  ["ya","","yu","","yo"],
  ["ra","ri","ru","re","ro"],
  ["wa","","wo","","n"],
];

const ROW_LABELS = ["あ行","か行","さ行","た行","な行","は行","ま行","や行","ら行","わ行"];
const COL_LABELS = ["a","i","u","e","o"];

// Flatten for quiz
const ALL_KANA: { h: string; k: string; r: string }[] = [];
HIRAGANA.forEach((row, ri) => {
  row.forEach((h, ci) => {
    if (h) ALL_KANA.push({ h, k: KATAKANA[ri][ci], r: ROMAJI[ri][ci] });
  });
});

type Mode = "chart" | "quiz";
type ChartType = "hiragana" | "katakana";
type QuizType = "h2r" | "r2h" | "k2r" | "listen";

const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);

export default function GojuonPage() {
  const [mode, setMode] = useState<Mode>("chart");
  const [chartType, setChartType] = useState<ChartType>("hiragana");
  const [showRomaji, setShowRomaji] = useState(true);

  // Quiz state
  const [quizType, setQuizType] = useState<QuizType>("h2r");
  const [quizItems, setQuizItems] = useState<typeof ALL_KANA>([]);
  const [qi, setQi] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);

  // Stop speech when leaving page
  useEffect(() => { return () => { stopSpeaking(); }; }, []);

  const startQuiz = (type: QuizType) => {
    setQuizType(type);
    const items = shuffle(ALL_KANA).slice(0, 20);
    setQuizItems(items);
    setQi(0); setSel(null); setShow(false); setScore(0);
    generateOptions(items[0], type);
    setMode("quiz");
  };

  const generateOptions = (item: typeof ALL_KANA[0], type: QuizType) => {
    const correct = type === "h2r" || type === "k2r" || type === "listen" ? item.r : item.h;
    const pool = ALL_KANA.filter(k => (type === "r2h" ? k.h : k.r) !== correct);
    const wrongs = shuffle(pool).slice(0, 3).map(k => type === "r2h" ? k.h : k.r);
    setOptions(shuffle([correct, ...wrongs]));
  };

  const handleAnswer = (ans: string) => {
    if (show) return;
    setSel(ans);
    setShow(true);
    const item = quizItems[qi];
    const correct = quizType === "h2r" || quizType === "k2r" || quizType === "listen" ? item.r : item.h;
    if (ans === correct) { setScore(s => s + 1); playCorrect(); }
    else playWrong();
  };

  const nextQ = () => {
    const nextIdx = qi + 1;
    if (nextIdx >= quizItems.length) return;
    setQi(nextIdx); setSel(null); setShow(false);
    generateOptions(quizItems[nextIdx], quizType);
  };

  const chart = chartType === "hiragana" ? HIRAGANA : KATAKANA;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">あ</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">五十音</h1>
        <p className="text-slate-500">平假名 & 片假名 · 點擊聽發音 · 測驗練習</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => setMode("chart")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer ${
            mode === "chart" ? "bg-red-500 text-white border-red-500" : "bg-white border-slate-200 text-slate-600"
          }`}>📊 五十音表</button>
        <button onClick={() => startQuiz("h2r")}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer ${
            mode === "quiz" ? "bg-red-500 text-white border-red-500" : "bg-white border-slate-200 text-slate-600"
          }`}>🎯 測驗練習</button>
      </div>

      {mode === "chart" && (
        <>
          {/* Chart type toggle */}
          <div className="flex justify-center gap-3 mb-4">
            <button onClick={() => setChartType("hiragana")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                chartType === "hiragana" ? "bg-red-100 text-red-700" : "text-slate-500"
              }`}>平假名 ひらがな</button>
            <button onClick={() => setChartType("katakana")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                chartType === "katakana" ? "bg-blue-100 text-blue-700" : "text-slate-500"
              }`}>片假名 カタカナ</button>
            <button onClick={() => setShowRomaji(!showRomaji)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 transition cursor-pointer hover:bg-slate-100">
              {showRomaji ? "🙈 隱藏羅馬字" : "👁️ 顯示羅馬字"}
            </button>
          </div>

          {/* Column headers */}
          <div className="overflow-x-auto">
            <div className="min-w-[360px] max-w-lg mx-auto">
              <div className="grid grid-cols-6 gap-1 mb-1">
                <div />
                {COL_LABELS.map(c => (
                  <div key={c} className="text-center text-xs text-slate-400 font-mono">{c}</div>
                ))}
              </div>

              {chart.map((row, ri) => (
                <div key={ri} className="grid grid-cols-6 gap-1 mb-1">
                  <div className="flex items-center justify-center text-xs text-slate-400">{ROW_LABELS[ri]}</div>
                  {row.map((ch, ci) => (
                    <button key={ci} onClick={() => ch && speak(ch)}
                      disabled={!ch}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition cursor-pointer active:scale-95 ${
                        ch ? (chartType === "hiragana" ? "bg-red-50 border border-red-200 hover:bg-red-100" : "bg-blue-50 border border-blue-200 hover:bg-blue-100") : "bg-transparent border border-transparent"
                      }`}>
                      {ch && (
                        <>
                          <span className="text-xl md:text-2xl font-bold text-slate-800">{ch}</span>
                          {showRomaji && <span className="text-[10px] text-slate-400 font-mono">{ROMAJI[ri][ci]}</span>}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === "quiz" && (
        <>
          {/* Quiz type selector */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {([
              { id: "h2r" as QuizType, label: "平假名→羅馬字" },
              { id: "r2h" as QuizType, label: "羅馬字→平假名" },
              { id: "k2r" as QuizType, label: "片假名→羅馬字" },
              { id: "listen" as QuizType, label: "🔊 聽音選字" },
            ]).map(t => (
              <button key={t.id} onClick={() => startQuiz(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  quizType === t.id ? "bg-red-500 text-white border-red-500" : "bg-white border-slate-200 text-slate-500"
                }`}>{t.label}</button>
            ))}
          </div>

          {qi < quizItems.length ? (
            <div className="max-w-md mx-auto bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                  {qi + 1} / {quizItems.length}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">✓ {score}</span>
              </div>

              <div className="text-center mb-6">
                {quizType === "listen" ? (
                  <button onClick={() => speak(quizItems[qi].h)}
                    className="w-24 h-24 rounded-full text-4xl bg-red-50 border-2 border-red-200 cursor-pointer transition active:scale-95 mx-auto">
                    🔊
                  </button>
                ) : (
                  <div className="text-6xl font-black text-slate-800 py-4">
                    {quizType === "r2h" ? quizItems[qi].r : quizType === "k2r" ? quizItems[qi].k : quizItems[qi].h}
                  </div>
                )}
                <div className="text-sm text-slate-400 mt-2">
                  {quizType === "h2r" ? "這個平假名的羅馬字是？" : quizType === "r2h" ? "這個羅馬字的平假名是？" : quizType === "k2r" ? "這個片假名的羅馬字是？" : "聽到的發音是？"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {options.map((opt, i) => {
                  const correct = quizType === "h2r" || quizType === "k2r" || quizType === "listen" ? quizItems[qi].r : quizItems[qi].h;
                  let cls = "bg-slate-50 border-slate-200";
                  if (show && opt === correct) cls = "bg-emerald-50 border-emerald-400";
                  if (show && opt === sel && opt !== correct) cls = "bg-red-50 border-red-400";
                  return (
                    <button key={i} onClick={() => handleAnswer(opt)}
                      className={`p-4 rounded-xl border text-center text-xl font-bold transition active:scale-[0.97] ${cls} ${show ? "" : "cursor-pointer hover:bg-slate-100"}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {show && (
                <div className="text-center mt-5">
                  <div className={`font-semibold mb-3 ${sel === (quizType === "h2r" || quizType === "k2r" || quizType === "listen" ? quizItems[qi].r : quizItems[qi].h) ? "text-emerald-600" : "text-red-500"}`}>
                    {sel === (quizType === "h2r" || quizType === "k2r" || quizType === "listen" ? quizItems[qi].r : quizItems[qi].h) ? "✅ 答對了！" : `❌ 正確答案：${quizType === "h2r" || quizType === "k2r" || quizType === "listen" ? quizItems[qi].r : quizItems[qi].h}`}
                  </div>
                  {qi + 1 < quizItems.length ? (
                    <button onClick={nextQ} className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm cursor-pointer border-none active:scale-95 transition">
                      下一題 →
                    </button>
                  ) : (
                    <button onClick={() => { setQi(quizItems.length); if (score >= 18) playPerfect(); else playCorrect(); }} className="px-6 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm cursor-pointer border-none active:scale-95 transition">
                      看結果 →
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
              <div className="text-5xl mb-3">{score >= 18 ? "🌟" : score >= 14 ? "⭐" : "💪"}</div>
              <div className="text-3xl font-black text-slate-800 mb-2">{score} / {quizItems.length}</div>
              <div className="text-slate-500 mb-4">{score >= 18 ? "太厲害了！" : score >= 14 ? "很不錯！繼續加油！" : "多練習就會進步！"}</div>
              <button onClick={() => startQuiz(quizType)} className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold cursor-pointer border-none active:scale-95 transition">
                🔄 再來一次
              </button>
            </div>
          )}
        </>
      )}

      {/* Back to N5 */}
      <div className="text-center mt-8">
        <a href="/jlpt-n5" className="text-sm text-slate-400 hover:text-red-500 transition no-underline">← 回到 JLPT N5</a>
      </div>
    </div>
  );
}
