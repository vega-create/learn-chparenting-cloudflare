import Link from "next/link";

const BASE = "https://learn.chparenting.com";

interface WritingData {
  sentenceReorder: { parts: string[]; zh: string }[];
  translation: { zh: string; answer: string; hint?: string }[];
  paragraphOrder?: { title: string; sentences: string[] }[];
  guidedWriting: { topic: string; zh: string; prompts: string[]; vocabulary?: string[] }[];
}

/**
 * Server-rendered content for a level's writing practice page.
 *
 * The page is "use client" end to end, so this renders from layout.tsx. The
 * exercises themselves are real teaching material — translation items carry
 * the model answer, guided-writing topics carry their prompts and suggested
 * vocabulary — so the sample rows below are the actual content of the page,
 * not a description of it.
 */
export default function WritingSEO({
  levelName,
  levelPath,
  language,
  data,
}: {
  levelName: string;
  levelPath: string;
  language: "en" | "ja";
  data: WritingData;
}) {
  const langName = language === "ja" ? "日文" : "英文";
  const translations = data.translation.slice(0, 5);
  const guided = data.guidedWriting.slice(0, 4);
  const reorder = data.sentenceReorder.slice(0, 3);
  const paragraphs = data.paragraphOrder?.slice(0, 5) ?? [];

  const total =
    data.sentenceReorder.length +
    data.translation.length +
    (data.paragraphOrder?.length ?? 0) +
    data.guidedWriting.length;

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h1 className="sr-only">
          {levelName}寫作練習｜{total} 題免費線上{langName}寫作
        </h1>

        <p className="mb-6 text-[15px]">
          {levelName}的寫作練習共 <strong>{total} 題</strong>，分成四種題型：
          句子重組 {data.sentenceReorder.length} 題、中翻{langName} {data.translation.length} 題
          {data.paragraphOrder?.length ? `、段落排序 ${data.paragraphOrder.length} 題` : ""}、
          引導式寫作 {data.guidedWriting.length} 題。
          從排列單字開始，一路練到自己寫出一整段，免費使用、不需註冊。
        </p>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">✏️ 中翻{langName}題長這樣</h2>
        <ul className="mb-6 space-y-1.5 text-[14px]">
          {translations.map((t, i) => (
            <li key={i}>
              <span className="text-slate-600">{t.zh}</span>
              <span className="text-slate-400 mx-1">→</span>
              <span className="text-slate-800">{t.answer}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">🔤 句子重組的題目</h2>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          {reorder.map((r, i) => (
            <li key={i}>
              {r.zh}（提供的字：{r.parts.join("、")}）
            </li>
          ))}
        </ul>

        {paragraphs.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📄 段落排序的主題</h2>
            <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
              {paragraphs.map((p, i) => (
                <li key={i}>
                  {p.title}（{p.sentences.length} 句）
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📝 引導式寫作的題目與提示</h2>
        <div className="mb-6 space-y-3">
          {guided.map((g, i) => (
            <div key={i} className="text-[14px] bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="font-semibold text-slate-800">
                {g.topic}
                {g.zh && g.zh !== g.topic && <span className="font-normal text-slate-500">（{g.zh}）</span>}
              </div>
              <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                {g.prompts.slice(0, 4).map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
              {g.vocabulary && g.vocabulary.length > 0 && (
                <div className="mt-1 text-slate-500 text-[13px]">
                  建議用字：{g.vocabulary.slice(0, 6).join("、")}
                </div>
              )}
            </div>
          ))}
        </div>

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 px-4 py-3 md:px-5 md:py-4 border border-teal-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">
              💡 怎麼陪孩子練寫作（點擊展開）
            </span>
            <span className="shrink-0 text-teal-600 text-xl transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="pt-6">
            <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
              <li>照題型順序練：句子重組 → 中翻{langName} → 段落排序 → 引導式寫作，難度是接著上去的</li>
              <li>翻譯題答案不只一種，跟參考答案不同不代表錯，重點是句子讀得通</li>
              <li>引導式寫作先讓孩子照著四個提示各寫一句，寫完再串起來，比一開始就要求成篇容易</li>
              <li>不要一次改到完美。第一遍只看意思通不通，第二遍再看文法</li>
            </ul>
            <h3 className="text-lg font-bold text-slate-800 mb-2">❓ 常見問題</h3>
            <div className="mb-2 space-y-3 text-[14px]">
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">寫完有人幫忙改嗎？</summary>
                <p className="mt-2 text-slate-600">
                  翻譯與句子重組會比對參考答案，引導式寫作則提供提示與建議用字，讓孩子有方向可以寫，
                  但不會逐句批改。這部分建議家長陪著看一次。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">要先寫完前面的單元才能練嗎？</summary>
                <p className="mt-2 text-slate-600">
                  不用。寫作練習是獨立的，隨時可以開始。不過先做過同級的單字和文法單元，寫起來會順很多。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">需要註冊或付費嗎？</summary>
                <p className="mt-2 text-slate-600">不用。免費開放、不需要註冊帳號，手機和電腦都可以直接練習。</p>
              </details>
            </div>
          </div>
        </details>

        <div className="text-center mt-6">
          <Link href={`/${levelPath}`} className="inline-block text-sm text-teal-600 hover:text-teal-800 underline">
            回到{levelName}完整課程
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: `${levelName}寫作練習`,
            description: `${levelName}的${langName}寫作練習，含句子重組、中翻${langName}、引導式寫作共 ${total} 題。`,
            url: `${BASE}/${levelPath}/writing`,
            inLanguage: "zh-TW",
            learningResourceType: "Exercise",
            isAccessibleForFree: true,
            teaches: `${langName}寫作`,
            numberOfItems: total,
          }),
        }}
      />
    </>
  );
}
