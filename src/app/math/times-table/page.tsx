"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * 九九乘法練習。
 *
 * 為什麼獨立成一頁：/math 的八個主題是「觀念＋選擇題」，沒有專門練九九乘法的地方，
 * 但〈九九乘法背不起來〉這篇文章在 Bing 有流量，需要一個對應的工具。
 * 做成獨立路由，/math 既有主題的程式完全不動。
 *
 * 答錯的題目會排到最後再出一次，直到全部答對；成績只算第一次作答。
 */

interface Fact { a: number; b: number }
type Order = "seq" | "random";
type Best = Record<string, { correct: number; total: number; seconds: number }>;

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const MIXED_LENGTH = 20;
const BEST_KEY = "math_times_table_best_v1";

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

function makeRound(tables: number[], order: Order): Fact[] {
  const pool = tables.flatMap(a => NUMS.map(b => ({ a, b })));
  if (tables.length === 1) return order === "seq" ? pool : shuffle(pool);
  // 選了不只一個乘法：題目太多孩子會做不完，一輪抽 20 題
  return shuffle(pool).slice(0, MIXED_LENGTH);
}

const bestKeyOf = (tables: number[]) => (tables.length === 1 ? String(tables[0]) : tables.length === TABLES.length ? "all" : "");

export default function TimesTablePage() {
  const [selected, setSelected] = useState<number[]>([2]);
  const [order, setOrder] = useState<Order>("seq");
  const [queue, setQueue] = useState<Fact[] | null>(null);   // null = 還沒開始
  const [pos, setPos] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);
  const [firstTotal, setFirstTotal] = useState(0);           // 第一輪題數
  const [missed, setMissed] = useState<Fact[]>([]);          // 第一輪答錯的題目
  const [done, setDone] = useState<{ correct: number; total: number; seconds: number; isBest: boolean } | null>(null);
  const [best, setBest] = useState<Best>({});
  const [peek, setPeek] = useState(false);
  const startRef = useRef(0);

  useEffect(() => { setBest(loadBest()); }, []);

  const toggle = (n: number) =>
    setSelected(s => (s.includes(n) ? s.filter(x => x !== n) : [...s, n].sort((x, y) => x - y)));

  const start = useCallback(() => {
    if (selected.length === 0) return;
    const round = makeRound(selected, order);
    setQueue(round); setPos(0); setInput(""); setFeedback(null);
    setFirstTotal(round.length); setMissed([]); setDone(null); setPeek(false);
    startRef.current = Date.now();
  }, [selected, order]);

  const current = queue && !done ? queue[pos] : null;
  const retrying = pos >= firstTotal;

  const finish = useCallback((missedNow: Fact[]) => {
    const seconds = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const total = firstTotal;
    const correct = total - missedNow.length;
    const key = bestKeyOf(selected);
    let isBest = false;
    if (key) {
      const prev = best[key];
      isBest = !prev || correct / total > prev.correct / prev.total || (correct / total === prev.correct / prev.total && seconds < prev.seconds);
      if (isBest) { const nb = { ...best, [key]: { correct, total, seconds } }; setBest(nb); saveBest(nb); }
    }
    setDone({ correct, total, seconds, isBest });
  }, [firstTotal, selected, best]);

  const submit = useCallback(() => {
    if (!current || !queue || feedback || input === "") return;
    const ok = Number(input) === current.a * current.b;
    setFeedback(ok ? "right" : "wrong");
    if (!ok) {
      if (!retrying) setMissed(m => [...m, current]);
      setQueue(q => (q ? [...q, current] : q));   // 答錯的排到最後再練一次
    }
  }, [current, queue, feedback, input, retrying]);

  const next = useCallback(() => {
    if (!queue) return;
    if (pos + 1 >= queue.length) finish(missed);
    else { setPos(p => p + 1); setInput(""); setFeedback(null); }
  }, [queue, pos, finish, missed]);

  const press = useCallback((key: string) => {
    if (feedback) { if (key === "enter") next(); return; }
    if (key === "enter") submit();
    else if (key === "back") setInput(s => s.slice(0, -1));
    else setInput(s => (s.length >= 2 ? s : s === "0" ? key : s + key));
  }, [feedback, next, submit]);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^\d$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (e.key === "Backspace") { e.preventDefault(); press("back"); }
      else if (e.key === "Enter") { e.preventDefault(); press("enter"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, press]);

  const table = (highlight?: number) => (
    <div className="overflow-x-auto">
      <table className="mx-auto border-collapse text-sm sm:text-base">
        <thead>
          <tr>
            <th className="w-9 h-9 sm:w-11 sm:h-10 text-slate-400 font-semibold">×</th>
            {NUMS.map(b => <th key={b} className="w-9 h-9 sm:w-11 sm:h-10 bg-amber-50 border border-amber-100 text-amber-700 font-bold">{b}</th>)}
          </tr>
        </thead>
        <tbody>
          {NUMS.map(a => (
            <tr key={a}>
              <th className="bg-amber-50 border border-amber-100 text-amber-700 font-bold h-9 sm:h-10">{a}</th>
              {NUMS.map(b => (
                <td key={b} className={`border text-center h-9 sm:h-10 ${a === highlight ? "bg-amber-100 border-amber-200 text-slate-800 font-semibold" : "bg-white border-slate-100 text-slate-600"}`}>{a * b}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const label = selected.length === TABLES.length ? "2 到 9 全部" : `${selected.join("、")} 的乘法`;
  const pct = done ? Math.round((done.correct / done.total) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-slate-400 mb-6">
        <a href="/math" className="hover:text-slate-600 no-underline">← 回數學練習</a>
      </nav>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-slate-800 mb-2">九九乘法練習</h1>
        <p className="text-slate-500">選要練的乘法，答錯的題目最後會再練一次。</p>
      </div>

      {/* 選擇 */}
      {!queue && (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 mb-8">
            <h2 className="font-bold text-slate-800 mb-3">1. 要練幾的乘法？（可以選不只一個）</h2>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {TABLES.map(n => {
                const on = selected.includes(n);
                const b = best[String(n)];
                return (
                  <button key={n} onClick={() => toggle(n)} aria-pressed={on}
                    className={`py-3 rounded-xl border-2 font-black text-xl cursor-pointer transition active:scale-95 ${on ? "bg-amber-400 border-amber-500 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"}`}>
                    {n}
                    <span className={`block text-[10px] font-medium ${on ? "text-amber-50" : "text-emerald-600"}`}>{b ? `最佳 ${b.correct}/${b.total}` : " "}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 text-sm mb-6">
              <button onClick={() => setSelected(TABLES)} className="text-amber-600 hover:underline cursor-pointer bg-transparent border-0 p-0">全部都選</button>
              <button onClick={() => setSelected([])} className="text-slate-400 hover:underline cursor-pointer bg-transparent border-0 p-0">清除</button>
            </div>

            <h2 className="font-bold text-slate-800 mb-3">2. 出題順序</h2>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {([["seq", "照順序", "×1、×2、×3…"], ["random", "打亂", "順序不固定"]] as const).map(([id, t, d]) => (
                <button key={id} onClick={() => setOrder(id)} aria-pressed={order === id} disabled={selected.length > 1}
                  className={`py-3 rounded-xl border-2 cursor-pointer transition ${(selected.length > 1 ? id === "random" : order === id) ? "bg-amber-50 border-amber-400 text-slate-800" : "bg-white border-slate-200 text-slate-500"} ${selected.length > 1 ? "cursor-default" : ""}`}>
                  <span className="block font-bold">{t}</span>
                  <span className="block text-xs text-slate-400">{d}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mb-6">
              {selected.length > 1 ? `選了不只一個乘法時，會打亂後抽 ${MIXED_LENGTH} 題。` : "只選一個乘法時，一輪是 ×1 到 ×9 共 9 題。"}
            </p>

            <button onClick={start} disabled={selected.length === 0}
              className={`w-full py-3.5 rounded-xl font-bold text-lg border-0 ${selected.length === 0 ? "bg-slate-100 text-slate-400" : "bg-gradient-to-r from-amber-400 to-amber-500 text-white cursor-pointer hover:opacity-90"}`}>
              {selected.length === 0 ? "請先選要練的乘法" : `開始練習：${label}`}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">九九乘法表</h2>
            {table(selected.length === 1 ? selected[0] : undefined)}
            <p className="text-xs text-slate-400 text-center mt-4">左邊的數字乘以上面的數字，答案在交叉的格子裡。</p>
          </div>
        </>
      )}

      {/* 練習中 */}
      {current && queue && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 mb-8">
          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <span>{retrying ? "再練一次答錯的題目" : label}</span>
            <span>第 {pos + 1} 題／共 {queue.length} 題</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-amber-400 transition-all" style={{ width: `${(pos / queue.length) * 100}%` }} />
          </div>

          <div className="text-center mb-5" aria-live="polite">
            <div className="text-5xl sm:text-6xl font-black text-slate-800 mb-3">
              {current.a} × {current.b} ={" "}
              <span className={`inline-block min-w-[2.2ch] border-b-4 ${feedback === "right" ? "text-emerald-600 border-emerald-400" : feedback === "wrong" ? "text-red-500 border-red-400" : "text-amber-600 border-amber-300"}`}>
                {input || " "}
              </span>
            </div>
            <div className="h-6 text-base">
              {feedback === "right" && <span className="text-emerald-600 font-semibold">答對了！</span>}
              {feedback === "wrong" && <span className="text-red-500 font-semibold">正確答案是 {current.a * current.b}，這題等一下會再練一次</span>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4 select-none">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(d => (
              <button key={d} onClick={() => press(d)} disabled={!!feedback}
                className="py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-2xl font-bold text-slate-700 cursor-pointer active:scale-95 hover:bg-slate-100">{d}</button>
            ))}
            <button onClick={() => press("back")} disabled={!!feedback} aria-label="刪除一個數字"
              className="py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xl font-bold text-slate-500 cursor-pointer active:scale-95 hover:bg-slate-100">⌫</button>
            <button onClick={() => press("0")} disabled={!!feedback}
              className="py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-2xl font-bold text-slate-700 cursor-pointer active:scale-95 hover:bg-slate-100">0</button>
            <button onClick={() => press("enter")} disabled={!feedback && input === ""}
              className={`py-3.5 rounded-xl border-0 text-base font-bold text-white active:scale-95 ${!feedback && input === "" ? "bg-slate-200" : "bg-amber-500 cursor-pointer hover:bg-amber-600"}`}>
              {feedback ? "下一題" : "確認"}
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center mb-4">用電腦的話，可以直接按鍵盤的數字和 Enter。</p>

          <div className="flex justify-center gap-5 text-sm">
            <button onClick={() => setPeek(v => !v)} className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0">{peek ? "收起乘法表" : "看乘法表"}</button>
            <button onClick={() => setQueue(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0">結束這一輪</button>
          </div>
          {peek && <div className="mt-5">{table(current.a)}</div>}
        </div>
      )}

      {/* 結果 */}
      {done && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 text-center">
          <div className="text-5xl mb-3">{pct === 100 ? "🏆" : pct >= 80 ? "⭐" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">
            {pct === 100 ? "全部答對！" : pct >= 80 ? "不錯，再練一輪會更熟" : "慢慢來，多練幾次就會記住"}
          </h2>
          {done.isBest && <p className="text-sm text-emerald-600">這是你目前的最佳紀錄</p>}
          <div className="grid grid-cols-2 gap-4 my-6 max-w-xs mx-auto">
            <div className="p-4 rounded-xl bg-emerald-50"><div className="text-3xl font-black text-emerald-600">{done.correct}/{done.total}</div><div className="text-xs text-emerald-500 mt-1">第一次就答對</div></div>
            <div className="p-4 rounded-xl bg-amber-50"><div className="text-3xl font-black text-amber-600">{done.seconds}</div><div className="text-xs text-amber-500 mt-1">秒（含重練）</div></div>
          </div>
          {missed.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2">這幾題第一次答錯，可以多唸幾遍：</p>
              <div className="flex flex-wrap justify-center gap-2">
                {missed.map((f, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 font-semibold">{f.a} × {f.b} = {f.a * f.b}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={start} className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-semibold cursor-pointer border-0 hover:bg-amber-600">再練一次</button>
            <button onClick={() => { setQueue(null); setDone(null); }} className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">選其他乘法</button>
          </div>
        </div>
      )}

      {/* 說明（固定顯示，給第一次來的家長和搜尋引擎看） */}
      <section className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-800 mb-3">怎麼用這個練習</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-6">
          <li>剛開始學的孩子，一次只選一個乘法，順序選「照順序」，先把 ×1 到 ×9 唸熟。</li>
          <li>照順序都能答對之後，改成「打亂」，確認不是靠順序背出來的。</li>
          <li>學過兩個以上的乘法，就一起選起來混合練，一輪 {MIXED_LENGTH} 題。</li>
          <li>答錯的題目會排到最後再出一次，結束時會列出第一次答錯的題目。</li>
        </ol>
        <h2 className="text-xl font-bold text-slate-800 mb-3">建議的練習順序</h2>
        <p className="mb-6">
          不一定要從 2 背到 9。可以先練 2 和 5，再練 3、4，最後才是 6、7、8、9。
          乘法有交換律，3 × 7 和 7 × 3 答案一樣，所以越後面要新記的題目其實越少。
        </p>
        <h2 className="text-xl font-bold text-slate-800 mb-3">練熟之後</h2>
        <p>
          九九乘法熟了，可以接著做<a href="/math/basic-arithmetic" className="text-amber-600">四則運算練習</a>和<a href="/math/word-problems" className="text-amber-600">應用題</a>。
          不想只用背的，可以看<a href="/blog/multiplication-table-games" className="text-amber-600">九九乘法的 5 種遊戲練法</a>。
        </p>
      </section>
    </div>
  );
}
