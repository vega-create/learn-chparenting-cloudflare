/**
 * 9×9 圍棋的電腦對手（蒙地卡羅樹搜尋，MCTS＋RAVE）。
 *
 * 為什麼換掉原本的下法：舊版三種難度都只看「這一步」的分數，
 * 不會救自己快被吃的棋、會把自己的眼填掉、而且只要還有地方能下就不會虛手，
 * 最後常常自己把自己的棋塞死，孩子不用想就能贏。
 *
 * 這裡的做法是每一步都實際「模擬下完整盤」幾百到幾千次，選勝率最高的一步。
 * 難度用模擬次數控制。終局用模擬結果判斷每一格歸誰，死子會自動算給對方。
 *
 * 純運算、不碰 DOM，可以在 Node 裡直接測。
 */

export const N = 9;
const NN = N * N;
export const KOMI = 6.5;
export type Color = 1 | 2; // 1 = 黑（玩家），2 = 白（電腦）

const NEI: number[][] = [];
const DIAG: number[][] = [];
for (let i = 0; i < NN; i++) {
  const r = Math.floor(i / N), c = i % N;
  const n: number[] = [], d: number[] = [];
  if (r > 0) n.push(i - N);
  if (r < N - 1) n.push(i + N);
  if (c > 0) n.push(i - 1);
  if (c < N - 1) n.push(i + 1);
  if (r > 0 && c > 0) d.push(i - N - 1);
  if (r > 0 && c < N - 1) d.push(i - N + 1);
  if (r < N - 1 && c > 0) d.push(i + N - 1);
  if (r < N - 1 && c < N - 1) d.push(i + N + 1);
  NEI.push(n); DIAG.push(d);
}

/* 共用的暫存區：用「戳記」代替每次清空陣列 */
const seen = new Int32Array(NN);
const libSeen = new Int32Array(NN);
let stamp = 0;
const stack = new Int32Array(NN);
const groupBuf = new Int32Array(NN);

/** 找出 start 所在的整塊棋，放進 groupBuf，回傳棋子數 */
function collectGroup(b: Int8Array, start: number): number {
  const color = b[start];
  stamp++;
  let sp = 0, n = 0;
  stack[sp++] = start; seen[start] = stamp;
  while (sp > 0) {
    const p = stack[--sp];
    groupBuf[n++] = p;
    const ns = NEI[p];
    for (let k = 0; k < ns.length; k++) {
      const q = ns[k];
      if (b[q] === color && seen[q] !== stamp) { seen[q] = stamp; stack[sp++] = q; }
    }
  }
  return n;
}

/** 這塊棋的氣數，數到 limit 就停。lastLib 會記下最後找到的那口氣 */
let lastLib = -1;
function countLibs(b: Int8Array, start: number, limit: number): number {
  const color = b[start];
  stamp++;
  let sp = 0, libs = 0;
  stack[sp++] = start; seen[start] = stamp;
  while (sp > 0) {
    const p = stack[--sp];
    const ns = NEI[p];
    for (let k = 0; k < ns.length; k++) {
      const q = ns[k];
      if (b[q] === 0) {
        if (libSeen[q] !== stamp) { libSeen[q] = stamp; lastLib = q; if (++libs >= limit) return libs; }
      } else if (b[q] === color && seen[q] !== stamp) { seen[q] = stamp; stack[sp++] = q; }
    }
  }
  return libs;
}

export interface KoRef { ko: number }

/**
 * 在 b 上落子（直接改 b）。不合法（自殺、打劫）回傳 -1 且 b 不變；
 * 合法回傳提掉的子數，並更新 st.ko。
 */
function play(b: Int8Array, pos: number, color: Color, st: KoRef): number {
  if (b[pos] !== 0 || pos === st.ko) return -1;
  const opp = color === 1 ? 2 : 1;
  b[pos] = color;
  let captured = 0, capPos = -1;
  const ns = NEI[pos];
  for (let k = 0; k < ns.length; k++) {
    const q = ns[k];
    if (b[q] === opp && countLibs(b, q, 1) === 0) {
      const n = collectGroup(b, q);
      for (let j = 0; j < n; j++) b[groupBuf[j]] = 0;
      captured += n;
      capPos = q;
    }
  }
  if (captured === 0 && countLibs(b, pos, 1) === 0) { b[pos] = 0; return -1; }
  // 打劫：只提一子、自己是單獨一子、而且只剩一口氣
  st.ko = -1;
  if (captured === 1) {
    let alone = true;
    for (let k = 0; k < ns.length; k++) if (b[ns[k]] === color) alone = false;
    if (alone && countLibs(b, pos, 2) === 1) st.ko = capPos;
  }
  return captured;
}

