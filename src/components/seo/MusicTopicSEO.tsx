import Link from "next/link";
import type { MusicTopic } from "@/data/music/types";

const BASE = "https://learn.chparenting.com";

/**
 * Server-rendered content for a music theory topic page.
 *
 * Same shape as the other practice sections — the page renders only
 * <ClientPage /> — but this one has the richest material after math: besides
 * 25-40 questions that all carry an explanation, most topics also ship
 * `concepts` with a written explanation and a key-points list.
 */
export default function MusicTopicSEO({
  level,
  topic,
  siblings,
}: {
  level: { id: string; title: string };
  topic: MusicTopic;
  siblings: { id: string; title: string; icon: string }[];
}) {
  const concepts = topic.concepts ?? [];
  const explained = topic.questions.filter((q) => q.explain);

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h2 className="sr-only">
          {topic.title}（樂理{level.title}）｜{topic.questions.length} 題免費線上練習
        </h2>

        <p className="mb-6 text-[15px]">
          「{topic.title}」屬於樂理{level.title}，內容涵蓋{topic.description}。
          {concepts.length > 0 && `先有 ${concepts.length} 段觀念講解，`}
          再接 <strong>{topic.questions.length} 道練習題</strong>，
          每一題答完都會出現解說。不需要會看譜也能從頭開始，免費使用、不需註冊。
        </p>

        {concepts.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">🎼 這個主題的觀念</h2>
            <div className="mb-6 space-y-3">
              {concepts.map((c, i) => (
                <div key={i} className="text-[14px]">
                  <strong className="text-slate-800">{c.title}</strong>
                  {c.explanation && <span className="text-slate-600">：{c.explanation}</span>}
                  {c.keyPoints && c.keyPoints.length > 0 && (
                    <ul className="list-disc list-inside mt-1 ml-2 text-slate-600 space-y-0.5">
                      {c.keyPoints.map((k, j) => (
                        <li key={j}>{k}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {explained.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📖 {topic.title}重點整理</h2>
            <p className="text-[13px] text-slate-500 mb-3">
              以下是這個主題 {explained.length} 則題目解說中的前 8 則。
            </p>
            <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
              {explained.slice(0, 8).map((q, i) => (
                <li key={i}>{q.explain}</li>
              ))}
            </ul>
          </>
        )}

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-fuchsia-50 to-pink-50 hover:from-fuchsia-100 hover:to-pink-100 px-4 py-3 md:px-5 md:py-4 border border-fuchsia-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">
              💡 怎麼陪孩子練樂理（點擊展開）
            </span>
            <span className="shrink-0 text-fuchsia-600 text-xl transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="pt-6">
            <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
              <li>先看完觀念再做題，樂理的符號是有規則的，看懂規則比硬背符號快</li>
              <li>有樂器的話邊做邊彈一次，聽到聲音跟看到符號連起來，記得最牢</li>
              <li>一次做 10 題就好，答錯的解說唸出聲音再做一次</li>
              <li>學校音樂課進度到哪就練哪一段，不用照順序全部做完</li>
            </ul>
            <h3 className="text-lg font-bold text-slate-800 mb-2">❓ 常見問題</h3>
            <div className="mb-2 space-y-3 text-[14px]">
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">沒學過樂器可以練嗎？</summary>
                <p className="mt-2 text-slate-600">
                  可以。這個主題從{topic.description}開始，不需要會演奏，也不需要先看得懂五線譜。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">答錯了看得到解釋嗎？</summary>
                <p className="mt-2 text-slate-600">
                  可以。這個主題 {explained.length} 題都附解說，作答後立刻顯示。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">需要註冊或付費嗎？</summary>
                <p className="mt-2 text-slate-600">不用。免費開放、不需要註冊帳號，手機和電腦都可以直接練習。</p>
              </details>
            </div>
          </div>
        </details>

        {siblings.length > 0 && (
          <nav className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-3">樂理{level.title}的其他主題</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {siblings.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/music/${level.id}/${s.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-fuchsia-300 hover:text-fuchsia-700 transition"
                  >
                    {s.icon} {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="text-center mt-6">
          <Link href="/music" className="inline-block text-sm text-fuchsia-600 hover:text-fuchsia-800 underline">
            回到樂理基礎總覽
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: `${topic.title}（樂理${level.title}）`,
            description: topic.description,
            url: `${BASE}/music/${level.id}/${topic.id}`,
            inLanguage: "zh-TW",
            learningResourceType: "Quiz",
            educationalLevel: "國小",
            isAccessibleForFree: true,
            teaches: topic.title,
            numberOfItems: topic.questions.length,
          }),
        }}
      />
    </>
  );
}
