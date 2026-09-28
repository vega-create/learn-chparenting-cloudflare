"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { IDIOMS, IDIOM_LEVELS, type Idiom, type IdiomLevel } from "@/data/idiom-practice";

/**
 * 成語練習：填空、配對、可列印學習單。
 *
 * 為什麼獨立成一頁：/chinese-lang/middle|high/idioms 是選擇題題庫，
 * 這裡補的是另外兩種練法（選字填空、成語配意思）和可以印出來寫的學習單——
 * Bing 上「成語學習單」有人搜，站上原本沒有可以列印的東西。
 * 既有的成語選擇題完全不動。
 *
 * 列印：學習單另外用 portal 掛在 <body> 底下一份，列印時把 body 其他子元素藏起來，
 * 這樣不用改共用的 Header／Footer。
 */

type Mode = "fill" | "match" | "sheet";
type Best = Record<string, number>; // `${mode}-${level}` → 最佳正確率

const FILL_LENGTH = 10;
const BOARDS = 3;
const PAIRS = 4;
const SHEET_FILL = 8;
const SHEET_MATCH = 6;
const BEST_KEY = "idiom_practice_best_v1";

const loadBest = (): Best => { try { return JSON.parse(localStorage.getItem(BEST_KEY) || "{}"); } catch { return {}; } };
const saveBest = (b: Best) => { try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch { /* 無痕模式等情況存不了就算了 */ } };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 取 n 個成語，同一個 group（意思相近）的不會同時出現；used 裡的也不取。 */
function pickDistinct(pool: Idiom[], n: number, used: Set<string> = new Set()): Idiom[] {
  const out: Idiom[] = [];
  const groups = new Set<string>();
  for (const it of shuffle(pool)) {
    if (out.length >= n) break;
    if (used.has(it.word) || (it.group && groups.has(it.group))) continue;
    out.push(it);
    if (it.group) groups.add(it.group);
  }
  return out;
}

const blanked = (it: Idiom, mark = "＿") => it.word.split("").map((c, i) => (i === it.blank ? mark : c)).join("");
const answerChar = (it: Idiom) => it.word[it.blank];

interface FillQ { idiom: Idiom; opts: string[] }
interface Sheet { level: IdiomLevel; fill: Idiom[]; match: Idiom[]; matchOrder: number[] }

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function makeSheet(level: IdiomLevel): Sheet {
  const all = IDIOMS.filter(x => x.level === level);
  const match = pickDistinct(all, SHEET_MATCH);
  const fill = shuffle(all.filter(x => !match.includes(x))).slice(0, SHEET_FILL);
  return {
    level,
    fill,
    match,
    matchOrder: shuffle(Array.from({ length: SHEET_MATCH }, (_, i) => i)), // 右欄第 k 格放第 matchOrder[k] 個成語的意思
  };
}

