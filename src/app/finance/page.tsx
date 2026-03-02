import type { Metadata } from "next";
import Link from "next/link";
import { FINANCE_MODULES } from "@/data/finance/modules";

export const metadata: Metadata = {
  title: "免費兒童理財遊戲 | 預算分配・存錢挑戰・記帳 | learn.chparenting.com",
  description: "免費兒童理財互動遊戲，透過預算分配、存錢挑戰學習金錢觀念。讓孩子理解需要和想要的差別。",
  alternates: { canonical: "https://learn.chparenting.com/finance" },
};

const TYPE_LABEL: Record<string, string> = {
  lesson: "📖 觀念課",
  game: "🎮 互動遊戲",
  tool: "🛠️ 計算工具",
};

export default function FinancePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">💰</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">兒童理財</h1>
        <p className="text-slate-500">認識金錢 · 儲蓄習慣 · 預算分配 · 記帳追蹤</p>
      </div>

      {/* Intro */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200 mb-8">
        <h2 className="font-bold text-slate-800 mb-2">🌟 為什麼要學理財？</h2>
        <p className="text-sm text-slate-600 leading-6">
          從小培養正確的金錢觀念，長大後更懂得管理自己的錢。
          透過有趣的互動遊戲，學會分辨需要和想要、養成儲蓄習慣、規劃零用錢分配，讓每一塊錢都花得聰明！
        </p>
      </div>

      {/* Module cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FINANCE_MODULES.map((m) => (
          <Link key={m.id} href={`/finance/${m.id}`}
            className={`bg-white rounded-2xl overflow-hidden border ${m.border} shadow-sm hover-lift no-underline`}>
            <div className={`bg-gradient-to-r ${m.color} p-4 text-white`}>
              <div className="text-3xl mb-1">{m.icon}</div>
              <div className="text-lg font-bold">{m.title}</div>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-2">{m.description}</p>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                {TYPE_LABEL[m.type] || m.type}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <a href="/" className="text-sm text-purple-500 hover:underline no-underline">← 回到首頁</a>
      </div>
    </div>
  );
}
