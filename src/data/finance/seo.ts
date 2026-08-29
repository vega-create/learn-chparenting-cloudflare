import { flashCards as mbCards, quizItems as mbQuiz } from "./modules/money-basics";
import { sortingItems } from "./modules/needs-vs-wants";
import { savingsGoals, dailySavingsOptions } from "./modules/savings-calculator";
import { budgetCategories, budgetTips, allowanceAmounts } from "./modules/allowance-budget";
import { scenarios } from "./modules/red-envelope";
import { expenseCategories, sampleTransactions, badges } from "./modules/expense-tracker";

/**
 * 理財區各模組的伺服器端內容。
 *
 * 六個模組頁只渲染 <ClientPage />，伺服器端剩 503-560 字元。各模組的資料形態
 * 差很多：money-basics 與 needs-vs-wants 本來就有大量文字（字卡的正反面、
 * 30 個物品的「為什麼是需要」說明），可以直接取用；savings-calculator 與
 * expense-tracker 則幾乎只有數字與分類標籤，沒有現成敘述。
 *
 * 因此 points 一律取自模組自己的資料，intro 與 tips 則依工具實際的操作流程
 * 撰寫——描述這個工具真正在做什麼，不寫理財成效的宣稱。
 */
export interface FinanceSEO {
  id: string;
  intro: string;
  pointsHeading: string;
  points: string[];
  tips: string[];
}

export const FINANCE_SEO: FinanceSEO[] = [
  {
    id: "money-basics",
    intro: `用 ${mbCards.length} 張字卡認識金錢的基本概念——錢是什麼、什麼是儲蓄、利息、預算、收入與支出，翻開卡片就有解釋。看完字卡接 ${mbQuiz.length} 道小測驗，答完立刻知道對錯。`,
    pointsHeading: "💡 字卡會教到的概念",
    points: mbCards.slice(0, 8).map((c) => `${c.front}　${c.back}`),
    tips: [
      "一次看 3 張字卡就好，看完請孩子用自己的話講一次，講得出來才算懂",
      "「利息」和「預算」對低年級偏抽象，可以用家裡的實例替換：這個月的菜錢就是預算",
      "測驗答錯不用急著解釋，先問他「你覺得為什麼選這個」",
    ],
  },
  {
    id: "needs-vs-wants",
    intro: `把 ${sortingItems.length} 個生活物品分到「需要」和「想要」兩邊，每一項分完都會說明為什麼。這是理財最基礎、也最容易吵架的一題——大人和小孩的答案常常不一樣。`,
    pointsHeading: "💡 這些物品你會怎麼分？",
    points: sortingItems.slice(0, 10).map((s) => `${s.icon} ${s.name}（${s.isNeed ? "需要" : "想要"}）：${s.explanation}`),
    tips: [
      "遇到孩子分錯的，先聽他的理由再看解說，有些答案其實有討論空間",
      "分完可以延伸問：「那你上週買的那個是需要還是想要？」把概念接回真實花費",
      "不用把「想要」講成壞事，理財不是不能想要，是要知道自己在買什麼",
    ],
  },
  {
    id: "savings-calculator",
    intro: `選一個想存的目標，設定每天存多少錢，工具會算出要存幾天才能達成。目標從 ${Math.min(...savingsGoals.map((g) => g.amount))} 元到 ${Math.max(...savingsGoals.map((g) => g.amount))} 元都有，每天存的金額可以選 ${dailySavingsOptions[0]} 到 ${dailySavingsOptions[dailySavingsOptions.length - 1]} 元。`,
    pointsHeading: "💡 可以選的存錢目標",
    points: savingsGoals.slice(0, 8).map((g) => `${g.icon} ${g.name}：${g.amount} 元`),
    tips: [
      "先讓孩子自己選目標再算天數，看到「要存 24 天」的當下，比大人說一百次「存錢很慢」有感",
      "算完可以再試一次：每天多存 5 元會少幾天？這是最直觀的複利前身",
      "目標訂太大容易放棄，第一次建議挑 200 元以內的",
    ],
  },
  {
    id: "allowance-budget",
    intro: `把零用錢分配到${budgetCategories.map((c) => c.label.replace(/^\S+\s*/, "")).join("、")}四個用途，拉動比例就看得到每一份是多少錢。零用錢金額可以選 ${allowanceAmounts[0]} 到 ${allowanceAmounts[allowanceAmounts.length - 1]} 元。`,
    pointsHeading: "💡 分配零用錢的幾個原則",
    points: budgetTips.map((t) => `${t.icon} ${t.title}：${t.tip}`),
    tips: [
      "預設比例只是參考，讓孩子自己調，調完問他為什麼這樣分",
      "「分享」那一份最容易被忽略，可以聊聊要分享給誰、為什麼",
      "分配完先執行一個月再回來調整，比一次想到完美有用",
    ],
  },
  {
    id: "red-envelope",
    intro: `${scenarios.length} 個紅包情境，金額從 ${Math.min(...scenarios.map((s) => s.amount))} 元到 ${Math.max(...scenarios.map((s) => s.amount))} 元，每個情境要決定存起來、花掉、分享各多少。這是一年一次、金額又大的真實決策，最適合拿來練。`,
    pointsHeading: "💡 會遇到的情境",
    points: scenarios.slice(0, 6).map((s) => `${s.title}（${s.amount} 元）：${s.description}`),
    tips: [
      "先讓孩子分完再看建議比例，重點是他有沒有理由，不是有沒有分對",
      "如果他全部選「花掉」，不用急著糾正，問他想買什麼、多久會用完",
      "真的收到紅包時，把這裡的分法拿出來實做一次，效果比模擬強得多",
    ],
  },
  {
    id: "expense-tracker",
    intro: `模擬 7 天的記帳流程：把每一筆花費歸到${expenseCategories.length} 個分類裡，記完看得到自己的錢花到哪去了。內建 ${sampleTransactions.length} 筆範例交易，完成進度還會拿到徽章。`,
    pointsHeading: "💡 記帳的分類與範例",
    points: [
      `分類：${expenseCategories.map((c) => `${c.icon} ${c.label}`).join("、")}`,
      ...sampleTransactions.slice(0, 5).map((t) => `第 ${t.day} 天　${t.desc}　${t.amount} 元`),
      ...badges.slice(0, 3).map((b) => `${b.icon} ${b.name}：${b.condition}`),
    ],
    tips: [
      "記帳的重點不是記得完整，是記完之後有回頭看——問孩子「哪一類花最多？意外嗎？」",
      "7 天結束再一起看總表，比每天叮嚀好，記帳最怕變成另一項功課",
      "孩子如果覺得麻煩，可以只記「零食」一類，能持續比完整重要",
    ],
  },
];

export function getFinanceSEO(id: string): FinanceSEO | undefined {
  return FINANCE_SEO.find((f) => f.id === id);
}
