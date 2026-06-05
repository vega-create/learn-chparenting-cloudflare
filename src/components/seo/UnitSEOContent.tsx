import Link from "next/link";
import { LevelInfo, UnitSEOInput, unitLearningResourceJsonLd } from "@/lib/unit-seo";

/**
 * Server-rendered SEO content block that sits BELOW the interactive
 * ClientPage on every unit page. Renders ~500–700 chars of unique
 * text per unit using the unit's own vocab + grammar data, so the
 * initial HTML Googlebot sees is no longer thin.
 *
 * Reason this matters: the original page.tsx was a one-liner that
 * mounted a "use client" ClientPage. Initial HTML had zero content,
 * and after 3 months 324 pages ended up in GSC's "Crawled — currently
 * not indexed" bucket. This component fixes that by giving every unit
 * a unique, server-rendered intro + vocab preview + FAQ + JSON-LD,
 * while leaving the interactive ClientPage untouched.
 */

interface VocabItem { display: string; reading?: string; zh: string; ex?: string; }
interface GrammarPreview { title: string; explain?: string; }

interface Props {
  level:      LevelInfo;
  unit:       UnitSEOInput;
  /** First 6 vocab items, normalised across GEPT/JLPT shapes */
  vocabItems: VocabItem[];
  /** First 3 grammar items */
  grammarItems: GrammarPreview[];
  /** Adjacent unit info for prev/next nav */
  prevUnit?:  { id: number; title: string };
  nextUnit?:  { id: number; title: string };
}

