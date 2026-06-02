import type { Metadata } from "next";
import NewsletterCTA from "@/components/NewsletterCTA";
import DailyChallenge from "@/components/DailyChallenge";
import PracticeCounter from "@/components/PracticeCounter";

export const metadata: Metadata = {
  title: "Learn.chparenting.com 親子多元學習平台 | 華人家庭免費英文・數學・閱讀・注音・AI 工具",
  description: "Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文（全民英檢 GEPT 初級到中高級）、日文（JLPT N5-N1）、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
  alternates: { canonical: "https://learn.chparenting.com" },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://learn.chparenting.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "親子多元學習平台",
  description: "Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "智慧媽咪國際有限公司 Mommy Wisdom International LTD.",
    url: "https://aimommywisdom.com",
  },
};

const TOOLS = [
  {
    id: "gept", title: "全民英檢", sub: "GEPT", icon: "📘",
    desc: "初級・中級・中高級完整學習",
    color: "from-rose-300 to-rose-400", border: "border-rose-200",
    active: true, href: "/elementary",
    features: ["94 單元電子書", "聽說讀寫 + 文法", "7 種遊戲練習", "模擬測驗 + 口說 + 寫作"],
  },
  {
    id: "japanese", title: "日文檢定", sub: "JLPT N5–N1", icon: "🇯🇵",
    desc: "五十音到 N1 完整日文學習",
    color: "from-red-400 to-red-500", border: "border-red-200",
    active: true, href: "/jlpt-n5",
    features: ["五十音教學", "N5～N1 全級別上線", "聽說讀寫完整練習", "JLPT 模擬測驗"],
  },
  {
    id: "boardgames", title: "教育桌遊", sub: "Board Games", icon: "🎲",
    desc: "邏輯・程式・記憶・反應・數學・語言",
    color: "from-orange-400 to-orange-500", border: "border-orange-200",
    active: true, href: "/board-games",
    features: ["18 款教育遊戲", "邏輯推理 + 程式概念", "數學衝刺 + 單字搜尋", "記憶力 + 圍棋 + 跳棋"],
  },
  {
    id: "chinese-lang", title: "國語學習", sub: "Chinese Language", icon: "📝",
    desc: "注音・生字・成語・閱讀理解",
    color: "from-orange-400 to-amber-500", border: "border-orange-200",
    active: true, href: "/chinese-lang",
    features: ["注音符號 + 生字練習", "成語典故 + 修辭文法", "閱讀理解（低中高年級）", "370+ 題選擇題"],
  },
  {
    id: "math", title: "數學練習", sub: "Math", icon: "🔢",
    desc: "觀念教學 + 互動練習 + 限時挑戰",
    color: "from-amber-400 to-amber-500", border: "border-amber-200",
    active: true, href: "/math",
    features: ["8 大主題 + 120 題練習", "觀念教學 + 範例解說", "限時計算挑戰", "國小到國中完整涵蓋"],
  },
  {
    id: "history-geo", title: "歷史地理", sub: "History & Geography", icon: "🌏",
    desc: "台灣・亞洲・世界歷史地理",
    color: "from-emerald-500 to-emerald-600", border: "border-emerald-200",
    active: true, href: "/history-geo",
    features: ["台灣歷史地理文化", "亞洲歷史地理", "世界歷史地理文化", "320+ 題選擇題"],
  },
  {
    id: "typing", title: "打字練習", sub: "Typing Game", icon: "⌨️",
    desc: "中英雙語打字訓練",
    color: "from-emerald-400 to-emerald-500", border: "border-emerald-200",
    active: true, href: "/typing-game",
    features: ["英文打字練習", "注音輸入練習", "落下文字遊戲", "打字速度測試"],
  },
  {
    id: "music", title: "樂理基礎", sub: "Music Theory", icon: "🎵",
    desc: "音符・音階・和弦・音樂常識",
    color: "from-pink-400 to-pink-500", border: "border-pink-200",
    active: true, href: "/music",
    features: ["音符與節拍入門", "音階調性與音程", "和弦與曲式結構", "300+ 題選擇題"],
  },
  {
    id: "finance", title: "兒童理財", sub: "Financial Literacy", icon: "💰",
    desc: "儲蓄・預算・記帳・紅包理財",
    color: "from-purple-400 to-purple-500", border: "border-purple-200",
    active: true, href: "/finance",
    features: ["6 個互動學習模組", "需要 vs 想要分類", "儲蓄計算 + 預算分配", "紅包理財 + 記帳小達人"],
  },
];

