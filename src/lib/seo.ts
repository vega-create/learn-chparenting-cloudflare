import { Metadata } from "next";

/**
 * Shared robots directives.
 *
 * NOINDEX_FOLLOW is for pages that exist for people already using the site but
 * have nothing to offer a searcher: the per-unit 答案 pages (whose content sits
 * behind a "我是家長" click, so Googlebot only ever sees an empty shell) and the
 * per-unit 家長陪伴指南 pages (~300 characters of real text each).
 *
 * Google had been crawling all ~50 of them and filing every one under
 * 「已檢索 - 目前尚未建立索引」. Keeping thin pages in the indexable set drags down
 * how Google judges the site as a whole and burns crawl budget that the unit
 * and blog pages need. `follow` stays on so link equity still flows through to
 * the practice pages these link to.
 */
export const NOINDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
};
