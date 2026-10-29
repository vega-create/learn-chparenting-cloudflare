import type { Metadata } from "next";
import Link from "next/link";
import { FINANCE_MODULES } from "@/data/finance/modules";
import SubjectVisitTracker from "@/components/SubjectVisitTracker";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon from "@/components/SubjectIcon";
import HmTopicCard, { HmAboutBox } from "@/components/HmTopicCard";

export const metadata: Metadata = {
  title: "免費兒童理財遊戲 | 預算分配・存錢挑戰・記帳 | learn.chparenting.com",
  description: "免費兒童理財互動教材：認識金錢 10 張字卡、需要 vs 想要分類、零用錢四份分配、儲蓄計算機、紅包分配情境、7 天記帳模擬。從「錢是什麼」到「錢去哪了」一路練，適合國小親子一起做，不用註冊。",
  alternates: { canonical: "https://learn.chparenting.com/finance" },
};

const TYPE_LABEL: Record<string, string> = {
  lesson: "觀念",
  game: "互動遊戲",
  tool: "工具",
};

// 建議順序：先認識，再練習，最後試著記帳（都連到既有模組）
const PATH = [
  { step: 1, title: "先認識", desc: "了解金錢是什麼，分辨需要和想要", links: ["money-basics", "needs-vs-wants"] },
  { step: 2, title: "再練習", desc: "分配零用錢、規劃紅包、算算要存多久", links: ["allowance-budget", "red-envelope", "savings-calculator"] },
  { step: 3, title: "最後試著記帳", desc: "模擬 7 天記帳，看看錢去哪了", links: ["expense-tracker"] },
];

export default function FinancePage() {
  const byId = Object.fromEntries(FINANCE_MODULES.map((m) => [m.id, m]));
  return (
    <div className="bg-white">
      <SubjectVisitTracker subject="finance" />
      <PageHeader
        eyebrow="兒童理財"
        title="從生活裡認識金錢，練習做選擇"
        desc="認識金錢 · 儲蓄習慣 · 預算分配 · 記帳追蹤。用貼近生活的小遊戲和工具，大人小孩一起練。"
        icon={<SubjectIcon name="coins" size={40} />}
        iconBg="bg-[#E3A21A]"
        image="/images/pages/finance.webp"
      />

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <section className="mb-10">
          <SectionTitle>學習主題</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FINANCE_MODULES.map((m) => (
              <HmTopicCard
                key={m.id}
                href={`/finance/${m.id}`}
                icon={m.icon}
                title={m.title}
                desc={m.description}
                badge={TYPE_LABEL[m.type] || m.type}
                cta={m.type === "tool" ? "開始使用" : "開始練習"}
              />
            ))}
          </div>
        </section>

        <section className="bg-[#FDF2F5] border border-[#F6D5DF] rounded-2xl p-5 md:p-6">
          <SectionTitle>建議學習順序</SectionTitle>
          <ol className="grid md:grid-cols-3 gap-3 list-none p-0 m-0">
            {PATH.map((p) => (
              <li key={p.step} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full bg-[#E65E83] text-white text-sm font-bold flex items-center justify-center shrink-0">{p.step}</span>
                  <span className="font-bold text-[#263238]">{p.title}</span>
                </div>
                <p className="text-sm text-[#52616B] mt-1 mb-2">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.links.filter((id) => byId[id]).map((id) => (
                    <Link key={id} href={`/finance/${id}`}
                      className="text-xs px-2.5 py-1 rounded-full border border-[#2457A7] text-[#2457A7] bg-white no-underline hover:bg-[#EEF3FB]">
                      {byId[id].title}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <HmAboutBox title="為什麼要學理財？">
          <p className="m-0">
            從小培養正確的金錢觀念，長大後更懂得管理自己的錢。
            透過有趣的互動遊戲，學會分辨需要和想要、養成儲蓄習慣、規劃零用錢分配，讓每一塊錢都花得聰明！
          </p>
        </HmAboutBox>
      </div>
    </div>
  );
}
