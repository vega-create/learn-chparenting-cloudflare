"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import InfoIcon, { type InfoIconName } from "@/components/InfoPageIcons";

type FaqGroup = "start" | "content" | "device" | "records";

const GROUPS: { key: FaqGroup | "all"; label: string; icon: InfoIconName }[] = [
  { key: "all", label: "全部問題", icon: "list" },
  { key: "start", label: "開始使用", icon: "book" },
  { key: "content", label: "學習內容", icon: "pen" },
  { key: "device", label: "裝置與網路", icon: "phone" },
  { key: "records", label: "學習紀錄", icon: "clock" },
];

const FAQ_ITEMS: { group: FaqGroup; q: string; a: string }[] = [
  {
    group: "start",
    q: "這個平台完全免費嗎？",
    a: "是的！所有功能都完全免費，不會有任何隱藏收費。我們希望讓每個家庭都能使用優質的學習資源，不需要花補習費。",
  },
  {
    group: "start",
    q: "需要註冊才能使用嗎？",
    a: "所有學習功能都不需要註冊，直接開始學習就好！如果想追蹤學習進度和紀錄成績，可以點右上角的「登入」按鈕，用 Google 帳號快速登入即可。",
  },
  {
    group: "start",
    q: "適合什麼年齡的學生？",
    a: "英檢初級適合國中生（12-15 歲），中級適合高中生（15-18 歲），中高級適合大學生或成人。日文 JLPT N5 適合入門學習者，N4～N1 適合進階到高級學習者。教育桌遊適合 6-15 歲兒童，打字練習則適合所有年齡。依照自己的程度選擇即可！",
  },
  {
    group: "content",
    q: "平台上有哪些學習內容？",
    a: "目前提供九大學習工具：① 全民英檢（94 個單元，涵蓋 8,000+ 單字，初級・中級・中高級完整聽說讀寫練習）；② JLPT 日文檢定（N5～N1 全 5 個級別，每級 20 單元共 100 單元）；③ 教育桌遊（21 款遊戲）；④ 國語學習（注音・生字・成語・閱讀理解）；⑤ 數學練習（8 大主題）；⑥ 歷史地理（台灣・亞洲・世界）；⑦ 打字練習（中英雙語打字訓練）；⑧ 樂理基礎（音符・音階・和弦）；⑨ 兒童理財（6 個互動模組）。此外還有學習成就系統、報考資訊頁面和 204 個單元的家長陪伴指南。",
  },
  {
    group: "device",
    q: "可以在手機上使用嗎？",
    a: "可以！本平台支援手機、平板、電腦等各種裝置。我們針對手機做了特別優化，底部有專用導航列，使用起來就像 App 一樣方便。",
  },
  {
    group: "content",
    q: "內容會更新嗎？",
    a: "會！我們持續在新增內容和改善功能。目前英檢、日文 N5～N1、教育桌遊、國語學習、數學練習、歷史地理、打字練習、樂理基礎和兒童理財都已上線。還有 204 個單元的家長陪伴指南、學習成就徽章系統和報考資訊頁面。更多優質內容持續規劃中！",
  },
  {
    group: "start",
    q: "如何回報問題或建議？",
    a: "歡迎透過我們的官網 aimommywisdom.com 聯繫我們。不管是功能建議、錯誤回報，還是想說聲加油，我們都非常歡迎！",
  },
  {
    group: "content",
    q: "日文 JLPT 學習工具有什麼功能？",
    a: "JLPT N5～N1 全 5 個級別已全部上線！每個級別各有 20 個學習單元，涵蓋單字（附例句）、文法解說、聽力練習、閱讀理解和綜合測驗。N5 還有五十音互動教學。每個級別都提供 5 種遊戲模式、模擬測驗、口說練習和寫作練習（句子重組、中翻日、引導式寫作）。",
  },
  {
    group: "content",
    q: "教育桌遊有哪些遊戲？",
    a: "教育桌遊專區共有 21 款遊戲，分為 8 大類：邏輯開發（圖案大師、迷你數獨、數獨、數列探險）、程式概念（程式路徑、邏輯閘門、迴圈建造師）、記憶力（記憶翻牌、記憶旋律）、反應力（色彩快手、打地鼠）、數學挑戰（數學衝刺、心算氣球、快速排序）、語言探索（接龍大師、單字搜尋）、解謎冒險（迷宮探險、表情密碼、踩地雷）、動腦棋盤（9×9 圍棋、跳棋）。",
  },
  {
    group: "content",
    q: "數學練習有哪些內容？",
    a: "數學練習涵蓋 8 大主題：基礎運算、分數、小數、百分比、幾何、代數入門、應用題、時間與計量。每個主題都有觀念教學（含範例解說）、互動練習（15 題含詳解）和限時挑戰模式。適合國小到國中學生，可以到 /math 開始學習！",
  },
  {
    group: "content",
    q: "兒童理財有哪些功能？",
    a: "兒童理財共有 6 個互動模組：認識金錢（知識卡片 + 小測驗）、需要 vs 想要（30 題分類遊戲）、儲蓄計算機（設定目標，計算每天要存多少）、零用錢分配（學習分配儲蓄/需要/想要/分享）、紅包理財（模擬紅包分配決策）、記帳小達人（7 天模擬記帳 + 徽章）。適合國小學生培養金錢觀念！",
  },
  {
    group: "records",
    q: "什麼是學習成就系統？",
    a: "學習成就系統共有 18 個徽章，涵蓋新手里程碑、學科精通、桌遊成就、持續學習、探索達人和趣味成就六大類別。完成特定學習目標就能解鎖徽章，所有資料存在你的瀏覽器中，不需要登入。可以到「學習成就」頁面查看你的收集進度！",
  },
  {
    group: "content",
    q: "家長陪伴指南是什麼？",
    a: "我們為全民英檢（初級・中級・中高級）和 JLPT（N5～N1）共 8 個等級準備了 204 個單元的家長陪伴指南。每個單元都有今日主題、學習目標、陪伴方式、過關清單和常見問題。可以到「陪伴指南」頁面查看，也可以輸入 email 索取完整 ebook PDF。",
  },
  {
    group: "content",
    q: "哪裡可以看到英檢和日檢的報名資訊？",
    a: "點選上方選單的「更多 → 報考資訊」，可以看到全民英檢 GEPT 和 JLPT 日檢的報名時間、費用和考試時程。資料僅供參考，實際請以各官方網站公告為準。",
  },
  {
    group: "start",
    q: "這個平台和官方全民英檢有關嗎？",
    a: "沒有，本平台是獨立的免費學習資源，與 LTTC 財團法人語言訓練測驗中心（全民英檢官方機構）無關。我們只是提供輔助練習工具。",
  },
  {
    group: "device",
    q: "可以離線使用嗎？",
    a: "目前需要網路連線才能使用。部分功能（如電子書瀏覽）在載入後可以在短暫斷線時繼續使用，但完整功能建議在有網路的環境下操作。",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [group, setGroup] = useState<FaqGroup | "all">("all");
  const [query, setQuery] = useState("");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const q = query.trim().toLowerCase();
  const isVisible = (item: (typeof FAQ_ITEMS)[number]) =>
    (group === "all" || item.group === group) &&
    (!q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q));
  const visibleCount = FAQ_ITEMS.filter(isVisible).length;

  return (
    <div className="bg-white pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <PageHeader bare eyebrow="使用協助" title="常見問題" desc="關於親子多元學習平台的常見問題" image="/images/banners/faq.webp" />

        {/* 搜尋 */}
        <label className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 mb-4 focus-within:border-[#2457A7]">
          <InfoIcon name="search" size={20} className="text-[#52616B]" />
          <span className="sr-only">搜尋使用問題</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋使用問題，例如：手機、免費、成就"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base text-[#263238] placeholder:text-slate-400"
          />
        </label>

        {/* 分類 */}
        <div role="tablist" aria-label="問題分類" className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {GROUPS.map((g) => {
            const active = group === g.key;
            return (
              <button
                key={g.key}
                role="tab"
                aria-selected={active}
                onClick={() => setGroup(g.key)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold cursor-pointer transition ${
                  active
                    ? "bg-[#FDECF1] border-[#F5B8C9] text-[#C2416A]"
                    : "bg-white border-slate-200 text-[#263238] hover:border-slate-300"
                }`}
              >
                <InfoIcon name={g.icon} size={18} /> {g.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} hidden={!isVisible(item)} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="w-full text-left px-4 py-4 md:px-5 flex items-center gap-3 bg-transparent border-0 cursor-pointer"
                >
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#FDECF1] text-[#C2416A] font-bold text-sm flex items-center justify-center">Q</span>
                  <span className="flex-1 font-bold text-[#263238] md:text-lg">{item.q}</span>
                  <InfoIcon name="chevron" size={20} className={`text-[#52616B] transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="px-4 pb-4 md:px-5 md:pb-5">
                    <div className="rounded-xl bg-[#FDF3F6] px-4 py-3.5 text-[#263238] leading-7">
                      {item.a}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {visibleCount === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-[#52616B]">
              找不到相關問題，試試其他關鍵字，或切換到「全部問題」。
            </div>
          )}
        </div>

        <div className="mt-10 bg-[#EEF3FA] rounded-2xl p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="w-12 h-12 shrink-0 rounded-full bg-white text-[#2457A7] flex items-center justify-center">
            <InfoIcon name="chat" size={26} />
          </span>
          <div className="flex-1">
            <p className="text-lg font-bold text-[#263238] m-0">還有其他問題？</p>
            <p className="text-sm text-[#52616B] mt-1 mb-0">不管是功能建議、錯誤回報，還是想說聲加油，都歡迎聯繫我們。</p>
          </div>
          <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-[#2457A7] text-white rounded-xl font-bold text-sm hover:bg-[#1d4a8f] transition no-underline">
            聯繫我們 <InfoIcon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
