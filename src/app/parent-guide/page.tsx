import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "家長陪伴指南 | 全民英檢・JLPT 日檢 204 個單元指南 | learn.chparenting.com",
  description:
    "204 個單元的家長陪伴指南，涵蓋全民英檢初級到中高級、JLPT N5 到 N1。每個單元都有學習目標、陪伴方式、過關清單和常見問題，幫助家長陪孩子一起學習。",
  keywords:
    "家長陪伴指南, 全民英檢家長, JLPT家長指南, 親子學習, 英檢學習指南, 日檢學習指南",
  alternates: { canonical: "https://learn.chparenting.com/parent-guide" },
};

const GEPT_GUIDES = [
  {
    level: "初級",
    eng: "Elementary",
    href: "/elementary/guide",
    units: 30,
    icon: "🌱",
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-500",
  },
  {
    level: "中級",
    eng: "Intermediate",
    href: "/intermediate/guide",
    units: 34,
    icon: "🌿",
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-500",
  },
  {
    level: "中高級",
    eng: "Upper-Intermediate",
    href: "/upper-intermediate/guide",
    units: 40,
    icon: "🌳",
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-500",
  },
];

const JLPT_GUIDES = [
  {
    level: "N5",
    name: "入門",
    href: "/jlpt-n5/guide",
    units: 20,
    icon: "🌸",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-500",
  },
  {
    level: "N4",
    name: "基礎",
    href: "/jlpt-n4/guide",
    units: 20,
    icon: "🎋",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-500",
  },
  {
    level: "N3",
    name: "中級",
    href: "/jlpt-n3/guide",
    units: 20,
    icon: "🏯",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-500",
  },
  {
    level: "N2",
    name: "上級",
    href: "/jlpt-n2/guide",
    units: 20,
    icon: "⛩️",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-500",
  },
  {
    level: "N1",
    name: "最上級",
    href: "/jlpt-n1/guide",
    units: 20,
    icon: "🗾",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-500",
  },
];

export default function ParentGuidePage() {
  const totalUnits =
    GEPT_GUIDES.reduce((sum, g) => sum + g.units, 0) +
    JLPT_GUIDES.reduce((sum, g) => sum + g.units, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 標題 */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">👨‍👩‍👧‍👦</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">
          家長陪伴指南
        </h1>
        <p className="text-slate-500">
          共 {totalUnits} 個單元指南，幫助爸媽陪孩子一起學習
        </p>
      </div>

      {/* 說明 */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-8">
        <h2 className="text-base font-bold text-slate-800 mb-3">
          📖 每個單元指南包含
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { icon: "🎯", label: "今日主題與學習目標" },
            { icon: "🤝", label: "家長陪伴方式" },
            { icon: "✅", label: "過關清單" },
            { icon: "❓", label: "常見問題解答" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/60 rounded-xl p-3 text-center"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs text-slate-600 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-3">
          💌 每個等級都可以輸入 email 索取完整 ebook PDF，系統會自動寄送！
        </p>
      </div>

      {/* 全民英檢 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          📘 全民英檢 GEPT
        </h2>
        <div className="grid gap-4">
          {GEPT_GUIDES.map((g) => (
            <Link
              key={g.level}
              href={g.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm hover-lift no-underline transition ${g.color}`}
            >
              <div className="text-3xl">{g.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800">
                  {g.level} {g.eng}
                </div>
                <div className="text-sm text-slate-500">
                  {g.units} 個單元指南
                </div>
              </div>
              <span className={`font-bold text-sm ${g.textColor}`}>
                查看 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* JLPT 日文檢定 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          🇯🇵 日本語能力試驗 JLPT
        </h2>
        <div className="grid gap-4">
          {JLPT_GUIDES.map((g) => (
            <Link
              key={g.level}
              href={g.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm hover-lift no-underline transition ${g.color}`}
            >
              <div className="text-3xl">{g.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800">
                  {g.level}（{g.name}）
                </div>
                <div className="text-sm text-slate-500">
                  {g.units} 個單元指南
                </div>
              </div>
              <span className={`font-bold text-sm ${g.textColor}`}>
                查看 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-8 border border-rose-200 text-center">
        <div className="text-3xl mb-3">💕</div>
        <p className="text-slate-700 font-medium mb-2">
          陪伴是最好的教育
        </p>
        <p className="text-sm text-slate-500 mb-5">
          不需要成為專家，只要願意陪孩子一起學習，就是最棒的爸媽！
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/elementary"
            className="px-6 py-2.5 bg-rose-300 text-white rounded-xl font-semibold text-sm hover:bg-rose-400 transition no-underline"
          >
            📘 開始英檢學習
          </Link>
          <Link
            href="/jlpt-n5"
            className="px-6 py-2.5 bg-red-400 text-white rounded-xl font-semibold text-sm hover:bg-red-500 transition no-underline"
          >
            🇯🇵 開始日文學習
          </Link>
        </div>
      </div>
    </div>
  );
}
