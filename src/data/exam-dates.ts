/**
 * 英檢、日檢的考試日期，給題庫頁倒數與首頁跑馬燈共用。
 * 新年度日程公布後補進來；過期的日期會自動略過。
 *
 * 來源（2026-10-29 核對）：
 * - 全民英檢聽讀：gept.org.tw 測驗日程
 * - 日檢 JLPT（台灣）：jlpt.tw 報名須知（2027 第 2 回尚未公布）
 */
export const EXAM_DATES = {
  geptElementary: ["2026-11-07", "2027-01-09", "2027-06-13", "2027-10-30"],
  geptIntermediate: ["2026-10-31", "2027-01-30", "2027-05-08", "2027-08-14", "2027-11-06"],
  jlpt: ["2026-12-06", "2027-07-04"],
};

const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"];

/** 今天（台灣時間），YYYY-MM-DD */
export function todayInTaiwan() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

/** 下一場考試與剩幾天；全部過期回傳 null。要在瀏覽器端呼叫，日期才不會停在 build 那天。 */
export function nextExam(dates: string[]) {
  const today = todayInTaiwan();
  const date = dates.find((d) => d >= today);
  if (!date) return null;
  return { date, days: Math.round((Date.parse(date) - Date.parse(today)) / 86400000) };
}

/** 2026-11-07 → 11/7（六）；withYear 時加年份 */
export function formatExamDate(iso: string, withYear = false) {
  const [y, m, d] = iso.split("-").map(Number);
  const w = WEEKDAY[new Date(y, m - 1, d).getDay()];
  return `${withYear ? `${y}/` : ""}${m}/${d}（${w}）`;
}
