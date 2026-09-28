"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * 鍵盤位置練習（分階段）。
 *
 * 為什麼獨立成一頁：/typing-game 原本四種玩法都是「把已經記住的位置拿來打」，
 * 沒有教位置的部分；但 Bing 上「鍵盤位置練習」「鍵盤練習」「打字練習基礎」有人搜。
 * 做成獨立路由，現有四種玩法的程式完全不動。
 *
 * 判斷按鍵用 event.code（實體按鍵位置）而不是 event.key，
 * 所以孩子開著注音輸入法也能練，不用先切換成英文。
 */

type Finger = "pinky" | "ring" | "middle" | "index" | "thumb";
interface KeyDef { code: string; label: string; zhuyin: string; finger: Finger; hand: "L" | "R" }

const k = (code: string, label: string, zhuyin: string, finger: Finger, hand: "L" | "R"): KeyDef => ({ code, label, zhuyin, finger, hand });

const ROWS: KeyDef[][] = [
  [k("Digit1","1","ㄅ","pinky","L"),k("Digit2","2","ㄉ","ring","L"),k("Digit3","3","ˇ","middle","L"),k("Digit4","4","ˋ","index","L"),k("Digit5","5","ㄓ","index","L"),
   k("Digit6","6","ˊ","index","R"),k("Digit7","7","˙","index","R"),k("Digit8","8","ㄚ","middle","R"),k("Digit9","9","ㄞ","ring","R"),k("Digit0","0","ㄢ","pinky","R")],
  [k("KeyQ","Q","ㄆ","pinky","L"),k("KeyW","W","ㄊ","ring","L"),k("KeyE","E","ㄍ","middle","L"),k("KeyR","R","ㄐ","index","L"),k("KeyT","T","ㄔ","index","L"),
   k("KeyY","Y","ㄗ","index","R"),k("KeyU","U","ㄧ","index","R"),k("KeyI","I","ㄛ","middle","R"),k("KeyO","O","ㄟ","ring","R"),k("KeyP","P","ㄣ","pinky","R")],
  [k("KeyA","A","ㄇ","pinky","L"),k("KeyS","S","ㄋ","ring","L"),k("KeyD","D","ㄎ","middle","L"),k("KeyF","F","ㄑ","index","L"),k("KeyG","G","ㄕ","index","L"),
   k("KeyH","H","ㄘ","index","R"),k("KeyJ","J","ㄨ","index","R"),k("KeyK","K","ㄜ","middle","R"),k("KeyL","L","ㄠ","ring","R"),k("Semicolon",";","ㄤ","pinky","R")],
  [k("KeyZ","Z","ㄈ","pinky","L"),k("KeyX","X","ㄌ","ring","L"),k("KeyC","C","ㄏ","middle","L"),k("KeyV","V","ㄒ","index","L"),k("KeyB","B","ㄖ","index","L"),
   k("KeyN","N","ㄙ","index","R"),k("KeyM","M","ㄩ","index","R"),k("Comma",",","ㄝ","middle","R"),k("Period",".","ㄡ","ring","R"),k("Slash","/","ㄥ","pinky","R")],
];
const ALL = ROWS.flat();
const BY_CODE: Record<string, KeyDef> = Object.fromEntries(ALL.map(x => [x.code, x]));
const codes = (s: string) => s.split(" ");

const STAGES = [
  { id: 1, title: "基準鍵", desc: "A S D F 和 J K L ;　手指休息的位置", keys: codes("KeyA KeyS KeyD KeyF KeyJ KeyK KeyL Semicolon") },
  { id: 2, title: "中排加 G、H", desc: "食指往中間伸一格", keys: codes("KeyA KeyS KeyD KeyF KeyG KeyH KeyJ KeyK KeyL Semicolon") },
  { id: 3, title: "上排", desc: "Q W E R T 和 Y U I O P", keys: codes("KeyQ KeyW KeyE KeyR KeyT KeyY KeyU KeyI KeyO KeyP") },
  { id: 4, title: "下排", desc: "Z X C V B 和 N M , . /", keys: codes("KeyZ KeyX KeyC KeyV KeyB KeyN KeyM Comma Period Slash") },
  { id: 5, title: "三排混合", desc: "上、中、下排一起練", keys: ROWS.slice(1).flat().map(x => x.code) },
  { id: 6, title: "數字排", desc: "1 到 0；注音的聲調也在這一排", keys: ROWS[0].map(x => x.code) },
];