/** pos 是不是 color 自己的眼（填掉會自殺式地害死自己的棋，所以不下） */
function isOwnEye(b: Int8Array, pos: number, color: Color): boolean {
  const ns = NEI[pos];
  for (let k = 0; k < ns.length; k++) if (b[ns[k]] !== color) return false;
  const ds = DIAG[pos];
  let bad = 0;
  for (let k = 0; k < ds.length; k++) if (b[ds[k]] !== color && b[ds[k]] !== 0) bad++;
  return ds.length < 4 ? bad === 0 : bad <= 1;
}

const empties = new Int32Array(NN);

/** 模擬時選一步：先處理「叫吃」，其餘隨機；沒有可下的地方回傳 -1（虛手） */
function playoutMove(b: Int8Array, color: Color, st: KoRef, lastMove: number): number {
  if (lastMove >= 0 && b[lastMove] !== 0 && Math.random() < 0.9) {
    // 對方剛下的那塊棋只剩一口氣：吃掉它
    if (countLibs(b, lastMove, 2) === 1) {
      const lib = lastLib;
      if (play(b, lib, color, st) >= 0) return lib;
    }
    // 自己的棋被叫吃：往外長（那一點周圍要有兩個以上空點才值得）
    const ns = NEI[lastMove];
    for (let k = 0; k < ns.length; k++) {
      const q = ns[k];
      if (b[q] === color && countLibs(b, q, 2) === 1) {
        const lib = lastLib;
        let room = 0;
        const ls = NEI[lib];
        for (let j = 0; j < ls.length; j++) if (b[ls[j]] === 0) room++;
        if (room >= 2 && play(b, lib, color, st) >= 0) return lib;
      }
    }
  }
  let n = 0;
  for (let i = 0; i < NN; i++) if (b[i] === 0) empties[n++] = i;
  while (n > 0) {
    const k = Math.floor(Math.random() * n);
    const p = empties[k];
    empties[k] = empties[--n];
    if (isOwnEye(b, p, color)) continue;
    if (play(b, p, color, st) >= 0) return p;
  }
  return -1;
}

/** 盤面下完後每一格歸誰：有棋子算棋子的，空點四周都是同一色就算那一色 */
function ownerAt(b: Int8Array, i: number): number {
  if (b[i] !== 0) return b[i];
  const ns = NEI[i];
  let c = 0;
  for (let k = 0; k < ns.length; k++) {
    const v = b[ns[k]];
    if (v === 0) return 0;
    if (c === 0) c = v; else if (c !== v) return 0;
  }
  return c;
}

const MAX_PLAYOUT_MOVES = 150;
const amaf = new Int8Array(NN); // 這一次模擬裡，每一格最先是誰下的

/** 從目前盤面隨機下到終局，回傳黑棋贏了沒。sim 會被改掉。 */
function playout(sim: Int8Array, toPlay: Color, st: KoRef, lastMove: number, owners?: Int32Array): boolean {
  let color = toPlay, passes = 0, last = lastMove;
  for (let m = 0; m < MAX_PLAYOUT_MOVES && passes < 2; m++) {
    const p = playoutMove(sim, color, st, last);
    if (p < 0) { passes++; st.ko = -1; last = -1; }
    else { passes = 0; last = p; if (amaf[p] === 0) amaf[p] = color; }
    color = color === 1 ? 2 : 1;
  }
  let black = 0, white = 0;
  for (let i = 0; i < NN; i++) {
    const o = ownerAt(sim, i);
    if (o === 1) { black++; if (owners) owners[i]++; }
    else if (o === 2) { white++; if (owners) owners[i]--; }
  }
  return black > white + KOMI;
}

/* 給測試和畫面用的小工具 */
export const playMove = play;
export const libertiesOf = (b: Int8Array, pos: number) => countLibs(b, pos, 99);
export const groupSizeOf = (b: Int8Array, pos: number) => collectGroup(b, pos);

