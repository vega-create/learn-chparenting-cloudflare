import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import BoardGameCatalog, { type CatalogCategory } from "@/components/BoardGameCatalog";

export const metadata: Metadata = {
  title: "免費教育桌遊 | 21 款邏輯遊戲・記憶力・數學・程式概念 | learn.chparenting.com",
  description: "21 款免費線上教育桌遊：迷你數獨、數獨、圖案大師、數列探險練邏輯，踩地雷練推理，記憶翻牌、記憶旋律練記憶，程式路徑、迴圈、邏輯閘練程式概念，還有圍棋、跳棋、數學衝刺、英文接龍。每款標明適合年齡與陪玩方式，不用下載、不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/board-games" },
};

const CATEGORIES: CatalogCategory[] = [
  {
    key: "logic", label: "邏輯",
    games: [
      { id: "pattern-master", icon: "🧩", name: "圖案大師", desc: "找出缺失的圖案規律", difficulty: "初級～高級" },
      { id: "mini-sudoku", icon: "🔢", name: "迷你數獨", desc: "4×4 水果數獨，低年級入門", difficulty: "初級～高級" },
      { id: "sudoku", icon: "9️⃣", name: "數獨", desc: "6×6、9×9 數字數獨", difficulty: "入門～高級" },
      { id: "sequence-quest", icon: "🔍", name: "數列探險", desc: "找出數列規律，三種程度", difficulty: "初級～高級" },
    ],
  },
  {
    key: "code", label: "程式",
    games: [
      { id: "code-path", icon: "🤖", name: "程式路徑", desc: "用指令引導角色過關", difficulty: "初級～中級" },
      { id: "logic-gates", icon: "⚡", name: "邏輯閘門", desc: "AND/OR/NOT 邏輯挑戰", difficulty: "初級～中級" },
      { id: "loop-builder", icon: "🔄", name: "迴圈建造師", desc: "用迴圈畫出圖形", difficulty: "中級" },
    ],
  },
  {
    key: "memory", label: "記憶",
    games: [
      { id: "memory-match", icon: "🃏", name: "記憶翻牌", desc: "翻牌配對記憶遊戲", difficulty: "初級～高級" },
      { id: "memory-sequence", icon: "🎵", name: "記憶旋律", desc: "記住燈光順序", difficulty: "初級～高級" },
    ],
  },
  {
    key: "reaction", label: "反應",
    games: [
      { id: "color-tap", icon: "🎨", name: "色彩快手", desc: "Stroop 效應顏色挑戰", difficulty: "中級" },
      { id: "whack-a-mole", icon: "🐹", name: "打地鼠", desc: "快速反應點擊挑戰", difficulty: "初級" },
    ],
  },
  {
    key: "math", label: "數學",
    games: [
      { id: "math-rush", icon: "🧮", name: "數學衝刺", desc: "限時數學計算挑戰", difficulty: "初級～高級" },
      { id: "balloon-math", icon: "🎈", name: "心算氣球", desc: "算式氣球掉下來，算對就打破；速度可選", difficulty: "初級～高級" },
      { id: "speed-sort", icon: "📊", name: "快速排序", desc: "最快速度排好數字", difficulty: "初級～中級" },
    ],
  },
  {
    key: "language", label: "語言",
    games: [
      { id: "word-chain", icon: "🔗", name: "接龍大師", desc: "英文單字接龍挑戰", difficulty: "初級～中級" },
      { id: "word-search", icon: "🔎", name: "單字搜尋", desc: "在字母方陣中找單字", difficulty: "初級～中級" },
    ],
  },
  {
    key: "puzzle", label: "解謎",
    games: [
      { id: "maze-runner", icon: "🏃", name: "迷宮探險", desc: "找出迷宮的出路", difficulty: "初級～高級" },
      { id: "emoji-puzzle", icon: "😀", name: "表情密碼", desc: "破解表情符號方程式", difficulty: "初級～中級" },
      { id: "minesweeper", icon: "💣", name: "踩地雷", desc: "看數字推理，每一盤都不用猜", difficulty: "初級～高級" },
    ],
  },
  {
    key: "board", label: "棋盤",
    games: [
      { id: "go-game", icon: "⚫", name: "圍棋", desc: "9×9 入門圍棋對弈", difficulty: "初級～高級" },
      { id: "chinese-checkers", icon: "🔴", name: "跳棋", desc: "經典跳棋策略遊戲", difficulty: "初級～中級" },
    ],
  },
];

export default function BoardGamesPage() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SubjectVisitTracker subject="board-games" />
        <PageHeader bare eyebrow="教育遊戲專區" title="找一款遊戲，動動腦。" image="/images/banners/board-games.webp"
          desc="邏輯、程式、記憶、反應、數學、語言、棋盤共 21 款，大人小孩都能玩，不用下載、不用註冊。" />
        <BoardGameCatalog categories={CATEGORIES} />
      </div>
    </div>
  );
}
