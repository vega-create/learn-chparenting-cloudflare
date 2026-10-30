import { UI_UNITS as UNITS } from "@/data/upper-intermediate";
import AdSlot from "@/components/AdSlot";
import PageHeader from "@/components/PageHeader";
import UnitPhotoCard from "@/components/UnitPhotoCard";
import { unitImage } from "@/data/unit-images";
import type { Metadata } from "next";
import { GeptLevelNav } from "@/components/GeptLevelNav";

export const metadata: Metadata = {
  title: "全民英檢中高級免費練習 | 8000+ 單字・進階文法・模擬考 | learn.chparenting.com",
  description: "全民英檢中高級免費線上題庫：40 個主題單元，進階單字附發音、複雜句型與文法、長篇聽力、學術閱讀，另有單字遊戲、口說錄音、寫作練習與計時模擬測驗。適合高中生與進階英文學習者備考，不用註冊、手機平板都能用。",
  alternates: { canonical: "https://learn.chparenting.com/upper-intermediate" },
};

export default function ElementaryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader bare eyebrow="英文與英檢" title="全民英檢中高級免費練習" image="/images/banners/gept.webp"
        desc="大學畢業程度 · 約 8000 單字 · 40 個主題單元，選一個單元或模式就能開始，不用註冊。" />

      <GeptLevelNav level="upper-intermediate" />

      <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mb-4">主題單元</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {UNITS.map((u) => (
          <UnitPhotoCard key={u.id} href={`/upper-intermediate/unit/${u.id}`}
            unitLabel={`Unit ${u.id}`} title={u.title} color={u.color}
            meta={`${u.vocab.length} 單字 · ${u.grammar.length} 文法 · ${u.listening.length + (Array.isArray(u.reading) ? u.reading.reduce((sum, r) => sum + r.questions.length, 0) : u.reading.questions.length) + u.quiz.length} 題練習`}
            image={unitImage("upper-intermediate", u.id)} icon={u.icon} />
        ))}
      </div>
      <AdSlot unit="list" />
    </div>
  );
}