export default function UnitSEOContent({ level, unit, vocabItems, grammarItems, prevUnit, nextUnit }: Props) {
  const ld = unitLearningResourceJsonLd(level, unit);

  return (
    <>
      {/* Server-rendered SEO content — lives below the interactive area */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">

        {/* ─── INTRO ─────────────────────────────────────────────── */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
          {level.displayName} Unit {unit.id}：{unit.title}{unit.titleJa ? `（${unit.titleJa}）` : ""}
        </h2>
        <p className="mb-6 text-[15px]">
          本單元收錄「{unit.title}」主題的 <strong>{unit.vocabCount} 個常用{level.language === "ja" ? "日文" : "英文"}單字</strong>、
          <strong>{unit.grammarCount} 個重點文法</strong>、
          <strong>{unit.listeningCount} 題聽力練習</strong>，搭配閱讀理解與測驗題組。
          {level.longSummary}，是準備 {level.displayName} 的核心練習單元。
          建議每天投入 15-20 分鐘，三天內可掌握本單元所有單字與文法重點。
        </p>

        {/* ─── LEARNING OBJECTIVES ──────────────────────────────── */}
        <h3 className="text-lg font-bold text-slate-800 mb-2">📚 你會學到什麼？</h3>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          <li>
            掌握 <strong>{unit.vocabPreview.slice(0, 3).join("、")}</strong> 等 {unit.vocabCount} 個{level.language === "ja" ? "日文" : "英文"}重要單字
          </li>
          {grammarItems.length > 0 && (
            <li>
              學會 <strong>{grammarItems.slice(0, 2).map(g => g.title).join("、")}</strong> 等文法重點
            </li>
          )}
          <li>
            聽懂 {unit.listeningCount} 段日常{level.language === "ja" ? "日文" : "英文"}對話與短文
          </li>
          <li>透過 quiz 題組驗證學習成效，整理錯題加深印象</li>
        </ul>

        {/* ─── VOCAB PREVIEW TABLE ──────────────────────────────── */}
        <h3 className="text-lg font-bold text-slate-800 mb-2">📖 重點單字搶先看</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-[13px] md:text-[14px] border border-slate-200 rounded-lg">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">
                  {level.language === "ja" ? "日文" : "單字"}
                </th>
                {level.language === "ja" && (
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">假名</th>
                )}
                <th className="px-3 py-2 text-left font-semibold text-slate-700">中文</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700 hidden md:table-cell">例句</th>
              </tr>
            </thead>
            <tbody>
              {vocabItems.slice(0, 6).map((v, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="px-3 py-2 font-medium text-slate-800">{v.display}</td>
                  {level.language === "ja" && (
                    <td className="px-3 py-2 text-slate-600">{v.reading ?? ""}</td>
                  )}
                  <td className="px-3 py-2 text-slate-600">{v.zh}</td>
                  <td className="px-3 py-2 text-slate-500 hidden md:table-cell text-xs">{v.ex ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── GRAMMAR PREVIEW ──────────────────────────────────── */}
        {grammarItems.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-slate-800 mb-2">📝 文法重點摘要</h3>
            <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
              {grammarItems.slice(0, 3).map((g, i) => (
                <li key={i}>
                  <strong>{g.title}</strong>
                  {g.explain && <span className="text-slate-500"> — {g.explain.slice(0, 60)}{g.explain.length > 60 ? "…" : ""}</span>}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ─── STUDY TIPS ───────────────────────────────────────── */}
        <h3 className="text-lg font-bold text-slate-800 mb-2">💡 怎麼用這個單元最有效？</h3>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          <li>第一天先把單字聽過一遍，跟著朗讀 2-3 次熟悉發音</li>
          <li>第二天看文法說明，搭配例句理解使用情境</li>
          <li>第三天做聽力 + 閱讀 + 測驗三個練習區，把錯題標記下來</li>
          <li>第四天回頭重做錯題，並下載練習單做書面練習加深記憶</li>
        </ul>

        {/* ─── FAQ ──────────────────────────────────────────────── */}
        <h3 className="text-lg font-bold text-slate-800 mb-2">❓ 常見問題</h3>
        <div className="mb-6 space-y-3 text-[14px]">
          <details className="bg-slate-50 rounded-lg p-3">
            <summary className="font-semibold cursor-pointer text-slate-700">
              這個單元適合什麼程度的學習者？
            </summary>
            <p className="mt-2 text-slate-600">
              本單元設計給準備 {level.displayName} 的學習者，{level.longSummary}。
              如果是剛開始接觸，建議從 Unit 1 循序漸進。
            </p>
          </details>
          <details className="bg-slate-50 rounded-lg p-3">
            <summary className="font-semibold cursor-pointer text-slate-700">
              學完這個單元需要多久？
            </summary>
            <p className="mt-2 text-slate-600">
              如果每天投入 15-20 分鐘，大約 3-4 天可以完成單字、文法、聽力、閱讀與測驗五個區塊，並把錯題複習一輪。
            </p>
          </details>
          <details className="bg-slate-50 rounded-lg p-3">
            <summary className="font-semibold cursor-pointer text-slate-700">
              有提供練習單下載嗎？
            </summary>
            <p className="mt-2 text-slate-600">
              有。本單元上方「下載練習單」按鈕可以下載 PDF 練習單，搭配紙本書寫練習效果更好，特別適合國小到高中階段的學習者。
            </p>
          </details>
        </div>

        {/* ─── PREV / NEXT NAV ─────────────────────────────────── */}
        <nav className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
          {prevUnit ? (
            <Link
              href={`${level.pathSegment}/${prevUnit.id}`}
              className="flex-1 text-left text-sm text-slate-600 hover:text-blue-600"
            >
              <div className="text-xs text-slate-400">← 上一單元</div>
              <div className="font-semibold">Unit {prevUnit.id}：{prevUnit.title}</div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextUnit && (
            <Link
              href={`${level.pathSegment}/${nextUnit.id}`}
              className="flex-1 text-right text-sm text-slate-600 hover:text-blue-600"
            >
              <div className="text-xs text-slate-400">下一單元 →</div>
              <div className="font-semibold">Unit {nextUnit.id}：{nextUnit.title}</div>
            </Link>
          )}
        </nav>

        {/* ─── LEVEL OVERVIEW LINK ──────────────────────────────── */}
        <div className="text-center mt-6">
          <Link
            href={`/${level.slug}`}
            className="inline-block text-sm text-blue-600 hover:text-blue-800 underline"
          >
            回到 {level.displayName} 完整課程（共 {level.totalUnits} 個單元）
          </Link>
        </div>
      </section>

      {/* JSON-LD LearningResource Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
