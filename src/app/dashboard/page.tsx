"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTracking } from "@/hooks/useTracking";
import { useSchedule } from "@/hooks/useSchedule";
import { getRecentActivities, getTodayActivities, getWeekStats, type LearningActivity } from "@/lib/tracking";
import ActivityCard from "@/components/ActivityCard";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { streak } = useTracking();
  const { todayTasks, loading: scheduleLoading } = useSchedule();

  const [recentActivities, setRecentActivities] = useState<LearningActivity[]>([]);
  const [todayCompleted, setTodayCompleted] = useState<LearningActivity[]>([]);
  const [weekStats, setWeekStats] = useState({ count: 0, avgScore: 0, subjects: [] as string[] });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) { setDataLoading(false); return; }
    Promise.all([
      getRecentActivities(5),
      getTodayActivities(),
      getWeekStats(),
    ]).then(([recent, today, stats]) => {
      setRecentActivities(recent);
      setTodayCompleted(today);
      setWeekStats(stats);
      setDataLoading(false);
    });
  }, [user]);

  if (authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-slate-400">載入中...</div></div>;
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "使用者";
  const isLoading = dataLoading || scheduleLoading;

  // Check which today's tasks are completed
  const todayCompletedIds = new Set(todayCompleted.map((a) => a.activity_id));

  return (
    <div className="space-y-6">
      {/* Welcome + Streak */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black mb-1 text-[#263238]">👋 歡迎回來，{displayName}！</h1>
            <p className="text-slate-500 text-sm">持續學習，每天進步一點點</p>
          </div>
          {streak && streak.current_streak > 0 && (
            <div className="flex items-center gap-3 bg-[#FDECF1] rounded-xl px-5 py-3">
              <div className="text-center">
                <div className="text-3xl">🔥</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#C2416A]">{streak.current_streak} 天</div>
                <div className="text-xs text-slate-500">連續學習</div>
              </div>
              {streak.longest_streak > streak.current_streak && (
                <div className="text-xs text-slate-500 border-l border-[#F5B8C9] pl-3 ml-1">
                  最長紀錄<br /><span className="font-bold text-[#C2416A]">{streak.longest_streak} 天</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#263238] flex items-center gap-2 border-l-4 border-[#E65E83] pl-3">
            <span>📋</span> 今日學習計畫
          </h2>
          <a href="/dashboard/schedule" className="text-sm font-bold text-[#2457A7] hover:underline no-underline">編輯計畫 →</a>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-sm py-4 text-center">載入中...</div>
        ) : todayTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-slate-500 text-sm mb-3">還沒有設定今天的學習計畫</p>
            <a href="/dashboard/schedule" className="text-sm text-[#2457A7] font-bold hover:underline no-underline">
              前往設定 →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => {
              const done = todayCompletedIds.has(task.activityId);
              return (
                <a
                  key={task.activityId}
                  href={task.href}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition no-underline ${
                    done
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-slate-100 hover:border-[#2457A7] hover:bg-[#F4F7FB]"
                  }`}
                >
                  <span className="text-xl">{task.icon}</span>
                  <span className={`flex-1 font-medium text-sm ${done ? "text-emerald-700 line-through" : "text-slate-700"}`}>
                    {task.activityName}
                  </span>
                  {done ? (
                    <span className="text-emerald-500 text-lg">✅</span>
                  ) : (
                    <span className="text-xs text-[#2457A7] font-bold">開始 →</span>
                  )}
                </a>
              );
            })}
            <div className="text-xs text-slate-400 text-center pt-2">
              完成 {todayTasks.filter((t) => todayCompletedIds.has(t.activityId)).length} / {todayTasks.length}
            </div>
          </div>
        )}
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
          <div className="text-3xl font-black text-[#C2416A]">{isLoading ? "-" : weekStats.count}</div>
          <div className="text-xs text-slate-500 mt-1">本週活動</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
          <div className="text-3xl font-black text-[#2457A7]">{isLoading ? "-" : weekStats.avgScore > 0 ? `${weekStats.avgScore}%` : "-"}</div>
          <div className="text-xs text-slate-500 mt-1">平均分數</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
          <div className="text-3xl font-black text-[#263238]">{isLoading ? "-" : weekStats.subjects.length}</div>
          <div className="text-xs text-slate-500 mt-1">涵蓋科目</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#263238] flex items-center gap-2 border-l-4 border-[#E65E83] pl-3">
            <span>🕐</span> 最近學習
          </h2>
          <a href="/dashboard/records" className="text-sm font-bold text-[#2457A7] hover:underline no-underline">查看全部 →</a>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-sm py-4 text-center">載入中...</div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-slate-500 text-sm">還沒有學習紀錄，開始第一個活動吧！</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
        <h3 className="font-bold text-[#263238] mb-3">快速開始</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <a href="/elementary" className="px-4 py-2 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">📘 英檢</a>
          <a href="/jlpt-n5" className="px-4 py-2 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">🇯🇵 日文</a>
          <a href="/board-games" className="px-4 py-2 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">🎲 桌遊</a>
          <a href="/math" className="px-4 py-2 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">🔢 數學</a>
          <a href="/finance" className="px-4 py-2 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">💰 理財</a>
          <a href="/typing-game" className="px-4 py-2 border border-[#2457A7] text-[#2457A7] bg-white rounded-xl font-bold text-sm hover:bg-[#F4F7FB] transition no-underline">⌨️ 打字</a>
        </div>
      </div>
    </div>
  );
}
