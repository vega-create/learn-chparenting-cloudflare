import type { GuideContent } from "@/components/ParentGuide";
import { GEPT_ELEMENTARY_GUIDES } from "@/data/guides/gept-elementary-guides";
import { GEPT_INTERMEDIATE_GUIDES } from "@/data/guides/gept-intermediate-guides";
import { GEPT_UPPER_INTERMEDIATE_GUIDES } from "@/data/guides/gept-upper-intermediate-guides";
import { JLPT_N5_GUIDES } from "@/data/guides/jlpt-n5-guides";
import { JLPT_N4_GUIDES } from "@/data/guides/jlpt-n4-guides";
import { JLPT_N3_GUIDES } from "@/data/guides/jlpt-n3-guides";
import { JLPT_N2_GUIDES } from "@/data/guides/jlpt-n2-guides";
import { JLPT_N1_GUIDES } from "@/data/guides/jlpt-n1-guides";

/**
 * Guide content keyed by level slug, so a unit page can reach its own teaching
 * notes from `level.slug` alone.
 *
 * These notes are the only genuinely hand-written prose we have per unit —
 * things like "environment 這個字又長又難唸，可以拆音節練習：en-vi-ron-ment" that
 * come from actually teaching this material. Everything else UnitSEOContent
 * renders is generated from the unit's vocab/grammar counts, so it follows an
 * identical sentence skeleton across all 194 units.
 *
 * Until now this content only appeared on /[level]/guide/[unitId], which is
 * noindex (too thin to stand alone as a page). Surfacing it on the unit page
 * puts it where it has something to support.
 */
/**
 * GEPT 初級的 guide 資料是照一套較舊的單元表寫的，鍵值與現行 UNITS 對不起來：
 * 例如 guide 3 的主題是「數字 1-100」，但 unit 3 是「食物與飲料」（其 guide 在
 * 鍵值 6）。20 個單元中有 16 個錯位，會讓單元頁顯示別的單元的陪伴說明。
 *
 * 這不是單純的順序位移——兩份清單的主題本來就不同：舊表有「顏色」「總複習」
 * 等現行單元表沒有的主題，現行單元表也有 5 個單元（15 旅遊住宿、16 居家生活、
 * 18 電話網路、19 情緒表達、20 社區公共場所）在舊表裡沒有對應內容，因此無法
 * 機械式重排。
 *
 * 下表前 15 組是逐筆比對主題、並以「guide 文字提到的單字確實出現在該單元
 * 單字表中」驗證過的對應（鍵＝現行 unit id，值＝guide 資料的鍵）。
 *
 * 其餘 5 個單元（15 旅遊住宿、16 居家生活、18 電話網路、19 情緒表達、
 * 20 社區公共場所）在舊表裡沒有對應主題，已依各單元實際的單字表與文法項目
 * 補寫，存在資料檔的鍵值 21-25。
 *
 * 未被使用的舊 guide 條目（鍵 5 顏色、8 日常動作、9 身體部位、12 地點方位、
 * 20 總複習）仍保留在資料檔中，不對應現行任何單元。
 */
const ELEMENTARY_UNIT_TO_GUIDE_KEY: Record<number, number> = {
  1: 1, 2: 2, 3: 6, 4: 18, 5: 4, 6: 11, 7: 15, 8: 14,
  9: 3, 10: 19, 11: 16, 12: 7, 13: 10, 14: 17, 17: 13,
  // 舊表沒有對應主題的 5 個單元，內容為現行單元表補寫（資料檔鍵值 21-25）
  15: 21, 16: 22, 18: 23, 19: 24, 20: 25,
};

const ELEMENTARY_GUIDES_BY_UNIT: Record<number, GuideContent> = Object.fromEntries(
  Object.entries(ELEMENTARY_UNIT_TO_GUIDE_KEY)
    .map(([unitId, guideKey]) => [Number(unitId), GEPT_ELEMENTARY_GUIDES[guideKey]])
    .filter(([, guide]) => guide),
);

const GUIDES_BY_LEVEL: Record<string, Record<number, GuideContent>> = {
  "elementary": ELEMENTARY_GUIDES_BY_UNIT,
  "intermediate": GEPT_INTERMEDIATE_GUIDES,
  "upper-intermediate": GEPT_UPPER_INTERMEDIATE_GUIDES,
  "jlpt-n5": JLPT_N5_GUIDES,
  "jlpt-n4": JLPT_N4_GUIDES,
  "jlpt-n3": JLPT_N3_GUIDES,
  "jlpt-n2": JLPT_N2_GUIDES,
  "jlpt-n1": JLPT_N1_GUIDES,
};

export function getUnitGuide(levelSlug: string, unitId: number): GuideContent | undefined {
  return GUIDES_BY_LEVEL[levelSlug]?.[unitId];
}
