import Link from "next/link";
import { getBoardGame, BOARD_GAMES } from "@/data/board-games";

const BASE = "https://learn.chparenting.com";

/**
 * Server-rendered content for a single board-game page.
 *
 * The game pages are client components end to end, so the server sent only
 * chrome (519-618 characters). Unlike the quiz sections there is no question
 * bank to surface here, but each game already ships an accurate rules list and
 * its level count and scoring live in the code; those are reproduced verbatim
 * in src/data/board-games.ts. The skills and parent tips are written from what
 * the mechanic actually does — no claims about learning outcomes.
 *
 * Rendered from layout.tsx (a server component) after {children}, because the
 * page itself is "use client".
 */
export default function BoardGameSEO({ id }: { id: string }) {
  const g = getBoardGame(id);
  if (!g) return null;

  const related = BOARD_GAMES.filter((x) => x.category === g.category && x.id !== g.id);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: g.name,
    description: g.intro,
    url: `${BASE}/board-games/${g.id}`,
    inLanguage: "zh-TW",
    genre: g.category,
    isAccessibleForFree: true,
    numberOfPlayers: { "@type": "QuantitativeValue", minValue: 1, maxValue: 1 },
  };

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 text-slate-700 leading-relaxed border-t border-slate-200 mt-6">
        <h2 className="sr-only">
          {g.name}｜免費線上{g.category}遊戲（{g.difficulty}）
        </h2>

        <p className="mb-6 text-[15px]">{g.intro}</p>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">🎮 怎麼玩</h2>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          {g.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">🧠 這款遊戲在練什麼</h2>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          {g.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2">👨‍👩‍👧 適合年齡與陪玩建議</h2>
        <p className="mb-2 text-[14px]">{g.ageNote}</p>
        <ul className="list-disc list-inside mb-6 space-y-1 text-[14px]">
          {g.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>

        <details className="group seo-details">
          <summary className="flex items-center justify-between gap-3 cursor-pointer list-none select-none rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 px-4 py-3 md:px-5 md:py-4 border border-violet-100 transition [&::-webkit-details-marker]:hidden [&::marker]:hidden">
            <span className="font-bold text-slate-800 text-[15px] md:text-base">❓ 常見問題（點擊展開）</span>
            <span className="shrink-0 text-violet-600 text-xl transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="pt-6 space-y-3 text-[14px]">
            <details className="bg-slate-50 rounded-lg p-3">
              <summary className="font-semibold cursor-pointer text-slate-700">需要下載或註冊嗎？</summary>
              <p className="mt-2 text-slate-600">
                不用。{g.name}直接在瀏覽器裡玩，不需要下載 App 也不需要註冊帳號，手機和電腦都可以。
              </p>
            </details>
            <details className="bg-slate-50 rounded-lg p-3">
              <summary className="font-semibold cursor-pointer text-slate-700">分數會被記錄下來嗎？</summary>
              <p className="mt-2 text-slate-600">
                最高紀錄會存在這台裝置的瀏覽器裡，換一台裝置或清除瀏覽資料就會歸零，不會上傳到伺服器。
              </p>
            </details>
            <details className="bg-slate-50 rounded-lg p-3">
              <summary className="font-semibold cursor-pointer text-slate-700">難度會不會太難或太簡單？</summary>
              <p className="mt-2 text-slate-600">
                {g.name}的難度定位是「{g.difficulty}」。{g.ageNote}
              </p>
            </details>
          </div>
        </details>

        {related.length > 0 && (
          <nav className="mt-6 pt-6 border-t border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-3">同樣練{g.category}的遊戲</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/board-games/${r.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition"
                  >
                    {r.icon} {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="text-center mt-6">
          <Link href="/board-games" className="inline-block text-sm text-violet-600 hover:text-violet-800 underline">
            回到桌遊專區（共 {BOARD_GAMES.length} 款）
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
