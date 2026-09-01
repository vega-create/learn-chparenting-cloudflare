import Link from "next/link";

export interface PracticeTheme {
  /** Tailwind classes are written out in full — dynamic strings get purged. */
  summary: string;
  chevron: string;
  link: string;
}

export interface PracticeTopicSEOProps {
  /** sr-only <h1>; the interactive area above is a client component with no heading. */
  h1: string;
  topicTitle: string;
  description: string;
  totalQuestions: number;
  explainedCount: number;
  /** Answer explanations, already sliced by the caller. */
  keyPoints: string[];
  keyPointsHeading: string;
  sampleQuestions: string[];
  /** Used when a topic is built from passages rather than single questions. */
  passageExcerpt?: string;
  readingCount?: number;
  listeningCount?: number;
  audienceNote: string;
  tips: string[];
  faqs: { q: string; a: string }[];
  siblings: { href: string; label: string }[];
  siblingsHeading: string;
  backHref: string;
  backLabel: string;
  theme: PracticeTheme;
  jsonLd: object;
}

/**
 * Server-rendered content for a practice topic page (history-geo, chinese-lang).
 *
 * Both sections render nothing but a client component, which left them at
 * 447-471 characters of server-rendered text — the lowest on the site. The
 * material was never thin: every topic carries dozens of questions and each one
 * has a written explanation, which reads as a study note once the question is
 * stripped away.
 *
 * The key points sit outside the collapsed block on purpose. That is the part
 * worth reading and the part a crawler has to see; the study tips and FAQ,
 * which are shared across topics of the same subject, go inside it.
 */
export default function PracticeTopicSEO(p: PracticeTopicSEOProps) {
  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h2 className="sr-only">{p.h1}</h2>

        <p className="mb-6 text-[15px]">
          「{p.topicTitle}」收錄 <strong>{p.totalQuestions} 道練習題</strong>，主題涵蓋{p.description}。
          {p.explainedCount > 0 && "每一題答完都會出現解說，答錯時可以直接看到正確觀念，不用另外查資料。"}
          {p.readingCount ? ` 內含 ${p.readingCount} 篇閱讀短文。` : ""}
          {p.listeningCount ? ` 另有 ${p.listeningCount} 題聽力練習。` : ""}
          {p.audienceNote}
        </p>

        {p.keyPoints.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">{p.keyPointsHeading}</h2>
            <p className="text-[13px] text-slate-500 mb-3">
              以下是這個主題 {p.explainedCount} 則解說中的前 {p.keyPoints.length} 則，練習前先看過一遍會更有印象。
            </p>
            <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
              {p.keyPoints.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </>
        )}

        {p.passageExcerpt && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📄 短文選段</h2>
            <p className="mb-6 text-[14px] bg-slate-50 border border-slate-200 rounded-lg p-4">
              {p.passageExcerpt}…
            </p>
          </>
        )}

        {p.sampleQuestions.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📝 題目長什麼樣子</h2>
            <ul className="list-decimal list-inside mb-6 space-y-1.5 text-[14px]">
              {p.sampleQuestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}

        <details className="group seo-details">
          <summary className={`flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl px-4 py-3 md:px-5 md:py-4 border transition [&::-webkit-details-marker]:hidden [&::marker]:hidden ${p.theme.summary}`}>
            <span className="font-bold text-slate-800 text-[15px] md:text-base">
              💡 怎麼陪孩子練這個主題（點擊展開）
            </span>
            <span className={`shrink-0 text-xl transition-transform duration-200 group-open:rotate-180 ${p.theme.chevron}`}>
              ▼
            </span>
          </summary>

          <div className="pt-6">
            <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
              {p.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            <h3 className="text-lg font-bold text-slate-800 mb-2">❓ 常見問題</h3>
            <div className="mb-2 space-y-3 text-[14px]">
              {p.faqs.map((f, i) => (
                <details key={i} className="bg-slate-50 rounded-lg p-3">
                  <summary className="font-semibold cursor-pointer text-slate-700">{f.q}</summary>
                  <p className="mt-2 text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </details>

        {p.siblings.length > 0 && (
          <nav className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-3">{p.siblingsHeading}</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {p.siblings.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400 transition"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="text-center mt-6">
          <Link href={p.backHref} className={`inline-block text-sm underline ${p.theme.link}`}>
            {p.backLabel}
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(p.jsonLd) }} />
    </>
  );
}
