import Link from "next/link";
import { FINANCE_MODULES } from "@/data/finance/modules";
import { getFinanceSEO } from "@/data/finance/seo";
import type { FinanceModule } from "@/data/finance/types";

const BASE = "https://learn.chparenting.com";

/**
 * Server-rendered content for a finance module page.
 *
 * Points come from each module's own data (flash cards, the "why is this a
 * need" notes, budget tips, red-envelope scenarios); the intro and parent tips
 * describe what the tool actually does. See src/data/finance/seo.ts.
 */
export default function FinanceModuleSEO({ module }: { module: FinanceModule }) {
  const seo = getFinanceSEO(module.id);
  if (!seo) return null;
  const related = FINANCE_MODULES.filter((m) => m.id !== module.id);

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h2 className="sr-only">{module.title}｜兒童理財免費線上練習</h2>

        <p className="mb-6 text-[15px]">{seo.intro}免費使用、不需註冊。</p>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{seo.pointsHeading}</h2>
        <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
          {seo.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">👨‍👩‍👧 陪孩子做的時候</h2>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          {seo.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 px-4 py-3 md:px-5 md:py-4 border border-amber-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">❓ 常見問題（點擊展開）</span>
            <span className="shrink-0 text-amber-600 text-xl transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="pt-6 space-y-3 text-[14px]">
            <details className="bg-slate-50 rounded-lg p-3">
              <summary className="font-semibold cursor-pointer text-slate-700">幾歲適合開始學理財？</summary>
              <p className="mt-2 text-slate-600">
                能算加減、會拿零用錢就可以開始。「{module.title}」不需要事先具備理財知識，
                跟著操作一次就懂，低年級建議家長在旁邊陪。
              </p>
            </details>
            <details className="bg-slate-50 rounded-lg p-3">
              <summary className="font-semibold cursor-pointer text-slate-700">會用到真的錢嗎？</summary>
              <p className="mt-2 text-slate-600">
                不會。全部都是模擬操作，不涉及任何真實金流，也不會要求輸入任何個人或金融資料。
              </p>
            </details>
            <details className="bg-slate-50 rounded-lg p-3">
              <summary className="font-semibold cursor-pointer text-slate-700">需要註冊或付費嗎？</summary>
              <p className="mt-2 text-slate-600">
                不用。免費開放、不需要註冊帳號，手機和電腦都可以直接使用。
              </p>
            </details>
          </div>
        </details>

        {related.length > 0 && (
          <nav className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-3">其他理財單元</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {related.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/finance/${m.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-amber-300 hover:text-amber-700 transition"
                  >
                    {m.icon} {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="text-center mt-6">
          <Link href="/finance" className="inline-block text-sm text-amber-600 hover:text-amber-800 underline">
            回到兒童理財總覽
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: module.title,
            description: module.description,
            url: `${BASE}/finance/${module.id}`,
            inLanguage: "zh-TW",
            learningResourceType: "Interactive Resource",
            educationalLevel: "國小",
            isAccessibleForFree: true,
            teaches: module.title,
          }),
        }}
      />
    </>
  );
}
