"use client";
import { useEffect } from "react";
import { useAchievements } from "@/contexts/AchievementContext";

interface SubjectVisitTrackerProps {
  subject: string;
}

export default function SubjectVisitTracker({ subject }: SubjectVisitTrackerProps) {
  const { checkAndUnlock } = useAchievements();

  useEffect(() => {
    localStorage.setItem(`visited_${subject}`, "true");

    // Check explorer achievements after recording visit
    const subjectKeys = [
      "gept", "jlpt", "chinese-lang", "math",
      "history-geo", "typing", "board-games",
      "music", "finance",
    ];
    const count = subjectKeys.filter(
      (k) => localStorage.getItem(`visited_${k}`) === "true"
    ).length;
    if (count >= 3) checkAndUnlock("curious-explorer");
    if (count >= 6) checkAndUnlock("all-rounder");
    if (count >= 9) checkAndUnlock("platform-master");
  }, [subject, checkAndUnlock]);

  return null;
}