function SheetView({ sheet }: { sheet: Sheet }) {
  const levelTitle = IDIOM_LEVELS.find(l => l.id === sheet.level)!.title;
  return (
    <div className="text-slate-800" style={{ fontSize: "15px", lineHeight: 1.7 }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "22px", fontWeight: 800 }}>成語練習學習單（{levelTitle}）</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <span>姓名：＿＿＿＿＿＿＿＿</span>
        <span>日期：＿＿＿年＿＿月＿＿日</span>
      </div>

      <div style={{ fontWeight: 700, marginBottom: "6px" }}>一、看意思，把成語缺的字寫出來</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <tbody>
          {sheet.fill.map((it, i) => (
            <tr key={it.word}>
              <td style={{ width: "2em", verticalAlign: "top", padding: "5px 0" }}>{i + 1}.</td>
              <td style={{ width: "8.5em", verticalAlign: "top", padding: "5px 0", fontSize: "18px", letterSpacing: "2px", whiteSpace: "nowrap" }}>{blanked(it, "（　）")}</td>
              <td style={{ verticalAlign: "top", padding: "5px 0" }}>{it.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontWeight: 700, marginBottom: "6px" }}>二、連連看：把成語和它的意思連起來</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {sheet.match.map((it, i) => (
            <tr key={it.word}>
              <td style={{ width: "9em", padding: "7px 0", fontSize: "18px", letterSpacing: "2px", whiteSpace: "nowrap" }}>{i + 1}. {it.word}　●</td>
              <td style={{ width: "3em" }} />
              <td style={{ padding: "7px 0" }}>●　{LETTERS[i]}. {sheet.match[sheet.matchOrder[i]].meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="idiom-answer" style={{ marginTop: "28px", paddingTop: "14px", borderTop: "1px dashed #94a3b8" }}>
        <div style={{ fontWeight: 700, marginBottom: "6px" }}>解答</div>
        <div style={{ marginBottom: "6px" }}>
          一、{sheet.fill.map((it, i) => `${i + 1}. ${answerChar(it)}（${it.word}）`).join("　")}
        </div>
        <div>
          二、{sheet.match.map((_, i) => `${i + 1}－${LETTERS[sheet.matchOrder.indexOf(i)]}`).join("　")}
        </div>
      </div>
    </div>
  );
}

export default function IdiomPracticePage() {
  const [level, setLevel] = useState<IdiomLevel>("basic");
  const [mode, setMode] = useState<Mode | null>(null);
  const [best, setBest] = useState<Best>({});
  const [result, setResult] = useState<{ acc: number; isBest: boolean; missed: Idiom[] } | null>(null);

  // 填空
  const [fillQs, setFillQs] = useState<FillQ[]>([]);
  const [fillPos, setFillPos] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [fillMissed, setFillMissed] = useState<Idiom[]>([]);

  // 配對
  const [boards, setBoards] = useState<{ left: Idiom[]; right: Idiom[] }[]>([]);
  const [boardIdx, setBoardIdx] = useState(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [wrongRight, setWrongRight] = useState<string | null>(null);
  const [matchErrors, setMatchErrors] = useState(0);
  const [matchMissed, setMatchMissed] = useState<Idiom[]>([]);

  // 學習單
  const [sheet, setSheet] = useState<Sheet | null>(null);

  useEffect(() => { setBest(loadBest()); }, []);

  const pool = useCallback(() => IDIOMS.filter(x => x.level === level), [level]);

  const record = useCallback((m: Mode, acc: number, missed: Idiom[]) => {
    const key = `${m}-${level}`;
    const isBest = best[key] === undefined || acc > best[key];
    if (isBest) { const nb = { ...best, [key]: acc }; setBest(nb); saveBest(nb); }
    setResult({ acc, isBest, missed });
  }, [best, level]);

  const startFill = useCallback(() => {
    const qs = shuffle(pool()).slice(0, FILL_LENGTH).map(idiom => ({ idiom, opts: shuffle([answerChar(idiom), ...idiom.wrong]) }));
    setFillQs(qs); setFillPos(0); setPicked(null); setFillMissed([]); setResult(null); setMode("fill");
  }, [pool]);

  const startMatch = useCallback(() => {
    const used = new Set<string>();
    const bs = Array.from({ length: BOARDS }, () => {
      const left = pickDistinct(pool(), PAIRS, used);
      left.forEach(x => used.add(x.word));
      return { left, right: shuffle(left) };
    });
    setBoards(bs); setBoardIdx(0); setMatched([]); setSelLeft(null); setWrongRight(null);
    setMatchErrors(0); setMatchMissed([]); setResult(null); setMode("match");
  }, [pool]);

  const startSheet = useCallback(() => { setSheet(makeSheet(level)); setResult(null); setMode("sheet"); }, [level]);

  const back = () => { setMode(null); setResult(null); setSheet(null); };

  // ── 填空 ──
  const fq = mode === "fill" && !result ? fillQs[fillPos] : null;
  const pickFill = (c: string) => {
    if (!fq || picked) return;
    setPicked(c);
    if (c !== answerChar(fq.idiom)) setFillMissed(m => [...m, fq.idiom]);
  };
  const nextFill = () => {
    if (fillPos + 1 >= fillQs.length) record("fill", Math.round(((fillQs.length - fillMissed.length) / fillQs.length) * 100), fillMissed);
    else { setFillPos(p => p + 1); setPicked(null); }
  };

  // ── 配對 ──
  const board = mode === "match" && !result ? boards[boardIdx] : null;
  const boardDone = !!board && board.left.every(x => matched.includes(x.word));
  const pickRight = (word: string) => {
    if (!board || !selLeft || matched.includes(word)) return;
    if (word === selLeft) {
      setMatched(m => [...m, word]); setSelLeft(null); setWrongRight(null);
    } else {
      setMatchErrors(n => n + 1);
      setWrongRight(word);
      const it = board.left.find(x => x.word === selLeft)!;
      setMatchMissed(m => (m.includes(it) ? m : [...m, it]));
    }
  };
  const nextBoard = () => {
    if (boardIdx + 1 >= boards.length) {
      const total = BOARDS * PAIRS;
      record("match", Math.round((total / (total + matchErrors)) * 100), matchMissed);
    } else { setBoardIdx(i => i + 1); setMatched([]); setSelLeft(null); setWrongRight(null); }
  };

  const levelTitle = IDIOM_LEVELS.find(l => l.id === level)!.title;
  const MODES: { id: Mode; icon: string; title: string; desc: string; go: () => void }[] = [
    { id: "fill", icon: "✏️", title: "成語填空", desc: `看意思，選出缺的那個字。一輪 ${FILL_LENGTH} 題`, go: startFill },
    { id: "match", icon: "🔗", title: "意思配對", desc: `把成語和意思配起來。一輪 ${BOARDS * PAIRS} 組`, go: startMatch },
    { id: "sheet", icon: "🖨️", title: "列印學習單", desc: "產生一張填空＋連連看的學習單，附解答", go: startSheet },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-400 mb-6">
        <a href="/chinese-lang" className="hover:text-slate-600 no-underline">← 回國語學習</a>
      </nav>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-slate-800 mb-2">成語練習</h1>
        <p className="text-slate-500">填空、配對，還可以印成學習單用手寫。</p>
      </div>

      {/* 選程度與玩法 */}
      {mode === null && (
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {IDIOM_LEVELS.map(l => (
              <button key={l.id} onClick={() => setLevel(l.id)} aria-pressed={level === l.id}
                className={`py-3 rounded-xl border-2 cursor-pointer transition ${level === l.id ? "bg-orange-50 border-orange-400 text-slate-800" : "bg-white border-slate-200 text-slate-500"}`}>
                <span className="block font-bold">{l.title}</span>
                <span className="block text-xs text-slate-400">{l.note}・{IDIOMS.filter(x => x.level === l.id).length} 個成語</span>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {MODES.map(m => (
              <button key={m.id} onClick={m.go}
                className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md text-left cursor-pointer transition active:scale-[0.98]">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">{m.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{m.title}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{m.desc}</div>
                  {best[`${m.id}-${level}`] !== undefined && <div className="text-xs text-emerald-600 mt-1">{levelTitle}最佳：正確率 {best[`${m.id}-${level}`]}%</div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 填空 */}
      {fq && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <span>成語填空・{levelTitle}</span>
            <span>第 {fillPos + 1} 題／共 {fillQs.length} 題</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-orange-400 transition-all" style={{ width: `${(fillPos / fillQs.length) * 100}%` }} />
          </div>
          <div className="text-center mb-6" aria-live="polite">
            <div className="text-sm text-slate-400 mb-1">意思</div>
            <div className="text-lg text-slate-700 mb-5">{fq.idiom.meaning}</div>
            <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-widest">
              {fq.idiom.word.split("").map((c, i) => (
                <span key={i} className={i === fq.idiom.blank ? (picked ? (picked === c ? "text-emerald-600" : "text-red-500") : "text-orange-400") : ""}>
                  {i === fq.idiom.blank ? (picked ? c : "＿") : c}
                </span>
              ))}
            </div>
            <div className="h-6 mt-3">
              {picked && (picked === answerChar(fq.idiom)
                ? <span className="text-emerald-600 font-semibold">答對了！</span>
                : <span className="text-red-500 font-semibold">不是「{picked}」，正確的字是「{answerChar(fq.idiom)}」</span>)}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mb-5">
            {fq.opts.map(c => {
              const isAns = c === answerChar(fq.idiom);
              return (
                <button key={c} onClick={() => pickFill(c)} disabled={!!picked}
                  className={`py-4 rounded-xl border-2 text-3xl font-bold transition active:scale-95
                    ${!picked ? "bg-white border-slate-200 text-slate-700 cursor-pointer hover:border-orange-300"
                      : isAns ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                      : c === picked ? "bg-red-50 border-red-400 text-red-600" : "bg-white border-slate-100 text-slate-300"}`}>
                  {c}
                </button>
              );
            })}
          </div>
          <div className="text-center">
            {picked
              ? <button onClick={nextFill} className="px-8 py-3 rounded-xl bg-orange-500 text-white font-bold cursor-pointer border-0 hover:bg-orange-600">{fillPos + 1 >= fillQs.length ? "看結果" : "下一題"}</button>
              : <button onClick={back} className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0">結束這一輪</button>}
          </div>
        </div>
      )}

      {/* 配對 */}
      {board && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <span>意思配對・{levelTitle}</span>
            <span>第 {boardIdx + 1} 組／共 {boards.length} 組　錯 {matchErrors} 次</span>
          </div>
          <p className="text-sm text-slate-500 text-center mb-4" aria-live="polite">
            {boardDone ? "這一組都配對了！" : selLeft ? `「${selLeft}」是什麼意思？點右邊的答案` : "先點左邊的成語，再點右邊的意思"}
            {wrongRight && !boardDone && <span className="text-red-500 ml-2">不是這個，再想想</span>}
          </p>
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 mb-5">
            <div className="space-y-2">
              {board.left.map(it => {
                const ok = matched.includes(it.word);
                return (
                  <button key={it.word} onClick={() => { if (!ok) { setSelLeft(it.word); setWrongRight(null); } }} disabled={ok}
                    className={`w-full min-h-[64px] px-2 rounded-xl border-2 text-lg sm:text-xl font-bold transition
                      ${ok ? "bg-emerald-50 border-emerald-300 text-emerald-700" : selLeft === it.word ? "bg-orange-100 border-orange-400 text-slate-800 cursor-pointer" : "bg-white border-slate-200 text-slate-700 cursor-pointer hover:border-orange-300"}`}>
                    {it.word}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {board.right.map(it => {
                const ok = matched.includes(it.word);
                return (
                  <button key={it.word} onClick={() => pickRight(it.word)} disabled={ok || !selLeft}
                    className={`w-full min-h-[64px] px-3 rounded-xl border-2 text-sm sm:text-base text-left transition
                      ${ok ? "bg-emerald-50 border-emerald-300 text-emerald-700" : wrongRight === it.word ? "bg-red-50 border-red-400 text-red-600 cursor-pointer" : selLeft ? "bg-white border-slate-200 text-slate-700 cursor-pointer hover:border-orange-300" : "bg-white border-slate-200 text-slate-500"}`}>
                    {it.meaning}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-center">
            {boardDone
              ? <button onClick={nextBoard} className="px-8 py-3 rounded-xl bg-orange-500 text-white font-bold cursor-pointer border-0 hover:bg-orange-600">{boardIdx + 1 >= boards.length ? "看結果" : "下一組"}</button>
              : <button onClick={back} className="text-sm text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0">結束這一輪</button>}
          </div>
        </div>
      )}

      {/* 結果 */}
      {result && (mode === "fill" || mode === "match") && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 text-center">
          <div className="text-5xl mb-3">{result.acc >= 95 ? "🏆" : result.acc >= 80 ? "⭐" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">
            {result.acc >= 95 ? "這些成語你都熟了！" : result.acc >= 80 ? "不錯，再練一輪會更熟" : "慢慢來，多看幾次就會記住"}
          </h2>
          {result.isBest && <p className="text-sm text-emerald-600">這是你目前的最佳紀錄</p>}
          <div className="my-6 inline-block px-8 py-4 rounded-xl bg-emerald-50">
            <div className="text-3xl font-black text-emerald-600">{result.acc}%</div>
            <div className="text-xs text-emerald-500 mt-1">正確率</div>
          </div>
          {result.missed.length > 0 && (
            <div className="mb-6 text-left max-w-md mx-auto">
              <p className="text-sm text-slate-500 mb-2 text-center">這幾個可以再看一次：</p>
              <ul className="space-y-1.5 list-none p-0 m-0">
                {result.missed.map(it => (
                  <li key={it.word} className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-100 text-sm">
                    <strong className="text-slate-800">{it.word}</strong><span className="text-slate-500">：{it.meaning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={mode === "fill" ? startFill : startMatch} className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold cursor-pointer border-0 hover:bg-orange-600">再練一次</button>
            <button onClick={back} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">選其他玩法</button>
          </div>
        </div>
      )}

      {/* 學習單 */}
      {mode === "sheet" && sheet && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold cursor-pointer border-0 hover:bg-orange-600">🖨️ 列印這張學習單</button>
            <button onClick={() => setSheet(makeSheet(level))} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">換一張題目</button>
            <button onClick={back} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">回上一頁</button>
          </div>
          <p className="text-xs text-slate-400 text-center mb-4">列印時只會印出學習單，解答印在第二頁。在列印視窗選「另存為 PDF」就能存成檔案。</p>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 overflow-x-auto">
            <SheetView sheet={sheet} />
          </div>
          <style>{`
            .idiom-print-root { display: none; }
            @media print {
              body > *:not(.idiom-print-root) { display: none !important; }
              .idiom-print-root { display: block !important; background: #fff; }
              .idiom-print-root .idiom-answer { break-before: page; border-top: 0 !important; margin-top: 0 !important; }
              @page { margin: 16mm; }
            }
          `}</style>
          {createPortal(<div className="idiom-print-root"><SheetView sheet={sheet} /></div>, document.body)}
        </div>
      )}

      {/* 說明（固定顯示，給第一次來的家長和搜尋引擎看） */}
      <section className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-800 mb-3">三種練法</h2>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>成語填空</strong>：畫面給成語的意思，成語缺一個字，從四個字裡選出對的。選項都是同音或長得像的字，例如「畫龍點睛」的「睛」和「晴」。</li>
          <li><strong>意思配對</strong>：一組四個成語、四個意思，先點成語再點意思。</li>
          <li><strong>列印學習單</strong>：每次隨機出 {SHEET_FILL} 題填空和 {SHEET_MATCH} 題連連看，解答在第二頁，可以一直換題目。</li>
        </ul>
        <h2 className="text-xl font-bold text-slate-800 mb-3">基礎和進階怎麼選</h2>
        <p className="mb-6">
          基礎是中年級常見的成語，像守株待兔、畫蛇添足、半途而廢；進階是高年級常見的成語，像未雨綢繆、破釜沉舟、不恥下問。
          兩種程度的成語都來自站上的成語題庫，想做選擇題可以到
          <a href="/chinese-lang/middle/idioms" className="text-orange-600">中年級成語練習</a>和
          <a href="/chinese-lang/high/idioms" className="text-orange-600">高年級成語練習</a>。
        </p>
        <h2 className="text-xl font-bold text-slate-800 mb-3">搭配閱讀</h2>
        <p>
          成語怎麼分年級學、怎麼用在作文裡，可以看<a href="/blog/idiom-learning-guide" className="text-orange-600">成語學習指南</a>。
        </p>
      </section>
    </div>
  );
}