export default function HomePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero — compact, CTA-first */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fda4af 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 md:pt-16 md:pb-10 relative">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-black mb-2 leading-tight text-slate-800">
              📚 親子多元<span className="text-rose-400">學習</span>平台
            </h1>
            <p className="text-base md:text-lg text-slate-500 mb-6">
              英檢・日文・數學・桌遊 — 完全免費
            </p>

            {/* Quick-start cards — all categories, tappable, above the fold */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md md:max-w-2xl mx-auto mb-6">
              <a href="/elementary" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-rose-200 shadow-sm hover:shadow-lg hover:border-rose-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">📘</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">全民英檢</div>
                <div className="text-[10px] md:text-xs text-slate-400">GEPT</div>
              </a>
              <a href="/jlpt-n5" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-red-200 shadow-sm hover:shadow-lg hover:border-red-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">🇯🇵</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">日文檢定</div>
                <div className="text-[10px] md:text-xs text-slate-400">JLPT</div>
              </a>
              <a href="/chinese-lang" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-orange-200 shadow-sm hover:shadow-lg hover:border-orange-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">📝</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">國語學習</div>
                <div className="text-[10px] md:text-xs text-slate-400">國小國語</div>
              </a>
              <a href="/math" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-amber-200 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">🔢</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">數學練習</div>
                <div className="text-[10px] md:text-xs text-slate-400">Math</div>
              </a>
              <a href="/history-geo" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-emerald-200 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">🌏</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">歷史地理</div>
                <div className="text-[10px] md:text-xs text-slate-400">History</div>
              </a>
              <a href="/music" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-pink-200 shadow-sm hover:shadow-lg hover:border-pink-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">🎵</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">樂理基礎</div>
                <div className="text-[10px] md:text-xs text-slate-400">Music</div>
              </a>
              <a href="/board-games" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-orange-200 shadow-sm hover:shadow-lg hover:border-orange-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">🎲</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">教育桌遊</div>
                <div className="text-[10px] md:text-xs text-slate-400">18 款遊戲</div>
              </a>
              <a href="/typing-game" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-emerald-200 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">⌨️</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">打字練習</div>
                <div className="text-[10px] md:text-xs text-slate-400">Typing</div>
              </a>
              <a href="/finance" className="group bg-white rounded-2xl p-3 md:p-4 border-2 border-purple-200 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all no-underline hover-lift">
                <div className="text-2xl md:text-3xl mb-1">💰</div>
                <div className="font-bold text-slate-800 text-xs md:text-sm">兒童理財</div>
                <div className="text-[10px] md:text-xs text-slate-400">Finance</div>
              </a>
            </div>

            <PracticeCounter />
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      <DailyChallenge />

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">學習工具</h2>
        <p className="text-center text-slate-500 mb-10">多元科目，豐富學習體驗</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div key={tool.id} className={`bg-white rounded-2xl overflow-hidden border ${tool.border} shadow-sm ${tool.active ? "hover-lift" : "opacity-60"}`}>
              <div className={`bg-gradient-to-r ${tool.color} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-1">{tool.icon}</div>
                    <h3 className="text-xl font-bold">{tool.title}</h3>
                    <p className="text-sm opacity-80">{tool.sub}</p>
                  </div>
                  {!tool.active && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">即將推出</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-600 font-medium mb-3">{tool.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {tool.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {tool.active ? (
                  <a href={tool.href} className={`block text-center py-3 rounded-xl bg-gradient-to-r ${tool.color} text-white font-bold hover:opacity-90 transition no-underline`}>
                    開始學習 →
                  </a>
                ) : (
                  <div className="text-center py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold">
                    敬請期待 🔜
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Tips */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">學習建議</h3>
          <p className="text-slate-600 max-w-lg mx-auto">
            按照 <strong className="text-rose-400">單字 → 文法 → 聽力 → 閱讀 → 測驗</strong> 的順序學習效果最好！
            每天自由安排時間，不趕進度，學完一個單元記得下載練習單再練一次 📥
          </p>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">📖 學習攻略文章</h2>
          <p className="text-slate-500">考試準備技巧、學習方法、免費資源整理</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "全民英檢初級 3 個月備考計畫", href: "/blog/gept-elementary-3-month-plan", icon: "📘", tag: "英檢攻略" },
            { title: "九九乘法背不起來？5 種趣味遊戲", href: "/blog/multiplication-table-games", icon: "🔢", tag: "數學學習" },
            { title: "注音符號 37 個記憶口訣", href: "/blog/zhuyin-practice", icon: "📝", tag: "國語學習" },
            { title: "JLPT N3 自學 6 個月讀書計畫", href: "/blog/jlpt-n3-self-study", icon: "🇯🇵", tag: "日文學習" },
            { title: "小學生學程式設計免費入門指南", href: "/blog/coding-for-kids", icon: "💻", tag: "程式設計" },
            { title: "10 個免費邏輯遊戲越玩越聰明", href: "/blog/logic-games-for-kids", icon: "🎲", tag: "邏輯思維" },
          ].map((post) => (
            <a key={post.href} href={post.href} className="group bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all no-underline hover-lift">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{post.icon}</span>
                <div>
                  <span className="inline-block text-[10px] font-semibold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full mb-1">{post.tag}</span>
                  <h3 className="text-sm font-bold text-slate-700 group-hover:text-rose-500 transition-colors leading-snug">{post.title}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-6">
          <a href="/blog" className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-500 font-semibold text-sm no-underline transition-colors">
            查看全部文章 →
          </a>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
