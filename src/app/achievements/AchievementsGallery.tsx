"use client";
import { useAchievements } from "@/contexts/AchievementContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  ACHIEVEMENTS,
  CATEGORY_LABELS,
  type AchievementCategory,
} from "@/data/achievements";
import ShareButtons from "@/components/ShareButtons";
import PageHeader, { SectionTitle } from "@/components/PageHeader";
import SubjectIcon, { type SubjectIconName } from "@/components/SubjectIcon";
import InfoIcon from "@/components/InfoPageIcons";

const CATEGORY_ORDER: AchievementCategory[] = [
  "milestone",
  "mastery",
  "games",
  "consistency",
  "explorer",
  "fun",
];

const POPULAR: { href: string; icon: SubjectIconName; name: string; desc: string; color: string }[] = [
  { href: "/gept", icon: "book", name: "英文與英檢", desc: "初級到中高級，聽說讀寫", color: "text-[#E65E83]" },
  { href: "/jlpt-n5", icon: "torii", name: "日文學習", desc: "五十音到 N1", color: "text-[#C2416A]" },
  { href: "/math", icon: "calculator", name: "數學練習", desc: "8 大主題，觀念加練習", color: "text-[#2457A7]" },
  { href: "/board-games", icon: "brain", name: "教育遊戲", desc: "21 款邏輯與記憶遊戲", color: "text-emerald-700" },
];

export default function AchievementsGallery() {
  const { unlockedIds, records, totalCount, unlockedCount } = useAchievements();
  const { user, configured } = useAuth();

  const recordMap = Object.fromEntries(records.map((r) => [r.id, r.unlockedAt]));
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="bg-white pb-12">
      <PageHeader
        eyebrow="我的學習"
        title="學習成就"
        desc="完成單元、玩桌遊、每天回來練習，就會解鎖對應的徽章。大人小孩都能收集。"
        image="/images/banners/achievements.webp"
      >
        <a
          href="/#subjects"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4a8f]"
        >
          <InfoIcon name="search" size={18} /> 找練習
        </a>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4">
        {/* 進度 + 登入說明 */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-5 mb-10">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <InfoIcon name="trophy" size={22} className="text-[#E65E83]" />
              <h2 className="text-lg md:text-xl font-bold text-[#263238] m-0">此裝置的學習成就</h2>
            </div>
            <div className="flex items-end justify-between gap-3 mb-2">
              <p className="m-0 text-[#52616B]">
                已解鎖 <span className="text-2xl font-black text-[#263238]">{unlockedCount}</span> / {totalCount} 個成就
              </p>
              <span className="text-sm text-[#52616B]">{pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E65E83] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            {unlockedCount === 0 ? (
              <div className="mt-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 p-6 text-center">
                <p className="font-bold text-[#263238] m-0">尚無成就紀錄，選一個主題開始吧！</p>
                <p className="text-sm text-[#52616B] mt-1 mb-4">完成第一個單元或第一場桌遊，就會解鎖第一個徽章。</p>
                <a
                  href="/#subjects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2457A7] text-white font-bold text-sm no-underline hover:bg-[#1d4a8f]"
                >
                  <InfoIcon name="search" size={16} /> 找練習
                </a>
              </div>
            ) : (
              <p className="text-sm text-[#52616B] mt-4 mb-0">繼續完成練習，解鎖下面還沒拿到的徽章。</p>
            )}
            <p className="text-xs text-[#52616B] mt-4 mb-0 flex items-start gap-1.5">
              <InfoIcon name="info" size={14} className="mt-px" />
              成就紀錄存在這台裝置的瀏覽器中，清除瀏覽器資料會一併清除。
            </p>
          </section>

          <aside className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 mb-2">
                  <InfoIcon name="users" size={20} className="text-[#2457A7]" />
                  <h2 className="text-lg font-bold text-[#263238] m-0">學習紀錄與計畫</h2>
                </div>
                <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-4">
                  你已登入，可以到學習紀錄頁查看最近的練習與每日學習計畫。
                </p>
                <a href="/dashboard" className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4a8f]">
                  前往學習紀錄 <InfoIcon name="arrow" size={16} />
                </a>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 mb-2">
                  <InfoIcon name="lock" size={20} className="text-[#2457A7]" />
                  <h2 className="text-lg font-bold text-[#263238] m-0">登入後可保存學習紀錄</h2>
                </div>
                <p className="text-sm text-[#52616B] leading-relaxed mt-0 mb-4">
                  所有練習都不需要登入。若想查看練習紀錄、設定每日學習計畫，可以用 Google 帳號登入。
                </p>
                {configured && (
                  <a href="/login" className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-xl bg-[#2457A7] text-white font-bold no-underline hover:bg-[#1d4a8f]">
                    登入
                  </a>
                )}
                <p className="text-xs text-[#52616B] text-center mt-3 mb-0">不登入也沒關係，直接開始練習就可以！</p>
              </>
            )}
          </aside>
        </div>

        {/* 分類展示 */}
        {CATEGORY_ORDER.map((cat) => {
          const badges = ACHIEVEMENTS.filter((a) => a.category === cat);
          if (badges.length === 0) return null;

          return (
            <section key={cat} className="mb-8">
              <SectionTitle>{CATEGORY_LABELS[cat]}</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {badges.map((badge) => {
                  const isUnlocked = unlockedIds.has(badge.id);
                  const unlockDate = recordMap[badge.id];

                  return (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-4 rounded-2xl p-4 border bg-white transition ${
                        isUnlocked ? "border-[#F5B8C9]" : "border-slate-200"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl ${
                          isUnlocked ? "bg-[#FDECF1] animate-badgeUnlock" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isUnlocked ? badge.icon : <InfoIcon name="lock" size={22} />}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-bold ${isUnlocked ? "text-[#263238]" : "text-[#52616B]"}`}>
                          {badge.name}
                        </div>
                        <div className="text-sm text-[#52616B] mt-0.5 leading-snug">
                          {badge.description}
                        </div>
                        {isUnlocked && unlockDate && (
                          <div className="text-xs text-[#C2416A] mt-1">
                            {new Date(unlockDate).toLocaleDateString("zh-TW")} 解鎖
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="text-xs text-slate-400 mt-1">
                            尚未解鎖
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* 熱門主題 */}
        <section className="mb-8">
          <SectionTitle action={<a href="/#subjects" className="text-sm font-bold text-[#2457A7] no-underline hover:underline whitespace-nowrap">瀏覽全部主題</a>}>
            不知道從哪裡開始？
          </SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {POPULAR.map((p) => (
              <a key={p.href} href={p.href} className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#2457A7] no-underline transition">
                <span className={p.color}><SubjectIcon name={p.icon} size={32} /></span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#263238]">{p.name}</div>
                  <div className="text-sm text-[#52616B]">{p.desc}</div>
                </div>
                <InfoIcon name="arrow" size={16} className="text-[#52616B] group-hover:text-[#2457A7]" />
              </a>
            ))}
          </div>
        </section>

        {/* 分享區 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <p className="text-[#263238] font-bold mb-1">分享你的學習成就</p>
          <p className="text-sm text-[#52616B] mb-4">
            讓朋友知道你的學習進度！
          </p>
          <ShareButtons
            text={`我在親子多元學習平台已經解鎖了 ${unlockedCount} 個學習成就！快來一起學習 🏆`}
            url="/achievements"
          />
        </div>
      </div>
    </div>
  );
}
