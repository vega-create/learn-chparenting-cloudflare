import Link from "next/link";
import { LevelInfo, UnitSEOInput, unitLearningResourceJsonLd } from "@/lib/unit-seo";
import { getUnitGuide } from "@/lib/unit-guides";

/**
 * Server-rendered content block that sits BELOW the interactive ClientPage on
 * every unit page, so the initial HTML Googlebot sees is not an empty shell.
 *
 * 2026-11 改版重點：原本這裡有一整套「本單元收錄 N 個單字、N 個文法、N 題聽力…」
 * 「第一天先聽單字…第四天回頭重做錯題」「本單元設計給準備 X 的學習者…」的句子，
 * 八個級別、194 個單元只換數字和主題名詞，Google 把它們當成同一頁的複製品，
 * 整批放進「已檢索 - 目前尚未建立索引」。
 *
 * 現在每個單元頁只放「這一單元自己有的東西」：
 *   - 老師的話（guide 資料，人寫的）
 *   - 代表單字（含中文）、單元真實例句、文法點名稱與說明（直接取自題庫）
 *   - 單元自己的 FAQ（guide.faq；沒有就不顯示，不用模板題）
 * 跨單元共通的練習流程說明改放在各級別總覽頁（UnitStudyFlow），這裡只留一句連過去。
 */

interface VocabItem { display: string; reading?: string; zh: string; }
interface GrammarPreview { title: string; explain?: string; }
interface ExampleSentence { text: string; zh?: string; }

interface Props {
  level:      LevelInfo;
  unit:       UnitSEOInput;
  /** 代表單字（8-10 個），GEPT/JLPT 已在呼叫端正規化 */
  vocabItems: VocabItem[];
  /** 單元真實例句（1-2 句），日文附中文 */
  exampleSentences?: ExampleSentence[];
  /** 文法重點（最多 4 個） */
  grammarItems: GrammarPreview[];
  /** Adjacent unit info for prev/next nav */
  prevUnit?:  { id: number; title: string };
  nextUnit?:  { id: number; title: string };
}

export default function UnitSEOContent({ level, unit, vocabItems, exampleSentences = [], grammarItems, prevUnit, nextUnit }: Props) {
  const ld = unitLearningResourceJsonLd(level, unit);
  const guide = getUnitGuide(level.slug, unit.id);
  const faq = guide?.faq?.filter(f => f.q && f.a) ?? [];
  const isJa = level.language === "ja";
  const fullTitle = `${level.displayName} Unit ${unit.id}：${unit.title}${unit.titleJa ? `（${unit.titleJa}）` : ""}`;

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">

        {/* 頁面唯一的 h1：互動區頁首的大標是 <p>，不再搶 h1 */}
        <h1 className="sr-only">{fullTitle}</h1>

        {/* ─── 老師的話 ─────────────────────────────────────────────
            這是每個單元唯一由人寫的內容，所以放最前面、不收進 <details>。 */}
        {guide && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-4 md:px-6 md:py-5">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-1">
              老師的話：{unit.title}怎麼陪孩子學
            </h2>
            <p className="text-[13px] text-slate-500 mb-3">
              目標：{guide.learningGoal}．建議時間：{guide.estimatedTime}
            </p>

            {guide.guidanceText.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="mb-2 text-[15px]">{para}</p>
            ))}

            <h3 className="font-bold text-slate-800 mt-4 mb-2 text-[15px]">這個單元孩子最常卡在哪</h3>
            <p className="mb-4 text-[15px]">{guide.commonIssues}</p>

            <h3 className="font-bold text-slate-800 mb-2 text-[15px]">學會了沒？這樣檢查</h3>
            <ul className="list-disc list-inside space-y-1 text-[14px]">
              {guide.passChecklist.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-4 py-3 md:px-5 md:py-4 border border-blue-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">
              這個單元會學到什麼（點擊展開）
            </span>
            <span className="shrink-0 text-blue-600 text-xl transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
              ▼
            </span>
          </summary>

          <div className="pt-6 md:pt-8">

            {/* ─── 你會學到什麼：全部取自這一單元的題庫 ────────────── */}
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">
              {fullTitle}：你會學到什麼
            </h2>

            {vocabItems.length > 0 && (
              <>
                <h3 className="text-base font-bold text-slate-800 mb-2">代表單字</h3>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 mb-6 text-[14px] list-none p-0 m-0">
                  {vocabItems.map((v, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className="font-medium text-slate-800" lang={isJa ? "ja" : "en"}>{v.display}</span>
                      {isJa && v.reading && v.reading !== v.display && (
                        <span className="text-xs text-slate-500" lang="ja">{v.reading}</span>
                      )}
                      <span className="text-slate-600">{v.zh}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {exampleSentences.length > 0 && (
              <>
                <h3 className="text-base font-bold text-slate-800 mb-2">單元例句</h3>
                <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
                  {exampleSentences.map((s, i) => (
                    <li key={i}>
                      <span lang={isJa ? "ja" : "en"}>{s.text}</span>
                      {s.zh && <span className="text-slate-500">（{s.zh}）</span>}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {grammarItems.length > 0 && (
              <>
                <h3 className="text-base font-bold text-slate-800 mb-2">文法重點</h3>
                <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
                  {grammarItems.map((g, i) => (
                    <li key={i}>
                      <strong>{g.title}</strong>
                      {g.explain && <span className="text-slate-500">：{g.explain.slice(0, 60)}{g.explain.length > 60 ? "…" : ""}</span>}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* ─── 適合誰＋怎麼用：合併成兩句，流程細節在級別總覽頁 ── */}
            <p className="mb-6 text-[14px] text-slate-600">
              這個單元{level.longSummary}。建議先聽單字、再看文法，最後做聽力與測驗，錯的題目回頭再做一次；
              完整的練習順序與各單元安排請見
              <Link href={`/${level.slug}`} className="text-blue-600 hover:text-blue-800 underline">{level.displayName} 課程總覽</Link>。
            </p>

            {/* ─── FAQ：只用這一單元自己的問題 ─────────────────────── */}
            {faq.length > 0 && (
              <>
                <h3 className="text-lg font-bold text-slate-800 mb-2">常見問題</h3>
                <div className="mb-6 space-y-3 text-[14px]">
                  {faq.map((f, i) => (
                    <details key={i} className="bg-slate-50 rounded-lg p-3">
                      <summary className="font-semibold cursor-pointer text-slate-700">{f.q}</summary>
                      <p className="mt-2 text-slate-600">{f.a}</p>
                    </details>
                  ))}
                </div>
              </>
            )}
          </div>
        </details>

        {/* ─── PREV / NEXT NAV ─────────────────────────────────── */}
        <nav className="flex justify-between items-center gap-4 mt-6 pt-6 border-t border-slate-200">
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
