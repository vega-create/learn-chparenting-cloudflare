import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { SITE_UPDATES } from "@/data/site-updates";
import UpdatesList from "./UpdatesList";

export const metadata: Metadata = {
  title: "全部公告｜最新消息與更新紀錄 - learn.chparenting.com",
  description: "親子多元學習平台的新增練習、功能更新與新文章，依日期排列。考試日期請見報考資訊。",
  alternates: { canonical: "https://learn.chparenting.com/updates" },
};

export default function UpdatesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader bare eyebrow="網站公告" title="全部公告" image="/images/banners/updates.webp"
        desc="首頁跑馬燈只放最新幾則，這裡是完整的更新紀錄。">
        <a href="/exam-info" className="font-semibold text-[#2457A7] no-underline">考試日期與報名時間，請看報考資訊 →</a>
      </PageHeader>
      <UpdatesList updates={SITE_UPDATES} />
      <a href="/" className="inline-block mt-6 text-sm font-semibold text-[#2457A7] no-underline">← 返回首頁</a>
    </div>
  );
}
