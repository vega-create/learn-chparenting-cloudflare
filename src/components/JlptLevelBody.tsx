import Link from "next/link";
import UnitPhotoCard from "./UnitPhotoCard";
import { unitImage } from "@/data/unit-images";
import type { ReactNode } from "react";
import type { JlptUnit } from "@/data/jlpt-types";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import { JlptLevelTabs, JlptModeCards, type JlptLevel } from "@/components/JlptLevelNav";
import { JlptExamBanner } from "@/components/JlptExamBanner";

/**
 * 日檢級別頁共用版面：精簡頁首 → 級別切換 → 練習模式 → (N5 五十音入門) → 倒數 → 單元 → 關於這個題庫。
 * 頁面本身仍各自保留 metadata／結構化資料，只把版面抽出來。
 */
export function JlptLevelBody({
  level, units, title, eyebrow, desc, about,
}: {
  level: JlptLevel;
  units: JlptUnit[];
  title: string;
  eyebrow?: string;
  desc: ReactNode;
  about: ReactNode;
}) {
  const practiceCount = (u: JlptUnit) =>
    u.listening.length +
    (Array.isArray(u.reading) ? u.reading.reduce((s, r) => s + r.questions.length, 0) : u.reading.questions.length) +
    u.quiz.length;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        icon={<SubjectIcon name="torii" size={40} />}
        image="/images/pages/jlpt.webp"
      >
        <JlptLevelTabs current={level} />
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <JlptModeCards level={level} />

        {level === "n5" && (
          <section className="grid md:grid-cols-[1fr_auto] gap-5 items-center p-5 md:p-6 rounded-2xl border border-[#F6C9D6] bg-[#FDF3F6]">
            <div className="min-w-0">
              <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] mb-2">五十音入門</span>
              <h2 className="text-xl md:text-2xl font-black text-[#263238] m-0">學會五十音，打好日語基礎</h2>
              <p className="mt-2 mb-4 text-[#52616B] leading-relaxed">平假名、片假名對照表，每個假名都能點來聽發音，再用假名測驗確認記住了沒。</p>
              <Link href="/jlpt-n5/gojuon"
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4a8f]">
                開始學五十音 <span aria-hidden="true">›</span>
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2" aria-hidden="true">
              {[["あ", "a"], ["い", "i"], ["う", "u"], ["え", "e"], ["お", "o"]].map(([k, r]) => (
                <div key={k} className="w-12 sm:w-16 md:w-20 aspect-[4/5] rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl text-[#263238] leading-none">{k}</span>
                  <span className="text-xs text-[#52616B] mt-1">{r}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <JlptExamBanner level={level} />

        <section>
          <SectionTitle>學習單元</SectionTitle>
          <div className="grid md:grid-cols-2 gap-3">
            {units.map((u) => (
              <UnitPhotoCard key={u.id} href={`/jlpt-${level}/unit/${u.id}`}
                unitLabel={`Unit ${u.id}`} title={u.title} subtitle={u.titleJa}
                meta={`${u.vocab.length} 單字 · ${u.grammar.length} 文法 · ${practiceCount(u)} 題練習`}
                image={unitImage(`jlpt-${level}`, u.id)} icon={u.icon} />
            ))}
          </div>
        </section>

        <section className="p-6 bg-white rounded-2xl border border-slate-200">
          <h2 className="text-lg font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mb-3">關於這個題庫</h2>
          {about}
        </section>
      </div>
    </div>
  );
}
