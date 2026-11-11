"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface ScheduleItem {
  subject: string;
  activityType: string;
  activityId: string;
  activityName: string;
  icon: string;
  href: string;
}

export type WeekSchedule = Record<number, ScheduleItem[]>; // 0-6

const FETCH_OPTS: RequestInit = { cache: "no-store", credentials: "same-origin" };

export function useSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<WeekSchedule>({});
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const res = await fetch("/api/me/schedule", FETCH_OPTS);
      const data = res.ok ? ((await res.json()) as { day_of_week: number; activities: ScheduleItem[] }[]) : [];
      const map: WeekSchedule = {};
      data.forEach((row) => { map[row.day_of_week] = row.activities; });
      setSchedule(map);
    } catch {
      setSchedule({});
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  const saveDay = useCallback(async (dayOfWeek: number, activities: ScheduleItem[]) => {
    if (!user) return;
    await fetch("/api/me/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayOfWeek, activities }),
      ...FETCH_OPTS,
    }).catch(() => {});
    setSchedule((prev) => ({ ...prev, [dayOfWeek]: activities }));
  }, [user]);

  const deleteDay = useCallback(async (dayOfWeek: number) => {
    if (!user) return;
    await fetch(`/api/me/schedule?day=${dayOfWeek}`, { method: "DELETE", ...FETCH_OPTS }).catch(() => {});
    setSchedule((prev) => {
      const next = { ...prev };
      delete next[dayOfWeek];
      return next;
    });
  }, [user]);

  const todayTasks = schedule[new Date().getDay()] ?? [];

  return { schedule, todayTasks, loading, saveDay, deleteDay, refresh: fetchSchedule };
}
