"use client";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "總覽", icon: "📊" },
  { href: "/dashboard/schedule", label: "學習計畫", icon: "📋" },
  { href: "/dashboard/records", label: "學習紀錄", icon: "📈" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-white min-h-[60vh]">
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="text-sm font-bold text-[#E65E83] mb-2">我的學習</div>
      {/* Tab navigation */}
      <nav className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition no-underline whitespace-nowrap ${
                isActive
                  ? "bg-[#FDECF1] text-[#C2416A]"
                  : "text-[#52616B] hover:text-[#263238] hover:bg-slate-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </a>
          );
        })}
      </nav>

      {children}
    </div>
    </div>
  );
}
