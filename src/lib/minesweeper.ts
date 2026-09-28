/**
 * 踩地雷的盤面產生與推理。
 *
 * 一般的踩地雷常常玩到最後只能用猜的，猜錯就整盤重來，對孩子很挫折。
 * 這裡在第一次點擊之後才埋雷，而且會先用推理程式把整盤解一次，
 * 確定「不用猜也解得完」才出給孩子。
 *
 * 純運算、不碰 DOM，可以在 Node 裡直接測。
 */

export interface MineBoard {
  rows: number;
  cols: number;
  mines: boolean[];
  counts: number[];   // 每一格周圍有幾顆地雷
}

export function neighbors(rows: number, cols: number, i: number): number[] {
  const r = Math.floor(i / cols), c = i % cols;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push(nr * cols + nc);
    }
  return out;
}

function randomBoard(rows: number, cols: number, mineCount: number, first: number): MineBoard {
  const n = rows * cols;
  // 第一次點的那一格和它周圍都不放地雷，保證一開始就會翻開一片
  const safe = new Set([first, ...neighbors(rows, cols, first)]);
  const spots: number[] = [];
  for (let i = 0; i < n; i++) if (!safe.has(i)) spots.push(i);
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }
  const mines = new Array(n).fill(false);
  for (const s of spots.slice(0, mineCount)) mines[s] = true;
  const counts = mines.map((_, i) => neighbors(rows, cols, i).filter(q => mines[q]).length);
  return { rows, cols, mines, counts };
}

/** 從 start 開始翻開；翻到 0 會連帶翻開周圍。回傳新翻開的格子。 */
export function floodReveal(b: MineBoard, revealed: boolean[], start: number): number[] {
  const opened: number[] = [];
  const stack = [start];
  while (stack.length) {
    const i = stack.pop()!;
    if (revealed[i] || b.mines[i]) continue;
    revealed[i] = true;
    opened.push(i);
    if (b.counts[i] === 0) for (const q of neighbors(b.rows, b.cols, i)) if (!revealed[q]) stack.push(q);
  }
  return opened;
}

/**
 * 只用推理能不能解完整盤。用到兩種推法：
 * 1. 數字＝周圍已確定的地雷數 → 其他沒翻開的都安全；
 *    數字－已確定的地雷數＝剩下沒翻開的格數 → 剩下的全是地雷。
 * 2. 兩個數字比較：A 的未知格全部包含在 B 的未知格裡時，
 *    B 多出來的那幾格的地雷數＝兩者相減。
 */
export function solvableWithoutGuessing(b: MineBoard, first: number): boolean {
  const n = b.rows * b.cols;
  const revealed = new Array(n).fill(false);
  const flagged = new Array(n).fill(false);
  floodReveal(b, revealed, first);
  const nb = Array.from({ length: n }, (_, i) => neighbors(b.rows, b.cols, i));

  let progress = true;
  while (progress) {
    progress = false;
    const info: { unknown: number[]; rest: number }[] = [];
    for (let i = 0; i < n; i++) {
      if (!revealed[i] || b.counts[i] === 0) continue;
      const unknown = nb[i].filter(q => !revealed[q] && !flagged[q]);
      if (unknown.length === 0) continue;
      const rest = b.counts[i] - nb[i].filter(q => flagged[q]).length;
      if (rest === 0) { for (const q of unknown) floodReveal(b, revealed, q); progress = true; }
      else if (rest === unknown.length) { for (const q of unknown) flagged[q] = true; progress = true; }
      else info.push({ unknown, rest });
    }
    if (progress) continue;
    outer: for (const a of info) {
      for (const c of info) {
        if (a === c || a.unknown.length >= c.unknown.length) continue;
        if (!a.unknown.every(q => c.unknown.includes(q))) continue;
        const extra = c.unknown.filter(q => !a.unknown.includes(q));
        const diff = c.rest - a.rest;
        if (diff === 0) { for (const q of extra) floodReveal(b, revealed, q); progress = true; break outer; }
        if (diff === extra.length) { for (const q of extra) flagged[q] = true; progress = true; break outer; }
      }
    }
  }
  for (let i = 0; i < n; i++) if (!b.mines[i] && !revealed[i]) return false;
  return true;
}

/** 產生一盤不用猜的踩地雷。noGuess 表示有沒有成功（試很多次都不行時會回傳最後一盤）。 */
export function generateBoard(rows: number, cols: number, mineCount: number, first: number): MineBoard & { noGuess: boolean } {
  let b = randomBoard(rows, cols, mineCount, first);
  for (let attempt = 0; attempt < 400; attempt++) {
    if (solvableWithoutGuessing(b, first)) return { ...b, noGuess: true };
    b = randomBoard(rows, cols, mineCount, first);
  }
  return { ...b, noGuess: false };
}
