#!/usr/bin/env node
// Generates /public/llms.txt and /public/llms-full.txt at build time.
// llms.txt = short overview + table of contents (per llmstxt.org spec)
// llms-full.txt = same but with every blog post's full markdown body inlined
//                 (for AI tools doing RAG / direct quoting)
//
// Runs automatically before `next build` (see "prebuild" in package.json).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "src/content/blog");
const PUBLIC_DIR = path.join(ROOT, "public");
const SITE_URL = "https://learn.chparenting.com";

const TOOLS = [
  { path: "/elementary", name: "GEPT 初級全民英檢", desc: "國小高年級英檢初級備考題庫，含單字、文法、聽力、閱讀" },
  { path: "/elementary/mock-test", name: "GEPT 初級模擬考", desc: "全民英檢初級線上模擬測驗，自動計分" },
  { path: "/intermediate", name: "GEPT 中級全民英檢", desc: "國中以上英檢中級備考題庫" },
  { path: "/upper-intermediate", name: "GEPT 中高級全民英檢", desc: "高中以上英檢中高級備考題庫" },
  { path: "/jlpt-n5", name: "JLPT N5 日文檢定", desc: "日文五級入門，含五十音、單字、文法" },
  { path: "/jlpt-n4", name: "JLPT N4 日文檢定", desc: "日文四級備考題庫" },
  { path: "/jlpt-n3", name: "JLPT N3 日文檢定", desc: "日文三級備考題庫" },
  { path: "/jlpt-n2", name: "JLPT N2 日文檢定", desc: "日文二級備考題庫" },
  { path: "/jlpt-n1", name: "JLPT N1 日文檢定", desc: "日文一級備考題庫" },
  { path: "/math", name: "國小數學練習", desc: "分年級分難度的數學練習題（含 10 以內加減到分數小數）" },
  { path: "/chinese-lang", name: "國語學習", desc: "注音、國字書寫、閱讀理解練習" },
  { path: "/history-geo", name: "歷史地理", desc: "國中小社會科互動學習" },
  { path: "/music", name: "樂理基礎", desc: "兒童音樂理論啟蒙" },
  { path: "/finance", name: "兒童理財遊戲", desc: "三罐法、消費 vs 想要的金錢觀啟蒙遊戲" },
  { path: "/board-games", name: "教育桌遊", desc: "18 款適合親子共玩的學習桌遊" },
  { path: "/typing-game", name: "中英文打字練習", desc: "兒童打字練習工具，分難度" },
];

const SITE_INTRO = `Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文（全民英檢 GEPT 初級到中高級）、日文（JLPT N5-N1）、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。`;

function loadPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title || "",
        description: data.description || "",
        date: data.date || "",
        category: data.category || "",
        tags: data.tags || [],
        author: data.author || "Mommy Wisdom",
        faq: data.faq || [],
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateLlmsTxt(posts) {
  const lines = [];
  lines.push(`# Learn.chparenting.com 親子多元學習平台`);
  lines.push("");
  lines.push(`> ${SITE_INTRO}`);
  lines.push("");
  lines.push(
    `本站完全免費、不需註冊，由智慧媽咪國際有限公司（Mommy Wisdom International LTD.）營運。所有工具皆為原創設計，內容由台灣親子教育專家審核。`,
  );
  lines.push("");

  lines.push(`## 學習工具`);
  lines.push("");
  for (const t of TOOLS) {
    lines.push(`- [${t.name}](${SITE_URL}${t.path}): ${t.desc}`);
  }
  lines.push("");

  lines.push(`## 主要服務頁面`);
  lines.push("");
  lines.push(`- [家長陪伴指南](${SITE_URL}/parent-guide): 給家長的陪伴方法與 30 秒摘要`);
  lines.push(`- [GEPT 初級陪伴指南](${SITE_URL}/elementary/guide): 20 個單元的家長陪伴重點`);
  lines.push(`- [JLPT N5 陪伴指南](${SITE_URL}/jlpt-n5/guide): 日文 N5 家長陪伴重點`);
  lines.push(`- [使用說明](${SITE_URL}/how-to-use): 平台使用方式`);
  lines.push(`- [常見問題](${SITE_URL}/faq): FAQ`);
  lines.push(`- [關於我們](${SITE_URL}/about): 平台介紹`);
  lines.push("");

  if (posts.length > 0) {
    lines.push(`## 部落格文章 (${posts.length} 篇)`);
    lines.push("");
    for (const p of posts) {
      lines.push(`- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`);
    }
    lines.push("");
  }

  lines.push(`## 相關網站`);
  lines.push("");
  lines.push(`- [媽媽生活復原力 Lab (chparenting.com)](https://chparenting.com): 媽媽情緒、育兒挑戰、生活實用文章`);
  lines.push(`- [Adventure English 冒險英語 (english.chparenting.com)](https://english.chparenting.com): 兒童英文學習部落格`);
  lines.push(`- [亞洲媽媽創業 (mommystartup.com)](https://mommystartup.com): 媽媽創業、副業、AI 工具`);
  lines.push(`- [跟著媽咪團好康 (mommywisdom.tw)](https://mommywisdom.tw): 親子團購、優惠`);
  lines.push("");

  lines.push(`## 作者資訊`);
  lines.push("");
  lines.push(`- **Vega Lin（薇佳媽咪）** — 創辦人，台灣兩個孩子的媽媽，數位行銷工作者，東海大學數位創新研究所碩士生。`);
  lines.push(`- 8+ 年數位廣告經驗（Google Ads, Facebook Ads, SEO）。前英文老師，自學日文。`);
  lines.push(`- 自學寫程式，用 Next.js + Claude AI 打造這個免費學習平台。`);
  lines.push("");

  return lines.join("\n");
}

function generateLlmsFullTxt(posts) {
  const lines = [];
  lines.push(`# Learn.chparenting.com 親子多元學習平台 — 完整內容`);
  lines.push("");
  lines.push(`> ${SITE_INTRO}`);
  lines.push("");
  lines.push(`此檔案包含本站所有部落格文章的完整內容，供 AI 工具進行 RAG 與內容引用。`);
  lines.push("");
  lines.push(`---`);
  lines.push("");

  for (const p of posts) {
    lines.push(`# ${p.title}`);
    lines.push("");
    lines.push(`**網址**: ${SITE_URL}/blog/${p.slug}`);
    lines.push(`**發布日期**: ${p.date}`);
    lines.push(`**分類**: ${p.category}`);
    lines.push(`**標籤**: ${(p.tags || []).join(", ")}`);
    lines.push(`**作者**: ${p.author}`);
    lines.push("");
    lines.push(`**摘要**: ${p.description}`);
    lines.push("");
    lines.push(p.content);
    if (p.faq && p.faq.length > 0) {
      lines.push("");
      lines.push(`## 常見問題 FAQ`);
      lines.push("");
      for (const f of p.faq) {
        lines.push(`**Q: ${f.q}**`);
        lines.push("");
        lines.push(`A: ${f.a}`);
        lines.push("");
      }
    }
    lines.push(`---`);
    lines.push("");
  }

  return lines.join("\n");
}

const posts = loadPosts();
fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), generateLlmsTxt(posts), "utf-8");
fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), generateLlmsFullTxt(posts), "utf-8");

console.log(`✅ Generated /public/llms.txt (${posts.length} blog posts indexed)`);
console.log(`✅ Generated /public/llms-full.txt (full content for AI RAG)`);
