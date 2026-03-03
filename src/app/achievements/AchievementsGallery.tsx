"use client";
import { useAchievements } from "@/contexts/AchievementContext";
import {
  ACHIEVEMENTS,
  CATEGORY_LABELS,
  type AchievementCategory,
} from "@/data/achievements";
import ShareButtons from "@/components/ShareButtons";

const CATEGORY_ORDER: AchievementCategory[] = [
  "milestone",
  "mastery",
  "games",
  "consistency",
  "explorer",
  "fun",
];

export default function AchievementsGallery() {
  const { unlockedIds, records, totalCount, unlockedCount } = useAchievements();

  const recordMap = Object.fromEntries(records.map((r) => [r.id, r.unlockedAt]));
  const pct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 標題 */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">學習成就</h1>
        <p className="text-slate-500">
          已解鎖 <span className="text-amber-500 font-bold">{unlockedCount}</span> / {totalCount} 個成就
        </p>
      </div>

      {/* 進度條 */}
      <div className="max-w-md mx-auto mb-10">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-center text-xs text-slate-400 mt-1">{pct}%</div>
      </div>

      {/* 分類展示 */}
      {CATEGORY_ORDER.map((cat) => {
        const badges = ACHIEVEMENTS.filter((a) => a.category === cat);
        if (badges.length === 0) return null;

        return (
          <section key={cat} className="mb-8">
            <h2 className="text-lg font-bold text-slate-700 mb-4">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => {
                const isUnlocked = unlockedIds.has(badge.id);
                const unlockDate = recordMap[badge.id];

                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl p-5 border text-center transition ${
                      isUnlocked
                        ? "bg-white border-amber-200 shadow-sm hover-lift"
                        : "bg-slate-50 border-slate-200 opacity-50"
                    }`}
                  >
                    <div
                      className={`text-4xl mb-2 ${
                        isUnlocked ? "animate-badgeUnlock" : "grayscale"
                      }`}
                    >
                      {isUnlocked ? badge.icon : "🔒"}
                    </div>
                    <div className="font-bold text-sm text-slate-800">
                      {badge.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {badge.description}
                    </div>
                    {isUnlocked && unlockDate && (
                      <div className="text-[10px] text-amber-500 mt-2">
                        {new Date(unlockDate).toLocaleDateString("zh-TW")} 解鎖
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="text-[10px] text-slate-400 mt-2">
                        尚未解鎖
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* 分享區 */}
      <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 text-center">
        <div className="text-3xl mb-3">🎉</div>
        <p className="text-slate-700 font-medium mb-1">分享你的學習成就</p>
        <p className="text-sm text-slate-500 mb-4">
          讓朋友知道你的學習進度！
        </p>
        <ShareButtons
          text={`我在親子多元學習平台已經解鎖了 ${unlockedCount} 個學習成就！快來一起學習 🏆`}
          url="/achievements"
        />
      </div>
    </div>
  );
}