const FINGER_NAME: Record<Finger, string> = { pinky: "小指", ring: "無名指", middle: "中指", index: "食指", thumb: "大拇指" };
const FINGER_COLOR: Record<Finger, string> = {
  pinky: "bg-rose-100 border-rose-200 text-rose-700",
  ring: "bg-amber-100 border-amber-200 text-amber-700",
  middle: "bg-emerald-100 border-emerald-200 text-emerald-700",
  index: "bg-sky-100 border-sky-200 text-sky-700",
  thumb: "bg-slate-100 border-slate-200 text-slate-600",
};
const DRILL_LENGTH = 30;
const BEST_KEY = "typing_keyboard_best_v1";

type Best = Record<number, { acc: number; kpm: number }>;
const loadBest = (): Best => { try { return JSON.parse(localStorage.getItem(BEST_KEY) || "{}"); } catch { return {}; } };
const saveBest = (b: Best) => { try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch { /* 無痕模式等情況存不了就算了 */ } };

function makeDrill(keys: string[]): string[] {
  const out: string[] = [];
  while (out.length < DRILL_LENGTH) {
    const c = keys[Math.floor(Math.random() * keys.length)];
    if (out[out.length - 1] !== c) out.push(c); // 不連續出同一個鍵
  }
  return out;
}

