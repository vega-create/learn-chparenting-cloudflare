/**
 * 一個單元怎麼練：四步驟流程說明。
 *
 * 以前這段文字放在每一個單元頁（194 頁一字不差），現在只放在各級別總覽頁一次，
 * 單元頁用一句話連回來。
 */
export function UnitStudyFlow({ language = "en" }: { language?: "en" | "ja" }) {
  const lang = language === "ja" ? "日文" : "英文";
  return (
    <section className="mt-6 p-6 bg-white rounded-2xl border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-2">一個單元怎麼練最有效</h2>
      <p className="text-slate-600 leading-relaxed mb-3">每個單元都有單字、文法、聽力、閱讀與測驗五個區塊，建議分成三到四次、每次 15 到 20 分鐘練完：</p>
      <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 p-0 m-0">
        <li>先把單字聽過一遍，跟著{lang}發音讀兩三次，熟悉聲音再看拼法。</li>
        <li>看文法說明，搭配例句理解什麼情境會這樣說。</li>
        <li>做聽力、閱讀與測驗三個練習區，把答錯的題目記下來。</li>
        <li>隔一天回頭重做錯題，再下載練習單在紙上寫一次，印象會深很多。</li>
      </ol>
    </section>
  );
}
