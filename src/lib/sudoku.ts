/**
 * 數獨產生器（4×4、6×6、9×9 共用）。
 *
 * 為什麼要有這個：原本迷你數獨是把一個固定盤面的「列」整個打亂，
 * 會把不同宮的列換在一起，產生的「解答」常常違反 2×2 宮格規則；
 * 而且題目沒檢查是不是只有一個解，孩子照規則填對了也可能被判錯。
 *
 * 這裡的做法：
 * 1. 用回溯法隨機填出一個完整且合法的盤面。
 * 2. 一格一格挖空，每挖一格就確認「只靠唯一候選數／唯一位置」還解得出來才挖。
 *    這樣出的題目一定只有一個解，而且不用猜、不用進階技巧。
 */

export interface SudokuSpec {
  size: number;   // 邊長：4、6、9
  boxRows: number; // 一個宮有幾列
  boxCols: number; // 一個宮有幾行
}

export const SPEC_4: SudokuSpec = { size: 4, boxRows: 2, boxCols: 2 };
export const SPEC_6: SudokuSpec = { size: 6, boxRows: 2, boxCols: 3 };
export const SPEC_9: SudokuSpec = { size: 9, boxRows: 3, boxCols: 3 };

export type Grid = number[]; // 長度 size*size，0 = 空格，1..size = 數字

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 每一格所屬的三個區域（列、行、宮）裡其他格子的索引 */
function buildPeers(spec: SudokuSpec): number[][] {
  const { size, boxRows, boxCols } = spec;
  const peers: number[][] = [];
  for (let i = 0; i < size * size; i++) {
    const r = Math.floor(i / size), c = i % size;
    const br = Math.floor(r / boxRows) * boxRows, bc = Math.floor(c / boxCols) * boxCols;
    const set = new Set<number>();
    for (let k = 0; k < size; k++) { set.add(r * size + k); set.add(k * size + c); }
    for (let dr = 0; dr < boxRows; dr++)
      for (let dc = 0; dc < boxCols; dc++) set.add((br + dr) * size + (bc + dc));
    set.delete(i);
    peers.push([...set]);
  }
  return peers;
}

/** 所有區域（每列、每行、每宮）各自包含的格子索引 */
function buildUnits(spec: SudokuSpec): number[][] {
  const { size, boxRows, boxCols } = spec;
  const units: number[][] = [];
  for (let r = 0; r < size; r++) units.push(Array.from({ length: size }, (_, c) => r * size + c));
  for (let c = 0; c < size; c++) units.push(Array.from({ length: size }, (_, r) => r * size + c));
  for (let br = 0; br < size; br += boxRows)
    for (let bc = 0; bc < size; bc += boxCols) {
      const u: number[] = [];
      for (let dr = 0; dr < boxRows; dr++)
        for (let dc = 0; dc < boxCols; dc++) u.push((br + dr) * size + (bc + dc));
      units.push(u);
    }
  return units;
}

const canPlace = (g: Grid, peers: number[][], i: number, v: number) => peers[i].every(p => g[p] !== v);

/** 隨機填出一個完整合法的盤面 */
function fillGrid(spec: SudokuSpec, peers: number[][]): Grid {
  const n = spec.size * spec.size;
  const g: Grid = new Array(n).fill(0);
  const digits = Array.from({ length: spec.size }, (_, i) => i + 1);
  const solve = (i: number): boolean => {
    if (i === n) return true;
    for (const v of shuffled(digits)) {
      if (canPlace(g, peers, i, v)) {
        g[i] = v;
        if (solve(i + 1)) return true;
        g[i] = 0;
      }
    }
    return false;
  };
  solve(0);
  return g;
}

/**
 * 只用兩種最基本的方法解題：
 * - 唯一候選數：這一格只剩一個數字可以填
 * - 唯一位置：這一列／行／宮裡，某個數字只剩一格可以放
 * 解得完回傳 true。解得完就代表題目只有一個解，而且不需要猜。
 */
export function solvableBySingles(spec: SudokuSpec, puzzle: Grid, peers = buildPeers(spec), units = buildUnits(spec)): boolean {
  const g = [...puzzle];
  const { size } = spec;
  let progress = true;
  while (progress) {
    progress = false;
    for (let i = 0; i < g.length; i++) {
      if (g[i] !== 0) continue;
      let only = 0, count = 0;
      for (let v = 1; v <= size; v++) if (canPlace(g, peers, i, v)) { only = v; count++; }
      if (count === 0) return false;
      if (count === 1) { g[i] = only; progress = true; }
    }
    for (const u of units) {
      for (let v = 1; v <= size; v++) {
        if (u.some(i => g[i] === v)) continue;
        const spots = u.filter(i => g[i] === 0 && canPlace(g, peers, i, v));
        if (spots.length === 0) return false;
        if (spots.length === 1) { g[spots[0]] = v; progress = true; }
      }
    }
  }
  return g.every(v => v !== 0);
}

export interface SudokuPuzzle {
  spec: SudokuSpec;
  solution: Grid;
  puzzle: Grid;
  givens: number;
}

/**
 * 產生一題數獨。givens 是希望留下的已知格數；
 * 如果挖到某個程度再挖就需要進階技巧，會停在那裡（實際已知格數可能比目標多）。
 */
export function generateSudoku(spec: SudokuSpec, givens: number): SudokuPuzzle {
  const peers = buildPeers(spec);
  const units = buildUnits(spec);
  const n = spec.size * spec.size;
  let best: SudokuPuzzle | null = null;

  // 多試幾個盤面，取最接近目標的一題
  for (let attempt = 0; attempt < 8; attempt++) {
    const solution = fillGrid(spec, peers);
    const puzzle = [...solution];
    let left = n;
    for (const i of shuffled(Array.from({ length: n }, (_, k) => k))) {
      if (left <= givens) break;
      const keep = puzzle[i];
      puzzle[i] = 0;
      if (solvableBySingles(spec, puzzle, peers, units)) left--;
      else puzzle[i] = keep;
    }
    if (!best || left < best.givens) best = { spec, solution, puzzle, givens: left };
    if (left <= givens) break;
  }
  return best!;
}

/** 檢查完整盤面是否合法（測試用） */
export function isValidSolution(spec: SudokuSpec, g: Grid): boolean {
  return buildUnits(spec).every(u => new Set(u.map(i => g[i])).size === spec.size && u.every(i => g[i] >= 1 && g[i] <= spec.size));
}
