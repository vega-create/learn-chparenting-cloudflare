import Link from "next/link";
import type { HistGeoRegion, HistGeoTopic } from "@/data/history-geo";

interface Props {
  region: HistGeoRegion;
  topic: HistGeoTopic;
  siblings: { id: string; title: string; icon: string }[];
}

const BASE = "https://learn.chparenting.com";

/**
 * Server-rendered content for a history/geography topic page.
 *
 * These pages measured 447 characters of server-rendered text — the lowest on
 * the site — because everything sits inside a client component. The material
 * itself was never thin: each topic carries 30-50 questions and every one of
 * them has a written explanation ("阿美族是台灣人口最多的原住民族，主要分布在
 * 花東地區"). Those explanations are ordinary encyclopedic facts, so they read
 * as study notes on their own, without the question wrapped around them.
 *
 * The knowledge list is deliberately outside any collapsed block: it is the
 * part worth reading, and the part a crawler has to see.
 */
export default function HistGeoSEOContent({ region, topic, siblings }: Props) {
  const explained = topic.questions.filter((q) => q.explain);
  const keyPoints = explained.slice(0, 10);
  const sampleQuestions = topic.questions.slice(0, 3);
  const readingCount = topic.readings?.length ?? 0;
  const totalQ =
    topic.questions.length +
    (topic.readings?.reduce((s, r) => s + r.questions.length, 0) ?? 0);

  const ld = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${topic.title}（${region.title}）`,
    description: topic.description,
    url: `${BASE}/history-geo/${region.id}/${topic.id}`,
    inLanguage: "zh-TW",
    learningResourceType: "Quiz",
    educationalLevel: "國小",
    isAccessibleForFree: true,
    teaches: topic.title,
    numberOfItems: totalQ,
  };

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h1 className="sr-only">
          {topic.title}（{region.title}）｜{totalQ} 題免費線上練習
        </h1>

        <p className="mb-6 text-[15px]">
          「{topic.title}」收錄 <strong>{totalQ} 道練習題</strong>，主題涵蓋{topic.description}。
          每一題答完都會出現解說，答錯時可以直接看到正確觀念，不用另外查資料。
          {readingCount > 0 && ` 另附 ${readingCount} 篇閱讀理解短文。`}
          適合國小到國中階段，免費使用、不需註冊。
        </p>

        {keyPoints.length > 0 && (
          <>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
              📖 {topic.title}重點知識
            </h2>
            <p className="text-[13px] text-slate-500 mb-3">
              以下是這個主題中{explained.length} 則解說的前 {keyPoints.length} 則，練習前先看過一遍會更有印象。
            </p>
            <ul className="list-disc list-inside mb-6 space-y-1.5 text-[14px]">
              {keyPoints.map((q, i) => (
                <li key={i}>{q.explain}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">📝 題目長什麼樣子</h2>
        <ul className="list-decimal list-inside mb-6 space-y-1.5 text-[14px]">
          {sampleQuestions.map((q, i) => (
            <li key={i}>{q.s}</li>
          ))}
        </ul>

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 px-4 py-3 md:px-5 md:py-4 border border-emerald-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">
              💡 怎麼陪孩子練這個主題（點擊展開）
            </span>
            <span className="shrink-0 text-emerald-600 text-xl transition-transform duration-200 group-open:rotate-180">
              ▼
            </span>
          </summary>

          <div className="pt-6">
            <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
              <li>一次做 10 題就好，做完把答錯的題目解說唸一次，比一口氣做完 {totalQ} 題有效</li>
              <li>答錯不用馬上糾正，先問孩子「你為什麼選這個？」，常常會發現是題目讀太快</li>
              <li>隔幾天再做一次同一組題目，記得住的才是真的學會了</li>
              <li>遇到有興趣的題目，可以延伸查地圖或影片，這個主題最適合往外延伸</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-800 mb-2">❓ 常見問題</h3>
            <div className="mb-2 space-y-3 text-[14px]">
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">
                  這個主題適合幾年級？
                </summary>
                <p className="mt-2 text-slate-600">
                  題目以國小社會科的範圍為主，中高年級可以自己作答，低年級建議家長陪著唸題目。
                  國中生也可以當作複習{topic.title}的快速測驗。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">
                  答錯了看得到解釋嗎？
                </summary>
                <p className="mt-2 text-slate-600">
                  可以。這個主題 {explained.length} 題都附有解說，作答後會立刻顯示，
                  不用等全部做完才知道對錯。
                </p>
              </details>
              <details className="bg-slate-50 rounded-lg p-3">
                <summary className="font-semibold cursor-pointer text-slate-700">
                  需要註冊或付費嗎？
                </summary>
                <p className="mt-2 text-slate-600">
                  不用。所有題目免費開放，不需要註冊帳號，手機和電腦都可以直接練習。
                </p>
              </details>
            </div>
          </div>
        </details>

        {siblings.length > 0 && (
          <nav className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-3">{region.title}的其他主題</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {siblings.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/history-geo/${region.id}/${s.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition"
                  >
                    {s.icon} {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="text-center mt-6">
          <Link
            href="/history-geo"
            className="inline-block text-sm text-emerald-600 hover:text-emerald-800 underline"
          >
            回到歷史地理總覽
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
