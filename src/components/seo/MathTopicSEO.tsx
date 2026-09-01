import Link from "next/link";
import { MATH_TOPICS } from "@/data/math/topics";
import type { MathTopic } from "@/data/math/types";

const BASE = "https://learn.chparenting.com";

/**
 * Server-rendered content for a math topic page.
 *
 * The page renders only <ClientPage />, so the server sent 503-560 characters
 * of chrome. The teaching material was already written and is richer than the
 * quiz sections: every topic carries three concepts with a written explanation,
 * six worked examples with their solution steps, and fifteen practice questions
 * each with an explanation.
 *
 * The concepts and worked examples render outside the collapsed block — a
 * worked solution is the part a parent actually wants to see before deciding
 * whether the topic fits their child.
 */
export default function MathTopicSEO({ topic }: { topic: MathTopic }) {
  const concepts = topic.concepts ?? [];
  const examples = concepts.flatMap((c) => c.examples ?? []).slice(0, 3);
  const practiceExplains = (topic.practices ?? [])
    .map((p) => p.explanation)
    .filter(Boolean)
    .slice(0, 5);
  const related = MATH_TOPICS.filter((t) => t.id !== topic.id);

  const ld = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${topic.title}線上練習`,
    description: `${topic.title}的觀念講解與 ${topic.practices?.length ?? 0} 道互動練習，適合${topic.grade}。`,
    url: `${BASE}/math/${topic.id}`,
    inLanguage: "zh-TW",
    learningResourceType: "Exercise",
    educationalLevel: topic.grade,
    isAccessibleForFree: true,
    teaches: concepts.map((c) => c.title),
  };

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h2 className="sr-only">
          {topic.title}線上練習｜{topic.grade}
        </h2>

        <p className="mb-6 text-[15px]">
          「{topic.title}」適合 <strong>{topic.grade}</strong>，內容分成 {concepts.length} 個觀念，
          每個觀念都有講解和示範解題，後面接 {topic.practices?.length ?? 0} 道互動練習，
          答完立刻顯示算式和解說。免費使用、不需註冊。
        </p>

        {concepts.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📐 這個單元會學到的觀念</h2>
            <div className="mb-6 space-y-3">
              {concepts.map((c, i) => (
                <div key={i} className="text-[14px]">
                  <strong className="text-slate-800">{c.title}</strong>
                  {c.explanation && <span className="text-slate-600">：{c.explanation}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {examples.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">✏️ 示範解題</h2>
            <div className="mb-6 space-y-4">
              {examples.map((ex, i) => (
                <div key={i} className="text-[14px] bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="font-semibold text-slate-800 mb-1">{ex.question}</div>
                  <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                    {(ex.steps ?? []).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                  <div className="mt-1 text-slate-800">答案：{ex.answer}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {practiceExplains.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">💡 練習題的解說長這樣</h2>
            <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
              {practiceExplains.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </>
        )}

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 px-4 py-3 md:px-5 md:py-4 border border-blue-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">
              💡 怎麼陪孩子練這個單元（點擊展開）
            </span>
            <span className="shrink-0 text-blue-600 text-xl transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="pt-6">
            <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
              <li>先看完觀念和示範解題再開始練，直接做題目容易卡在同一個地方反覆錯</li>
              <li>答錯時把解說的算式唸出來，聽自己講一次比看一次有效</li>
              <li>一次做 5 題就好，錯的隔天再做一次，比一口氣做完 {topic.practices?.length ?? 15} 題有用</li>
              <li>孩子卡住時先問「你算到哪一步覺得怪怪的？」，通常錯的不是最後那一步</li>
            </ul>
            <h3 className="text-lg font-bold text-slate-800 mb-2">❓ 常見問題</h3>
            <div className="mb-2 space-y-3 text-[14px]">
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">這個單元適合幾年級？</summary>
                <p className="mt-2 text-slate-600">
                  建議{topic.grade}。已經學過的孩子可以直接做練習當複習，還沒學過的先看觀念講解和示範解題。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">答錯會有詳解嗎？</summary>
                <p className="mt-2 text-slate-600">
                  會。{topic.practices?.length ?? 15} 道練習每一題都附解說，會把算式寫出來，不是只告訴你答案。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">需要註冊或付費嗎？</summary>
                <p className="mt-2 text-slate-600">
                  不用。全部免費開放、不需要註冊帳號，手機和電腦都可以直接練習。
                </p>
              </details>
            </div>
          </div>
        </details>

        {related.length > 0 && (
          <nav className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-3">其他數學單元</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {related.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/math/${t.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition"
                  >
                    {t.icon} {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="text-center mt-6">
          <Link href="/math" className="inline-block text-sm text-blue-600 hover:text-blue-800 underline">
            回到數學練習總覽
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
