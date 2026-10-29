import Link from "next/link";

/**
 * 英檢級別頁上方：切換級別＋練習模式入口。
 * 模式入口原本排在所有單元之後，考前來的人要捲很久才找得到，所以放到單元清單前面。
 */
type Level = "elementary" | "intermediate" | "upper-intermediate";

const LEVELS: { id: Level; name: string }[] = [
  { id: "elementary", name: "初級" },
  { id: "intermediate", name: "中級" },
  { id: "upper-intermediate", name: "中高級" },
];

const MODES = [
  { path: "mock-test", icon: "📝", name: "模擬測驗", desc: "練習版，考完看解答" },
  { path: "speaking", icon: "🎙️", name: "口說訓練", desc: "發音、跟讀、朗讀、問答" },
  { path: "writing", icon: "✍️", name: "寫作練習", desc: "句子重組、翻譯、段落排序" },
  { path: "game", icon: "🎮", name: "綜合遊戲", desc: "用遊戲複習全部單元" },
];

export function GeptLevelNav({ level }: { level: Level }) {
  return (
    <>
      <nav aria-label="切換英檢級別" className="flex justify-center gap-2 mb-5">
        {LEVELS.map((l) => (
          <Link key={l.id} href={`/${l.id}`} aria-current={l.id === level ? "page" : undefined}
            className={`px-5 py-2 rounded-xl text-sm font-bold no-underline border ${
              l.id === level
                ? "bg-rose-500 border-rose-500 text-white"
                : "bg-white border-rose-200 text-rose-600 hover:bg-rose-50"
            }`}>
            {l.name}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {MODES.map((m) => (
          <Link key={m.path} href={`/${level}/${m.path}`}
            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover-lift no-underline">
            <span className="text-2xl shrink-0" aria-hidden="true">{m.icon}</span>
            <span className="min-w-0">
              <span className="block font-bold text-slate-800">{m.name}</span>
              <span className="block text-xs text-slate-500">{m.desc}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
