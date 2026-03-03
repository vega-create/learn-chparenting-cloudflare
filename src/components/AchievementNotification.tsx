"use client";
import { useAchievements } from "@/contexts/AchievementContext";

export default function AchievementNotification() {
  const { newlyUnlocked, dismissNotification } = useAchievements();

  if (!newlyUnlocked) return null;

  return (
    <div
      className="fixed top-20 right-4 z-[90] max-w-xs animate-slideUp cursor-pointer"
      onClick={dismissNotification}
    >
      <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-xl p-4 flex items-center gap-3">
        <div className="text-4xl animate-badgeUnlock">{newlyUnlocked.icon}</div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-amber-500 mb-0.5">
            🏆 成就解鎖！
          </div>
          <div className="text-sm font-bold text-slate-800 truncate">
            {newlyUnlocked.name}
          </div>
          <div className="text-xs text-slate-500 truncate">
            {newlyUnlocked.description}
          </div>
        </div>
      </div>
    </div>
  );
}
