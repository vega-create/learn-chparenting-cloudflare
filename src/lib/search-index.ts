/**
 * 首頁搜尋用的內容索引（伺服器端組好，傳給 HomeSearch）。
 * 只收已上線、點得進去的內容：科目、級別、單元、工具、桌遊、文章。
 * 新增科目或工具時，記得也加到 SUBJECT_ENTRIES / TOOL_ENTRIES。
 */
import { UNITS as EL_UNITS } from "@/data/elementary";
import { INTER_UNITS } from "@/data/intermediate";
import { UI_UNITS } from "@/data/upper-intermediate";
import { N5_UNITS } from "@/data/jlpt-n5";
import { N4_UNITS } from "@/data/jlpt-n4";
import { N3_UNITS } from "@/data/jlpt-n3";
import { N2_UNITS } from "@/data/jlpt-n2";
import { N1_UNITS } from "@/data/jlpt-n1";
import { BOARD_GAMES } from "@/data/board-games";
import { getAllPosts } from "@/lib/blog";

export interface SearchEntry {
  title: string;
  group: string;   // 顯示在結果右邊的分類
  href: string;
  keywords: string; // 額外比對用的字，不顯示
}

const SUBJECT_ENTRIES: SearchEntry[] = [
  { title: "全民英檢初級", group: "英文與英檢", href: "/elementary", keywords: "GEPT 初級 英檢 國中 A2" },
  { title: "全民英檢中級", group: "英文與英檢", href: "/intermediate", keywords: "GEPT 中級 英檢 高中 B1" },
  { title: "全民英檢中高級", group: "英文與英檢", href: "/upper-intermediate", keywords: "GEPT 中高級 英檢 大學 B2" },
  { title: "英檢初級模擬測驗", group: "英文與英檢", href: "/elementary/mock-test", keywords: "模考 模擬考 GEPT" },
  { title: "英檢中級模擬測驗", group: "英文與英檢", href: "/intermediate/mock-test", keywords: "模考 模擬考 GEPT" },
  { title: "英檢中高級模擬測驗", group: "英文與英檢", href: "/upper-intermediate/mock-test", keywords: "模考 模擬考 GEPT" },
  { title: "英檢中級口說訓練", group: "英文與英檢", href: "/intermediate/speaking", keywords: "口說 發音 跟讀" },
  { title: "英檢中級寫作練習", group: "英文與英檢", href: "/intermediate/writing", keywords: "寫作 翻譯 句子重組" },
  { title: "日文五十音", group: "日文學習", href: "/jlpt-n5/gojuon", keywords: "平假名 片假名 五十音 gojuon" },
  { title: "日檢 N5（入門）", group: "日文學習", href: "/jlpt-n5", keywords: "JLPT N5 日文 日語" },
  { title: "日檢 N4（基礎）", group: "日文學習", href: "/jlpt-n4", keywords: "JLPT N4 日文 日語" },
  { title: "日檢 N3（中級）", group: "日文學習", href: "/jlpt-n3", keywords: "JLPT N3 日文 日語" },
  { title: "日檢 N2（上級）", group: "日文學習", href: "/jlpt-n2", keywords: "JLPT N2 日文 日語" },
  { title: "日檢 N1（最上級）", group: "日文學習", href: "/jlpt-n1", keywords: "JLPT N1 日文 日語" },
  { title: "國語學習", group: "國語與閱讀", href: "/chinese-lang", keywords: "國語 注音 生字 閱讀 修辭" },
  { title: "低年級國語", group: "國語與閱讀", href: "/chinese-lang/lower", keywords: "一年級 二年級 小一 小二 注音" },
  { title: "中年級國語", group: "國語與閱讀", href: "/chinese-lang/middle", keywords: "三年級 四年級 小三 小四" },
  { title: "高年級國語", group: "國語與閱讀", href: "/chinese-lang/high", keywords: "五年級 六年級 小五 小六" },
  { title: "注音符號練習", group: "國語與閱讀", href: "/chinese-lang/lower/zhuyin", keywords: "注音 ㄅㄆㄇ 小一" },
  { title: "成語練習（填空、配對、列印學習單）", group: "國語與閱讀", href: "/chinese-lang/idiom-practice", keywords: "成語 列印 學習單" },
  { title: "數學練習", group: "數學練習", href: "/math", keywords: "數學 運算" },
  { title: "九九乘法練習", group: "數學練習", href: "/math/times-table", keywords: "九九乘法 乘法表 背乘法" },
  { title: "基礎運算", group: "數學練習", href: "/math/basic-arithmetic", keywords: "加法 減法 乘法 除法" },
  { title: "分數", group: "數學練習", href: "/math/fractions", keywords: "分數" },
  { title: "小數", group: "數學練習", href: "/math/decimals", keywords: "小數" },
  { title: "百分比", group: "數學練習", href: "/math/percentages", keywords: "百分比 折扣" },
  { title: "幾何", group: "數學練習", href: "/math/geometry", keywords: "面積 周長 圖形" },
  { title: "應用題", group: "數學練習", href: "/math/word-problems", keywords: "應用題 文字題" },
  { title: "時間與計量", group: "數學練習", href: "/math/time-measurement", keywords: "時間 單位換算" },
  { title: "代數入門", group: "數學練習", href: "/math/intro-algebra", keywords: "代數 方程式 未知數" },
  { title: "教育桌遊（21 款）", group: "邏輯與教育遊戲", href: "/board-games", keywords: "遊戲 桌遊 邏輯 記憶 程式" },
  { title: "打字練習", group: "打字與鍵盤", href: "/typing-game", keywords: "打字 中文打字 英文打字 速度" },
  { title: "鍵盤位置練習", group: "打字與鍵盤", href: "/typing-game/keyboard", keywords: "鍵盤 基準鍵 指法 入門" },
  { title: "歷史地理", group: "歷史與地理", href: "/history-geo", keywords: "歷史 地理 社會" },
  { title: "台灣篇", group: "歷史與地理", href: "/history-geo/taiwan", keywords: "台灣歷史 台灣地理 台灣文化" },
  { title: "亞洲篇", group: "歷史與地理", href: "/history-geo/asia", keywords: "亞洲歷史 亞洲地理" },
  { title: "世界篇", group: "歷史與地理", href: "/history-geo/world", keywords: "世界歷史 世界地理 世界文化" },
  { title: "樂理基礎", group: "音樂與樂理", href: "/music", keywords: "音樂 樂理 音符 音階 和弦" },
  { title: "兒童理財", group: "兒童理財", href: "/finance", keywords: "理財 金錢 儲蓄 預算 零用錢 紅包 記帳" },
  { title: "全民英檢與日檢報考資訊", group: "考試資訊", href: "/exam-info", keywords: "報名 考試日期 費用 GEPT JLPT" },
  { title: "家長陪伴指南", group: "家長指南", href: "/parent-guide", keywords: "陪伴 家長 親子共學" },
  { title: "使用說明", group: "說明", href: "/how-to-use", keywords: "怎麼用 教學" },
];