/* ─── 終局判定 ─── */

export interface ScoreEstimate {
  black: number;          // 黑棋的目數（棋子＋地）
  white: number;          // 白棋的目數，不含貼目
  owner: number[];        // 每一格歸誰：1 黑、2 白、0 都不算
  dead: number[];         // 被判定為死子的位置
}

/** 用多次模擬判斷每一格最後歸誰，死子會算給對方 */
export function estimateScore(board: ArrayLike<number>, playouts = 300): ScoreEstimate {
  const owners = new Int32Array(NN);
  const sim = new Int8Array(NN);
  const st: KoRef = { ko: -1 };
  for (let k = 0; k < playouts; k++) {
    for (let i = 0; i < NN; i++) sim[i] = board[i];
    st.ko = -1;
    playout(sim, k % 2 === 0 ? 1 : 2, st, -1, owners);
  }
  const owner: number[] = [], dead: number[] = [];
  let black = 0, white = 0;
  const cut = playouts * 0.2; // 超過六成的模擬都歸同一方才算
  for (let i = 0; i < NN; i++) {
    const o = owners[i] > cut ? 1 : owners[i] < -cut ? 2 : 0;
    owner.push(o);
    if (o === 1) black++; else if (o === 2) white++;
    if (board[i] !== 0 && o !== 0 && o !== board[i]) dead.push(i);
  }
  return { black, white, owner, dead };
}

/* ─── MCTS ─── */

interface Node {
  move: number;        // -1 = 虛手
  color: Color;        // 下這一步的人
  visits: number;
  wins: number;        // 以 color 的角度算
  raveVisits: number;
  raveWins: number;
  children: Node[] | null;
}

const RAVE_K = 400;
const UCT_C = 0.35;

function candidates(b: Int8Array, color: Color, ko: number): number[] {
  const out: number[] = [];
  const tmp = new Int8Array(NN);
  const st: KoRef = { ko };
  for (let i = 0; i < NN; i++) {
    if (b[i] !== 0 || i === ko || isOwnEye(b, i, color)) continue;
    tmp.set(b); st.ko = ko;
    if (play(tmp, i, color, st) >= 0) out.push(i);
  }
  return out;
}

function selectChild(node: Node): Node {
  const kids = node.children!;
  const logN = Math.log(node.visits + 1);
  let best = kids[0], bestV = -Infinity;
  for (let k = 0; k < kids.length; k++) {
    const ch = kids[k];
    let v: number;
    if (ch.visits === 0) {
      v = (ch.raveVisits > 0 ? ch.raveWins / ch.raveVisits : 0.5) + 0.3 + Math.random() * 0.01;
    } else {
      const q = ch.wins / ch.visits;
      const beta = ch.raveVisits > 0 ? Math.sqrt(RAVE_K / (3 * ch.visits + RAVE_K)) : 0;
      const qr = ch.raveVisits > 0 ? ch.raveWins / ch.raveVisits : 0;
      v = (1 - beta) * q + beta * qr + UCT_C * Math.sqrt(logN / ch.visits);
    }
    if (v > bestV) { bestV = v; best = ch; }
  }
  return best;
}

export interface AiOptions {
  playouts: number;                       // 最多模擬幾次
  timeMs: number;                         // 最多想多久
  isAllowed?: (pos: number) => boolean;   // 額外的合法性檢查（例如同形再現）
  opponentPassed?: boolean;               // 對方剛剛虛手
  randomMove?: number;                    // 有多少機率隨便下一步（初級用，讓初學的孩子有機會）
  moveNumber?: number;
}

export interface AiResult {
  move: number | null;    // null = 虛手
  resign: boolean;
  winRate: number;        // 白棋估計勝率
  playouts: number;
}

const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/**
 * 替 color 選一步。分段執行，每 30 毫秒讓出一次主執行緒，畫面不會卡住。
 */