export default function KeyboardPracticePage() {
  const [stage, setStage] = useState<number | null>(null);
  const [drill, setDrill] = useState<string[]>([]);
  const [pos, setPos] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wrongCode, setWrongCode] = useState<string | null>(null);
  const [showZhuyin, setShowZhuyin] = useState(false);
  const [done, setDone] = useState<{ acc: number; kpm: number; isBest: boolean } | null>(null);
  const [best, setBest] = useState<Best>({});
  const [hasKeyboard, setHasKeyboard] = useState(true);
  const startRef = useRef(0);

  useEffect(() => {
    setBest(loadBest());
    // 純觸控裝置（手機、沒接鍵盤的平板）沒辦法練實體鍵盤位置
    setHasKeyboard(!(window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(any-pointer: fine)").matches));
  }, []);

  const start = useCallback((id: number) => {
    const s = STAGES.find(x => x.id === id)!;
    setStage(id); setDrill(makeDrill(s.keys)); setPos(0); setErrors(0); setWrongCode(null); setDone(null);
    startRef.current = 0;
  }, []);

  useEffect(() => {
    if (stage === null || done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!BY_CODE[e.code]) return;          // 表上沒有的鍵（Shift、方向鍵…）不理會
      e.preventDefault();                    // 避免 "/" 觸發瀏覽器的快速尋找、輸入法跳出選字
      if (!startRef.current) startRef.current = Date.now();
      const target = drill[pos];
      if (e.code === target) {
        setWrongCode(null);
        if (pos + 1 >= drill.length) {
          const minutes = Math.max((Date.now() - startRef.current) / 60000, 0.01);
          const acc = Math.round((drill.length / (drill.length + errors)) * 100);
          const kpm = Math.round(drill.length / minutes);
          const prev = best[stage];
          const isBest = !prev || acc > prev.acc || (acc === prev.acc && kpm > prev.kpm);
          if (isBest) { const nb = { ...best, [stage]: { acc, kpm } }; setBest(nb); saveBest(nb); }
          setDone({ acc, kpm, isBest });
        } else setPos(p => p + 1);
      } else {
        setErrors(n => n + 1);
        setWrongCode(e.code);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, done, drill, pos, errors, best]);

  const target = stage !== null && !done ? BY_CODE[drill[pos]] : null;
  const stageKeys = new Set(stage !== null ? STAGES.find(x => x.id === stage)!.keys : []);
  const face = (x: KeyDef) => (showZhuyin ? x.zhuyin : x.label);

  const keyboard = (
    <div className="select-none" aria-hidden="true">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5" style={{ paddingLeft: `${ri * 14}px` }}>
          {row.map(x => {
            const isTarget = target?.code === x.code;
            const isWrong = wrongCode === x.code;
            const inStage = stage === null || stageKeys.has(x.code);
            return (
              <div key={x.code}
                className={`w-8 h-9 sm:w-11 sm:h-12 rounded-lg border flex flex-col items-center justify-center font-bold text-sm sm:text-base transition
                  ${isTarget ? "bg-blue-500 border-blue-600 text-white scale-110 shadow-lg" : isWrong ? "bg-red-500 border-red-600 text-white" : FINGER_COLOR[x.finger]}
                  ${inStage ? "" : "opacity-35"}`}>
                <span>{face(x)}</span>
                {(x.code === "KeyF" || x.code === "KeyJ") && <span className="block w-3 h-0.5 rounded bg-current opacity-60 mt-0.5" />}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex justify-center mt-1">
        <div className={`h-9 sm:h-11 w-48 sm:w-72 rounded-lg border flex items-center justify-center text-xs ${FINGER_COLOR.thumb}`}>空白鍵（大拇指）</div>
      </div>
    </div>
  );

  const legend = (
    <div className="flex flex-wrap justify-center gap-2 text-xs mt-4">
      {(["pinky", "ring", "middle", "index"] as Finger[]).map(f => (
        <span key={f} className={`px-2.5 py-1 rounded-full border ${FINGER_COLOR[f]}`}>{FINGER_NAME[f]}</span>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-400 mb-6" aria-label="breadcrumb">
        <a href="/typing-game" className="hover:text-slate-600 no-underline">← 回打字練習</a>
      </nav>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-slate-800 mb-2">鍵盤位置練習</h1>
        <p className="text-slate-500">畫面會告訴你按哪個鍵、用哪根手指。先求按對，不用快。</p>
      </div>

      <div className="flex justify-center mb-6">
        <button onClick={() => setShowZhuyin(v => !v)}
          className="px-4 py-2 rounded-xl text-sm font-semibold border bg-white border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50">
          {showZhuyin ? "改顯示英文字母" : "改顯示注音位置"}
        </button>
      </div>

      {!hasKeyboard && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          這個練習需要實體鍵盤。請用電腦，或幫平板接上鍵盤再練。下面的鍵盤圖還是可以拿來認位置。
        </div>
      )}

      {/* 練習中 */}
      {stage !== null && !done && target && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <span>第 {stage} 階段・{STAGES.find(x => x.id === stage)!.title}</span>
            <span>{pos} / {drill.length}　錯 {errors} 次</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${(pos / drill.length) * 100}%` }} />
          </div>
          <div className="text-center mb-6" aria-live="polite">
            <div className="text-6xl font-black text-blue-600 mb-2">{face(target)}</div>
            <div className="text-slate-600">
              用<strong className="text-slate-800">{target.hand === "L" ? "左手" : "右手"}{FINGER_NAME[target.finger]}</strong>
              {wrongCode && <span className="text-red-500 ml-2">按錯了，再試一次</span>}
            </div>
          </div>
          {keyboard}
          {legend}
          <div className="text-center mt-6">
            <button onClick={() => setStage(null)} className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0">結束這一輪</button>
          </div>
        </div>
      )}

      {/* 結果 */}
      {stage !== null && done && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 text-center">
          <div className="text-5xl mb-3">{done.acc >= 95 ? "🏆" : done.acc >= 80 ? "⭐" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">
            {done.acc >= 95 ? "位置記得很熟了！" : done.acc >= 80 ? "不錯，再練一輪會更穩" : "慢慢來，先求按對"}
          </h2>
          {done.isBest && <p className="text-sm text-emerald-600 mb-4">這是你這個階段的最佳紀錄</p>}
          <div className="grid grid-cols-2 gap-4 my-6 max-w-xs mx-auto">
            <div className="p-4 rounded-xl bg-emerald-50"><div className="text-3xl font-black text-emerald-600">{done.acc}%</div><div className="text-xs text-emerald-500 mt-1">正確率</div></div>
            <div className="p-4 rounded-xl bg-blue-50"><div className="text-3xl font-black text-blue-600">{done.kpm}</div><div className="text-xs text-blue-500 mt-1">每分鐘按鍵數</div></div>
          </div>
          <p className="text-sm text-slate-500 mb-6">正確率到 95% 再進下一個階段，會比較輕鬆。</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => start(stage)} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-semibold cursor-pointer border-0 hover:bg-blue-600">再練一次</button>
            {stage < STAGES.length && <button onClick={() => start(stage + 1)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">下一個階段</button>}
            <button onClick={() => setStage(null)} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">選其他階段</button>
          </div>
        </div>
      )}

      {/* 選階段 */}
      {stage === null && (
        <>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {STAGES.map(s => (
              <button key={s.id} onClick={() => start(s.id)}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md text-left cursor-pointer transition active:scale-[0.98]">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black flex-shrink-0">{s.id}</div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{s.title}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{s.desc}</div>
                  {best[s.id] && <div className="text-xs text-emerald-600 mt-1">最佳：正確率 {best[s.id].acc}%・每分鐘 {best[s.id].kpm} 鍵</div>}
                </div>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">鍵盤位置圖：每根手指負責哪些鍵</h2>
            {keyboard}
            {legend}
            <p className="text-xs text-slate-400 text-center mt-4">F 和 J 上面有一條小凸起，是讓食指不用看就能摸到位置。</p>
          </div>
        </>
      )}

      {/* 說明（固定顯示，給第一次來的家長和搜尋引擎看） */}
      <section className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-800 mb-3">怎麼用這個練習</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-6">
          <li>雙手放在基準鍵上：左手四指放 A、S、D、F，右手四指放 J、K、L、;，兩隻大拇指放空白鍵。</li>
          <li>從第 1 階段開始。畫面中間會出現要按的鍵，下面的鍵盤圖會把它標成藍色，並告訴你用哪根手指。</li>
          <li>每按完一個鍵，手指回到基準鍵。眼睛看螢幕，不要低頭看鍵盤。</li>
          <li>一輪 {DRILL_LENGTH} 個鍵。正確率到 95% 再進下一個階段。</li>
        </ol>
        <h2 className="text-xl font-bold text-slate-800 mb-3">開著注音輸入法也能練</h2>
        <p className="mb-6">
          這個練習認的是鍵盤上「哪一顆鍵」，不是打出來的字，所以不用先切換成英文輸入法。
          想記注音的位置，按上面的「改顯示注音位置」，鍵盤圖就會換成注音符號。標準注音鍵盤是照ㄅㄆㄇㄈ的順序，由左到右、每一直排由上到下排的。
        </p>
        <h2 className="text-xl font-bold text-slate-800 mb-3">位置記熟之後</h2>
        <p>
          六個階段都練到 95% 之後，就可以回到<a href="/typing-game" className="text-blue-600">打字練習</a>用「句子打字」打完整的句子，再用「速度測試」量速度。
          練習的順序和常見錯誤，可以看<a href="/blog/keyboard-typing-beginner" className="text-blue-600">鍵盤練習怎麼開始</a>這篇。
        </p>
      </section>
    </div>
  );
}
