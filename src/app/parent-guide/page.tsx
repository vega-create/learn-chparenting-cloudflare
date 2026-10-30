import { UNITS as EL_UNITS } from "@/data/elementary";
import { INTER_UNITS } from "@/data/intermediate";
import { UI_UNITS } from "@/data/upper-intermediate";
import { N5_UNITS } from "@/data/jlpt-n5";
import { N4_UNITS } from "@/data/jlpt-n4";
import { N3_UNITS } from "@/data/jlpt-n3";
import { N2_UNITS } from "@/data/jlpt-n2";
import { N1_UNITS } from "@/data/jlpt-n1";
import { getUnitGuide } from "@/lib/unit-guides";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import InfoIcon from "@/components/InfoPageIcons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "家長陪伴指南 | 全民英檢・JLPT 日檢 194 個單元指南 | learn.chparenting.com",
  description:
    "194 個單元的家長陪伴指南，涵蓋全民英檢初級到中高級、JLPT N5 到 N1。每個單元都有學習目標、陪伴方式、過關清單和常見問題，幫助家長陪孩子一起學習。",
  keywords:
    "家長陪伴指南, 全民英檢家長, JLPT家長指南, 親子學習, 英檢學習指南, 日檢學習指南",
  alternates: { canonical: "https://learn.chparenting.com/parent-guide" },
};

const GEPT_GUIDES = [
  { level: "初級", eng: "Elementary", href: "/elementary/guide", units: EL_UNITS.length },
  { level: "中級", eng: "Intermediate", href: "/intermediate/guide", units: INTER_UNITS.length },
  { level: "中高級", eng: "Upper-Intermediate", href: "/upper-intermediate/guide", units: UI_UNITS.length },
];

const JLPT_GUIDES = [
  { level: "N5", name: "入門", href: "/jlpt-n5/guide", units: N5_UNITS.length },
  { level: "N4", name: "基礎", href: "/jlpt-n4/guide", units: N4_UNITS.length },
  { level: "N3", name: "中級", href: "/jlpt-n3/guide", units: N3_UNITS.length },
  { level: "N2", name: "上級", href: "/jlpt-n2/guide", units: N2_UNITS.length },
  { level: "N1", name: "最上級", href: "/jlpt-n1/guide", units: N1_UNITS.length },
];

/** 精選示範：英檢初級第 1 單元（內容取自實際的單元指南資料） */
const FEATURED_UNIT = EL_UNITS.find((u) => u.id === 1);
const FEATURED_GUIDE = getUnitGuide("elementary", 1);

function GuideLevelCard({ href, badge, title, units }: { href: string; badge: string; title: string; units: number }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#2457A7] transition no-underline"
    >
      <span className="shrink-0 min-w-[3.25rem] text-center px-2.5 py-1 rounded-lg bg-[#FDECF1] text-[#C2416A] text-sm font-bold">
        {badge}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#263238]">{title}</div>
        <div className="text-sm text-[#52616B]">{units} 個單元指南</div>
      </div>
      <span className="shrink-0 w-8 h-8 rounded-lg bg-[#FDECF1] text-[#C2416A] flex items-center justify-center group-hover:bg-[#2457A7] group-hover:text-white transition">
        <InfoIcon name="arrow" size={16} />
      </span>
    </Link>
  );
}

