import { INTER_UNITS as UNITS } from "@/data/intermediate";
import PageHeader from "@/components/PageHeader";
import UnitPhotoCard from "@/components/UnitPhotoCard";
import { unitImage } from "@/data/unit-images";
import type { Metadata } from "next";
import { GeptLevelNav } from "@/components/GeptLevelNav";
import { GeptExamBanner } from "@/components/GeptExamBanner";
import { ToolStructuredData } from "@/components/ToolStructuredData";

export const metadata: Metadata = {
  title: "全民英檢中級題庫｜GEPT 中級免費線上練習（單字・聽力・閱讀） - learn.chparenting.com",
  description: "全民英檢中級免費線上題庫：34 個主題單元，單字附發音與重音提示、文法、聽力與閱讀練習，另有單字遊戲、口說錄音、寫作四種題型與計時模擬測驗，每單元附家長陪伴說明與練習單 PDF。適合國中生、高中生備考，不用註冊。",
  keywords: ["GEPT中級", "全民英檢中級", "英檢中級練習", "英檢中級題庫", "GEPT中級免費"],
  openGraph: {
    title: "全民英檢中級題庫｜GEPT 中級免費線上練習",
    description: "免費 GEPT 全民英檢中級線上練習，涵蓋單字、文法、聽力、閱讀完整題庫。",
    url: "https://learn.chparenting.com/intermediate/",
    siteName: "learn.chparenting.com",
    locale: "zh_TW",
    type: "website",
  },
  alternates: { canonical: "https://learn.chparenting.com/intermediate" },
};

export default function ElementaryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ToolStructuredData
        name="全民英檢中級題庫｜GEPT 中級免費線上練習"
        description="專為備考 GEPT 全民英檢中級設計的免費線上練習平台，適合國中生、高中生"
        url="https://learn.chparenting.com/intermediate/"
        educationalLevel="國中"
        subject="英語"
      />
      <PageHeader bare eyebrow="英文與英檢" title="全民英檢中級免費練習" image="/images/banners/gept.webp"
        desc="高中畢業程度 · 約 5000 單字 · 34 個主題單元，選一個單元或模式就能開始，不用註冊。" />

      <GeptLevelNav level="intermediate" />

      <GeptExamBanner level="intermediate" />

      <h2 className="text-xl md:text-2xl font-bold text-[#263238] border-l-4 border-[#E65E83] pl-3 mb-4">主題單元</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {UNITS.map((u) => (
          <UnitPhotoCard key={u.id} href={`/intermediate/unit/${u.id}`}
            unitLabel={`Unit ${u.id}`} title={u.title} color={u.color}
            meta={`${u.vocab.length} 單字 · ${u.grammar.length} 文法 · ${u.listening.length + (Array.isArray(u.reading) ? u.reading.reduce((sum, r) => sum + r.questions.length, 0) : u.reading.questions.length) + u.quiz.length} 題練習`}
            image={unitImage("intermediate", u.id)} icon={u.icon} />
        ))}
      </div>

      <section className="mt-10 p-6 bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2">關於這個題庫</h2>
        <p className="text-slate-600 leading-relaxed mb-3">給準備 GEPT 全民英檢中級的人免費練習：國高中生，或想考證照、進修英文的大人都適用。題庫涵蓋中級程度的單字、文法、聽力、閱讀，完整對應英檢中級考試範圍。每個單元可下載練習單 PDF，搭配線上練習反覆熟悉題型。不需要帳號，免費直接開始。</p>
        <ul className="space-y-1 text-sm text-slate-700 list-none p-0 m-0">
          <li>✓ 中級程度單字、文法、聽力、閱讀</li>
          <li>✓ 每單元附練習單 PDF 免費下載</li>
          <li>✓ 完整對應 GEPT 中級考試範圍</li>
          <li>✓ 不需要帳號，免費直接練習</li>
        </ul>
      </section>
    </div>
  );
}
