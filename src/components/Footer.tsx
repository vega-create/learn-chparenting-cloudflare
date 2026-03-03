export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12 hidden md:block">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm">
          {/* 英檢 */}
          <div>
            <h4 className="font-bold text-slate-700 mb-2">📘 全民英檢</h4>
            <div className="flex flex-col gap-1.5">
              <a href="/elementary" className="text-slate-500 hover:text-rose-400 transition">初級 Elementary</a>
              <a href="/intermediate" className="text-slate-500 hover:text-rose-400 transition">中級 Intermediate</a>
              <a href="/upper-intermediate" className="text-slate-500 hover:text-rose-400 transition">中高級 Upper-Int.</a>
            </div>
          </div>
          {/* 日文 */}
          <div>
            <h4 className="font-bold text-slate-700 mb-2">🇯🇵 日文檢定</h4>
            <div className="flex flex-col gap-1.5">
              <a href="/jlpt-n5" className="text-slate-500 hover:text-red-500 transition">JLPT N5</a>
              <a href="/jlpt-n4" className="text-slate-500 hover:text-red-500 transition">JLPT N4</a>
              <a href="/jlpt-n3" className="text-slate-500 hover:text-red-500 transition">JLPT N3</a>
              <a href="/jlpt-n2" className="text-slate-500 hover:text-red-500 transition">JLPT N2</a>
              <a href="/jlpt-n1" className="text-slate-500 hover:text-red-500 transition">JLPT N1</a>
            </div>
          </div>
          {/* 更多工具 */}
          <div>
            <h4 className="font-bold text-slate-700 mb-2">🎯 更多工具</h4>
            <div className="flex flex-col gap-1.5">
              <a href="/chinese-lang" className="text-slate-500 hover:text-orange-500 transition">📝 國語學習</a>
              <a href="/history-geo" className="text-slate-500 hover:text-emerald-500 transition">🌏 歷史地理</a>
              <a href="/board-games" className="text-slate-500 hover:text-orange-500 transition">🎲 教育桌遊</a>
              <a href="/math" className="text-slate-500 hover:text-amber-500 transition">🔢 數學練習</a>
              <a href="/typing-game" className="text-slate-500 hover:text-emerald-500 transition">⌨️ 打字練習</a>
              <a href="/finance" className="text-slate-500 hover:text-purple-500 transition">💰 兒童理財</a>
            </div>
          </div>
          {/* 網站資訊 */}
          <div>
            <h4 className="font-bold text-slate-700 mb-2">ℹ️ 網站資訊</h4>
            <div className="flex flex-col gap-1.5">
              <a href="/how-to-use" className="text-slate-500 hover:text-rose-400 transition">使用說明</a>
              <a href="/faq" className="text-slate-500 hover:text-rose-400 transition">常見問題</a>
              <a href="/about" className="text-slate-500 hover:text-rose-400 transition">關於我們</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-4 text-center">
          <p className="text-sm text-slate-400">
            © 2026 親子多元學習平台 — 由{" "}
            <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline">
              智慧媽咪國際有限公司 Mommy Wisdom International LTD.
            </a>{" "}
            製作
          </p>
          <p className="text-xs text-slate-400 mt-1">本站為免費學習資源平台，所有內容皆可免費使用</p>
        </div>
      </div>
    </footer>
  );
}