export function buildSearchIndex(): SearchEntry[] {
  const units: SearchEntry[] = [
    ...EL_UNITS.map((u) => ({ title: `英檢初級 Unit ${u.id}：${u.title}`, group: "英檢單元", href: `/elementary/unit/${u.id}`, keywords: "GEPT 初級 單字" })),
    ...INTER_UNITS.map((u) => ({ title: `英檢中級 Unit ${u.id}：${u.title}`, group: "英檢單元", href: `/intermediate/unit/${u.id}`, keywords: "GEPT 中級 單字" })),
    ...UI_UNITS.map((u) => ({ title: `英檢中高級 Unit ${u.id}：${u.title}`, group: "英檢單元", href: `/upper-intermediate/unit/${u.id}`, keywords: "GEPT 中高級 單字" })),
  ];
  const jlpt = ([["N5", N5_UNITS], ["N4", N4_UNITS], ["N3", N3_UNITS], ["N2", N2_UNITS], ["N1", N1_UNITS]] as const).flatMap(
    ([lv, list]) => list.map((u) => ({
      title: `日檢 ${lv} Unit ${u.id}：${u.title}`,
      group: "日檢單元",
      href: `/jlpt-${lv.toLowerCase()}/unit/${u.id}`,
      keywords: `JLPT ${lv} 日文 ${u.titleJa ?? ""}`,
    })),
  );
  const games = BOARD_GAMES.map((g) => ({ title: g.name, group: "教育遊戲", href: `/board-games/${g.id}`, keywords: `${g.category} 遊戲 桌遊` }));
  const posts = getAllPosts().map((p) => ({ title: p.title, group: "學習文章", href: `/blog/${p.slug}`, keywords: `${p.category} ${p.tags.join(" ")}` }));
  return [...SUBJECT_ENTRIES, ...units, ...jlpt, ...games, ...posts];
}
