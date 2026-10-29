"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * 教育遊戲總覽的卡片清單＋分類篩選。
 * 遊戲資料由 board-games/page.tsx 傳進來（伺服器端），這裡只負責篩選與排版。
 */
export interface CatalogGame { id: string; icon: string; name: string; desc: string; difficulty: string }
export interface CatalogCategory { key: string; label: string; games: CatalogGame[] }

export default function BoardGameCatalog({ categories }: { categories: CatalogCategory[] }) {
  const [active, setActive] = useState("all");
  const shown = categories.flatMap((c) =>
    active === "all" || active === c.key ? c.games.map((g) => ({ ...g, cat: c })) : [],
  );

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="text-sm font-semibold text-slate-600 mb-2">主題分類</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="依主題篩選遊戲">
          {[{ key: "all", label: "全部" }, ...categories].map((c) => (
            <button key={c.key} type="button" onClick={() => setActive(c.key)} aria-pressed={active === c.key}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border cursor-pointer ${
                active === c.key
                  ? "bg-[#E65E83] border-[#E65E83] text-white"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-600 mb-3">共 {shown.length} 款教育遊戲</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((g) => (
          <Link key={g.id} href={`/board-games/${g.id}`}
            className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden no-underline hover:shadow-md transition-shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/games/${g.id}.webp`} alt="" loading="lazy" className="w-full aspect-[3/2] object-cover bg-slate-50" />
            <div className="flex flex-col flex-1 p-4">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{g.name}</h3>
              <p className="text-sm text-slate-600 mb-3 flex-1">{g.desc}</p>
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#FDECF1] text-[#C2416A] font-semibold">{g.cat.label}</span>
                <span className="text-slate-500">難度 {g.difficulty}</span>
              </div>
              <span className="block text-center py-2.5 rounded-xl bg-[#2457A7] text-white text-sm font-bold group-hover:bg-[#1d4688]">
                開始遊戲 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
