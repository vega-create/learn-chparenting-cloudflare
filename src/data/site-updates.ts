/**
 * 首頁跑馬燈「最新消息」的內容。
 *
 * 新增或更新了什麼，就在最上面加一筆；跑馬燈只顯示最新的 MAX_TICKER_ITEMS 筆。
 * 只寫已經上線、點進去真的看得到的東西。
 */
export interface SiteUpdate {
  date: string;              // YYYY-MM-DD
  kind: "新增" | "更新" | "新文章";
  text: string;
  href: string;
}

export const MAX_TICKER_ITEMS = 10;

export const SITE_UPDATES: SiteUpdate[] = [
  { date: "2026-09-29", kind: "更新", text: "每款遊戲右下角都有「怎麼玩」，圍棋、數獨、踩地雷加了圖解", href: "/board-games" },
  { date: "2026-09-28", kind: "新增", text: "數獨：6×6 和 9×9，每一題都不用猜", href: "/board-games/sudoku" },
  { date: "2026-09-28", kind: "新增", text: "踩地雷：第一下一定安全", href: "/board-games/minesweeper" },
  { date: "2026-09-28", kind: "新增", text: "九九乘法練習：答錯的題目會再練一次", href: "/math/times-table" },
  { date: "2026-09-28", kind: "新增", text: "成語練習：填空、配對，還能印學習單", href: "/chinese-lang/idiom-practice" },
  { date: "2026-09-28", kind: "新增", text: "鍵盤位置練習：從基準鍵開始分階段練", href: "/typing-game/keyboard" },
  { date: "2026-09-28", kind: "更新", text: "圍棋的電腦對手變強了，三種程度重新調整", href: "/board-games/go-game" },
  { date: "2026-09-28", kind: "更新", text: "英文接龍字典擴充到 1,800 多個單字", href: "/board-games/word-chain" },
  { date: "2026-09-28", kind: "更新", text: "單字搜尋：點頭尾兩個字母就能選，手機更好玩", href: "/board-games/word-search" },
  { date: "2026-09-28", kind: "新文章", text: "全民英檢初級聽力怎麼練？", href: "/blog/gept-elementary-listening-practice" },
];
