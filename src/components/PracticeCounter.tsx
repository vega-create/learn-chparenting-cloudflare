"use client";
import { useState, useEffect, useRef } from "react";

export default function PracticeCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.totalPractices >= 0) setCount(d.totalPractices);
      })
      .catch(() => {});
  }, []);

  // Counting animation
  useEffect(() => {
    if (count === null || animated.current) return;
    animated.current = true;

    const duration = 1200;
    const steps = 30;
    const increment = count / steps;
    let current = 0;
    let step = 0;

    const iv = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), count);
      setDisplay(current);
      if (step >= steps) clearInterval(iv);
    }, duration / steps);

    return () => clearInterval(iv);
  }, [count]);

  if (count === null) return null;

  return (
    <div className="flex flex-col items-center py-4 mb-2">
      <div className="text-3xl md:text-4xl font-black text-rose-400 tabular-nums tracking-tight">
        {display.toLocaleString()}
      </div>
      <div className="text-sm text-slate-500 mt-1">次練習完成 🎉</div>
    </div>
  );
}