export default function ParentGuidePage() {
  const totalUnits =
    GEPT_GUIDES.reduce((sum, g) => sum + g.units, 0) +
    JLPT_GUIDES.reduce((sum, g) => sum + g.units, 0);

  return (
    <div className="bg-white pb-12">
      <PageHeader
        eyebrow="家長陪伴指南"
        title="不需要當老師，也能陪孩子學習。"
        desc={<>共 {totalUnits} 個單元指南，涵蓋全民英檢初級到中高級、JLPT N5 到 N1。每個單元都告訴你今天學什麼、怎麼陪、學會了沒。</>}
        image="/images/banners/parent-guide.webp"
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* 科目切換（錨點） */}
        <nav aria-label="指南科目" className="grid grid-cols-2 gap-2 p-2 bg-white rounded-2xl border border-slate-200 mb-6">
          <a href="#gept" className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-[#FDECF1] text-[#C2416A] font-bold no-underline">
            <SubjectIcon name="book" size={24} /> 英文與英檢
          </a>
          <a href="#jlpt" className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-[#263238] font-bold no-underline hover:bg-slate-50">
            <SubjectIcon name="torii" size={24} /> 日文 JLPT
          </a>
        </nav>

        {/* 精選陪伴指南 */}
        {FEATURED_UNIT && FEATURED_GUIDE && (
          <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-7 mb-10">
            <div className="text-sm font-bold text-[#E65E83] mb-1">精選陪伴指南・英檢初級</div>
            <h2 className="text-2xl md:text-[28px] font-black text-[#263238] m-0">
              第 1 單元：{FEATURED_UNIT.title}
            </h2>
            <p className="mt-1.5 mb-5 text-[#52616B]">
              每個單元指南都包含：今日主題與學習目標、家長陪伴方式、過關清單、常見問題。以下是實際內容示範。
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 md:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#E65E83] text-white text-sm font-bold flex items-center justify-center">01</span>
                  <h3 className="text-lg font-bold text-[#263238] m-0">今天學什麼？</h3>
                </div>
                <p className="text-[#263238] font-medium m-0">{FEATURED_GUIDE.todayTopic}</p>
                <div className="mt-3 rounded-lg bg-[#F4F7FB] p-3 text-sm text-[#52616B] leading-relaxed">
                  <div><span className="font-bold text-[#263238]">學習目標：</span>{FEATURED_GUIDE.learningGoal}</div>
                  <div className="mt-1"><span className="font-bold text-[#263238]">建議時間：</span>{FEATURED_GUIDE.estimatedTime}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 md:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#E65E83] text-white text-sm font-bold flex items-center justify-center">02</span>
                  <h3 className="text-lg font-bold text-[#263238] m-0">可以怎麼陪？</h3>
                </div>
                <div className="space-y-2 text-sm text-[#52616B] leading-relaxed">
                  {FEATURED_GUIDE.guidanceText.split("\n").map((line) => (
                    <p key={line} className="m-0">{line}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 md:p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-[#E65E83] text-white text-sm font-bold flex items-center justify-center">03</span>
                  <h3 className="text-lg font-bold text-[#263238] m-0">學會了嗎？</h3>
                </div>
                <p className="text-sm text-[#52616B] mt-0 mb-2">用過關清單看看孩子是否掌握了重點：</p>
                <ul className="list-none p-0 m-0 space-y-2">
                  {FEATURED_GUIDE.passChecklist.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#263238]">
                      <span className="mt-0.5 w-4 h-4 rounded border border-slate-300 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#FFF8EC] border border-amber-100 p-3.5 text-sm text-[#52616B] leading-relaxed">
              <InfoIcon name="bulb" size={18} className="text-amber-600 mt-0.5" />
              <span><span className="font-bold text-[#263238]">常見狀況：</span>{FEATURED_GUIDE.commonIssues}</span>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="/worksheets/gept/elementary/unit-01.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#2457A7] text-[#2457A7] bg-white font-bold text-sm no-underline hover:bg-[#F4F7FB]"
              >
                <InfoIcon name="download" size={18} /> 下載本單元練習單 PDF
              </a>
              <Link
                href="/elementary/guide/unit-01"
                className="inline-flex items-center justify-center gap-1 px-5 py-3 rounded-xl text-[#2457A7] font-bold text-sm no-underline hover:underline"
              >
                看完整單元指南
              </Link>
              <Link
                href="/elementary/unit/1"
                className="sm:ml-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-[#2457A7] text-white font-bold text-sm no-underline hover:bg-[#1d4a8f]"
              >
                前往對應練習 <InfoIcon name="arrow" size={16} />
              </Link>
            </div>
          </section>
        )}

        {/* 全民英檢 */}
        <section id="gept" className="mb-10 scroll-mt-24">
          <SectionTitle>全民英檢 GEPT 陪伴指南</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {GEPT_GUIDES.map((g) => (
              <GuideLevelCard key={g.level} href={g.href} badge={g.level} title={`${g.level} ${g.eng}`} units={g.units} />
            ))}
          </div>
        </section>

        {/* JLPT 日文檢定 */}
        <section id="jlpt" className="mb-10 scroll-mt-24">
          <SectionTitle>日本語能力試驗 JLPT 陪伴指南</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JLPT_GUIDES.map((g) => (
              <GuideLevelCard key={g.level} href={g.href} badge={g.level} title={`${g.level}（${g.name}）`} units={g.units} />
            ))}
          </div>
        </section>

        {/* ebook 說明 */}
        <div className="flex items-start gap-3 bg-white rounded-2xl border border-slate-200 p-4 md:p-5 mb-6 text-sm text-[#52616B]">
          <InfoIcon name="book" size={20} className="text-[#E65E83] mt-0.5" />
          <p className="m-0 leading-relaxed">每個等級都可以輸入 email 索取完整 ebook PDF，系統會自動寄送！</p>
        </div>

        {/* CTA */}
        <div className="bg-[#FDECF1] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-xl font-bold text-[#263238] m-0">陪伴是最好的教育</p>
            <p className="text-[#52616B] mt-1 mb-0">
              不需要成為專家，只要願意陪孩子一起學習，就是最棒的爸媽！
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/elementary"
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-[#2457A7] text-white rounded-xl font-bold text-sm hover:bg-[#1d4a8f] transition no-underline"
            >
              開始英檢學習 <InfoIcon name="arrow" size={16} />
            </Link>
            <Link
              href="/jlpt-n5"
              className="inline-flex items-center gap-1.5 px-5 py-3 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline"
            >
              開始日文學習 <InfoIcon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
