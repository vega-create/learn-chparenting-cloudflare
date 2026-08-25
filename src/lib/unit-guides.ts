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
const GUIDES_BY_LEVEL: Record<string, Record<number, GuideContent>> = {
  "elementary": GEPT_ELEMENTARY_GUIDES,
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
