// 產生部落格文章首圖（1200×630 PNG，同時用於頁面 hero 與 og:image）
// 用法：node scripts/generate-blog-covers.mjs [slug ...]（不帶參數 = 全部文章）
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const OUT_DIR = path.join(ROOT, 'public/images/blog');

const THEMES = {
  '英檢攻略': { from: '#2563eb', to: '#1e3a8a', emoji: '📘' },
  '日檢攻略': { from: '#7c3aed', to: '#4c1d95', emoji: '🎌' },
  '日文學習': { from: '#8b5cf6', to: '#5b21b6', emoji: '🗻' },
  '英文學習': { from: '#0ea5e9', to: '#075985', emoji: '🔤' },
  '語言學習': { from: '#4f46e5', to: '#312e81', emoji: '💬' },
  '國語學習': { from: '#ea580c', to: '#7c2d12', emoji: '📖' },
  '數學學習': { from: '#0891b2', to: '#164e63', emoji: '🔢' },
  '程式設計': { from: '#16a34a', to: '#14532d', emoji: '💻' },
  '邏輯思維': { from: '#9333ea', to: '#581c87', emoji: '🧩' },
  '音樂學習': { from: '#f43f5e', to: '#881337', emoji: '🎵' },
  '升學銜接': { from: '#64748b', to: '#1e293b', emoji: '🎒' },
  '親子教養': { from: '#e11d48', to: '#881337', emoji: '🌱' },
  '親子教育': { from: '#db2777', to: '#831843', emoji: '🌱' },
  '學習技巧': { from: '#f59e0b', to: '#92400e', emoji: '💡' },
  '學習工具': { from: '#0d9488', to: '#134e4a', emoji: '⌨' },
};
const DEFAULT_THEME = { from: '#475569', to: '#0f172a', emoji: '📚' };

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// CJK 字寬約等於 font-size，半形字約 0.55 倍
const charWidth = (ch) => (/[⺀-鿿豈-﫿＀-￯　-〿]/.test(ch) ? 1 : 0.55);

const OPENING = '【「（《“‘';
const CLOSING = '】」）》”’？！。，：；、・';

function wrapTitle(title, maxUnits) {
  // 英數字串不拆開，其餘逐字
  const tokens = title.match(/[A-Za-z0-9]+|./gsu) || [];
  const tokenWidth = (t) => [...t].reduce((s, ch) => s + charWidth(ch), 0);

  const lines = [];
  let line = '';
  let units = 0;
  for (const token of tokens) {
    const w = tokenWidth(token);
    if (units + w > maxUnits && line && !CLOSING.includes(token)) {
      lines.push(line);
      line = '';
      units = 0;
      if (token === ' ') continue;
    }
    line += token;
    units += w;
  }
  if (line) lines.push(line);

  // 行尾不留開括號：移到下一行
  for (let i = 0; i < lines.length - 1; i++) {
    const last = lines[i].slice(-1);
    if (OPENING.includes(last)) {
      lines[i] = lines[i].slice(0, -1).trimEnd();
      lines[i + 1] = last + lines[i + 1];
    }
  }
  return lines.filter(Boolean);
}

function buildSvg(title, category) {
  const theme = THEMES[category] || DEFAULT_THEME;
  const W = 1200, H = 630, PAD = 70;
  const textWidth = W - PAD * 2 - 60; // 右側留空間給水印

  // 從大到小試字級，標題最多 3 行
  let fontSize = 62, lines = [];
  for (const size of [62, 54, 46, 40]) {
    fontSize = size;
    lines = wrapTitle(title, Math.floor(textWidth / size / 0.98));
    if (lines.length <= 3) break;
  }
  const lineHeight = Math.round(fontSize * 1.45);
  const blockHeight = lines.length * lineHeight;
  const firstBaseline = Math.round(H / 2 - blockHeight / 2 + fontSize * 0.9);

  const titleText = lines
    .map((l, i) => `<text x="${PAD}" y="${firstBaseline + i * lineHeight}" font-family="PingFang TC, Heiti TC, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff">${escapeXml(l)}</text>`)
    .join('\n  ');

  const catWidth = Math.round(category.length * 30 + 48);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1080" cy="80" r="220" fill="#ffffff" fill-opacity="0.06"/>
  <circle cx="150" cy="600" r="260" fill="#ffffff" fill-opacity="0.05"/>
  <circle cx="1150" cy="560" r="120" fill="#ffffff" fill-opacity="0.07"/>
  <text x="1010" y="600" font-size="300" fill="#ffffff" fill-opacity="0.14" text-anchor="middle">${theme.emoji}</text>
  <rect x="${PAD}" y="72" width="${catWidth}" height="52" rx="26" fill="#ffffff" fill-opacity="0.18"/>
  <text x="${PAD + catWidth / 2}" y="108" font-family="PingFang TC, Heiti TC, sans-serif" font-size="28" font-weight="600" fill="#ffffff" text-anchor="middle">${escapeXml(category)}</text>
  ${titleText}
  <rect x="${PAD}" y="${H - 96}" width="56" height="5" rx="2.5" fill="#fbbf24"/>
  <text x="${PAD}" y="${H - 52}" font-family="PingFang TC, Heiti TC, sans-serif" font-size="26" fill="#ffffff" fill-opacity="0.85">親子多元學習平台 · learn.chparenting.com</text>
</svg>`;
}

const args = process.argv.slice(2);
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'))
  .filter(f => args.length === 0 || args.includes(f.replace(/\.md$/, '')));

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8'));
  const svg = buildSvg(data.title || slug, data.category || '');
  const out = path.join(OUT_DIR, `${slug}.png`);
  await sharp(Buffer.from(svg)).png({ palette: true, quality: 90 }).toFile(out);
  console.log(`✓ ${slug}.png (${Math.round(fs.statSync(out).size / 1024)} KB)`);
}
console.log(`\n${files.length} 張首圖已輸出到 public/images/blog/`);