export async function chooseMove(board: ArrayLike<number>, color: Color, opts: AiOptions): Promise<AiResult> {
  const root0 = new Int8Array(NN);
  for (let i = 0; i < NN; i++) root0[i] = board[i];
  const opp: Color = color === 1 ? 2 : 1;

  // 對方虛手：如果現在算起來已經贏了，就跟著虛手結束
  if (opts.opponentPassed) {
    const est = estimateScore(root0, 200);
    const mine = color === 2 ? est.white + KOMI : est.black;
    const theirs = color === 2 ? est.black : est.white + KOMI;
    if (mine > theirs) return { move: null, resign: false, winRate: 1, playouts: 200 };
  }

  let rootMoves = candidates(root0, color, -1);
  if (opts.isAllowed) rootMoves = rootMoves.filter(opts.isAllowed);
  if (rootMoves.length === 0) return { move: null, resign: false, winRate: 0.5, playouts: 0 };

  if (opts.randomMove && Math.random() < opts.randomMove) {
    return { move: rootMoves[Math.floor(Math.random() * rootMoves.length)], resign: false, winRate: 0.5, playouts: 0 };
  }

  const mk = (move: number, c: Color): Node => ({ move, color: c, visits: 0, wins: 0, raveVisits: 0, raveWins: 0, children: null });
  const root: Node = mk(-1, opp);
  root.children = rootMoves.map(m => mk(m, color));

  const sim = new Int8Array(NN);
  const st: KoRef = { ko: -1 };
  const path: Node[] = [];
  const started = now();
  let done = 0, sliceStart = started;

  while (done < opts.playouts) {
    sim.set(root0); st.ko = -1; amaf.fill(0);
    path.length = 0;
    let node = root, toPlay: Color = color, last = -1, passes = 0;
    path.push(node);

    // 往下走到還沒展開的節點
    while (node.children && node.children.length > 0) {
      node = selectChild(node);
      if (node.move >= 0) {
        play(sim, node.move, node.color, st);
        if (amaf[node.move] === 0) amaf[node.move] = node.color;
        last = node.move; passes = 0;
      } else { st.ko = -1; last = -1; passes++; }
      toPlay = node.color === 1 ? 2 : 1;
      path.push(node);
      if (passes >= 2) break;
    }
    // 展開
    if (!node.children && node.visits >= 2 && passes < 2) {
      const ms = candidates(sim, toPlay, st.ko);
      node.children = ms.length > 0 ? ms.map(m => mk(m, toPlay)) : [mk(-1, toPlay)];
    }

    const blackWon = passes >= 2 ? playout(sim, toPlay, st, -1) : playout(sim, toPlay, st, last);

    for (let d = 0; d < path.length; d++) {
      const nd = path[d];
      nd.visits++;
      if ((nd.color === 1) === blackWon) nd.wins++;
      // RAVE：這個節點的子節點裡，凡是這次模擬中「同一方」下過的點都一起更新
      const kids = nd.children;
      if (kids) {
        for (let k = 0; k < kids.length; k++) {
          const ch = kids[k];
          if (ch.move >= 0 && amaf[ch.move] === ch.color) {
            ch.raveVisits++;
            if ((ch.color === 1) === blackWon) ch.raveWins++;
          }
        }
      }
    }
    done++;

    if ((done & 15) === 0) {
      const t = now();
      if (t - started > opts.timeMs) break;
      if (t - sliceStart > 30) {
        await new Promise<void>(r => setTimeout(r, 0));
        sliceStart = now();
      }
    }
  }

  // 選被模擬最多次的那一步
  let best = root.children[0];
  for (const ch of root.children) if (ch.visits > best.visits) best = ch;
  const winRate = best.visits > 0 ? best.wins / best.visits : 0.5;

  // 幾乎沒有機會了就認輸（開局不認輸，模擬次數太少也不認輸）
  if ((opts.moveNumber ?? 0) > 40 && best.visits >= 100 && winRate < 0.05) {
    return { move: null, resign: true, winRate, playouts: done };
  }
  return { move: best.move, resign: false, winRate, playouts: done };
}

/* ─── 難度 ─── */

export type GoLevel = "easy" | "medium" | "hard";

export const GO_LEVELS: Record<GoLevel, { playouts: number; timeMs: number; randomMove?: number }> = {
  easy: { playouts: 40, timeMs: 400, randomMove: 0.25 },
  medium: { playouts: 400, timeMs: 900 },
  hard: { playouts: 6000, timeMs: 2500 },
};
