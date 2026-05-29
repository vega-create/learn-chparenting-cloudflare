/**
 * 家長陪伴指南 ebook PDF 批量產生腳本
 * 先執行 npx tsx scripts/extract-guides.ts 抽取資料
 * 再執行 node scripts/generate-ebooks.mjs 產生 PDF
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── 中文字體 ───
const FONT_PATHS = [
  path.join(__dirname, 'NotoSansSC.ttf'),
  '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttf',
];

function getFont() {
  for (const p of FONT_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  console.error('❌ 找不到中文字體！請確保 scripts/NotoSansSC.ttf 存在');
  process.exit(1);
}

const FONT = getFont();
console.log(`📝 使用字體: ${FONT}`);

// ─── 頁面設定 ───
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CW = PAGE_W - MARGIN * 2; // content width

// ─── 顏色 ───
const INDIGO = '#4f46e5';
const DARK = '#1e293b';
const GRAY = '#64748b';
const LIGHT_BG = '#f1f5f9';
const BORDER = '#e2e8f0';
const GREEN = '#059669';
const AMBER = '#d97706';

// ─── 載入資料 ───
const dataPath = path.join(__dirname, 'guides-data.json');
if (!fs.existsSync(dataPath)) {
  console.error('❌ 找不到 guides-data.json，請先執行 npx tsx scripts/extract-guides.ts');
  process.exit(1);
}
const allData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// ─── 輸出目錄 ───
const outDir = path.join(ROOT, 'public', 'ebooks');
fs.mkdirSync(outDir, { recursive: true });

// ─── Helper: 確保空間夠，不夠就換頁 ───
function ensureSpace(doc, needed) {
  if (doc.y + needed > PAGE_H - MARGIN - 20) {
    doc.addPage();
    doc.y = MARGIN;
  }
}

// ─── Helper: 畫圓角矩形背景 ───
function roundedRect(doc, x, y, w, h, r, color) {
  doc.save();
  doc.roundedRect(x, y, w, h, r).fill(color);
  doc.restore();
}

// ─── 產生封面頁 ───
function drawCover(doc, bookName) {
  // 背景漸層效果（用矩形模擬）
  roundedRect(doc, 0, 0, PAGE_W, PAGE_H, 0, '#eef2ff');
  roundedRect(doc, 0, PAGE_H * 0.7, PAGE_W, PAGE_H * 0.3, 0, '#e0e7ff');

  // 裝飾圖示：用 PDFKit 繪圖原語畫三個漸層圓點（取代 emoji，因為 NotoSansSC
  // 字體不包含 ZWJ 組合 emoji 如 👩‍👧‍👦，會顯示成 5 個方框）
  const centerY = PAGE_H * 0.25;
  const centerX = PAGE_W / 2;
  const dotR = 22;
  const gap = 14;
  // 大圓（媽媽）
  doc.save();
  doc.circle(centerX - dotR - gap, centerY, dotR).fill('#6366f1');
  // 中圓（孩子 1）
  doc.circle(centerX, centerY + 4, dotR - 4).fill('#a78bfa');
  // 小圓（孩子 2）
  doc.circle(centerX + dotR + gap, centerY + 8, dotR - 8).fill('#c4b5fd');
  doc.restore();

  // 書名
  doc.fontSize(28).fillColor(INDIGO);
  doc.text(bookName, MARGIN + 20, PAGE_H * 0.35, { align: 'center', width: CW - 40 });

  // 副標題
  doc.fontSize(14).fillColor(GRAY);
  doc.text('30 秒看完就知道今天陪什麼、怎麼陪、要多久', MARGIN + 20, doc.y + 16, { align: 'center', width: CW - 40 });

  // 品牌
  doc.fontSize(12).fillColor(GRAY);
  doc.text('learn.chparenting.com', MARGIN, PAGE_H - MARGIN - 60, { align: 'center', width: CW });

  doc.fontSize(11).fillColor(INDIGO);
  doc.text('AI 是大人的翅膀，卻只是孩子的起點', MARGIN, doc.y + 8, { align: 'center', width: CW });
  doc.text('孩子才是最強 AI', MARGIN, doc.y + 4, { align: 'center', width: CW });
}

// ─── 產生目錄頁 ───
function drawTOC(doc, units) {
  doc.addPage();
  doc.font(FONT).fontSize(22).fillColor(DARK);
  doc.text('目錄', MARGIN, MARGIN);
  doc.moveDown(0.8);

  for (const u of units) {
    if (!u.guide) continue;
    ensureSpace(doc, 22);
    doc.fontSize(11).fillColor(DARK);
    doc.text(`第 ${u.id} 單元：${u.title}`, MARGIN + 10, doc.y, { continued: true, width: CW - 80 });
    doc.fillColor(GRAY).text(`  ${u.guide.estimatedTime}`, { align: 'right' });
    doc.moveDown(0.3);
  }
}

// ─── 產生單元指南頁 ───
function drawUnitGuide(doc, unit) {
  doc.addPage();
  const g = unit.guide;
  let y = MARGIN;

  // ── 標題 ──
  doc.font(FONT).fontSize(10).fillColor(GRAY);
  doc.text(`第 ${unit.id} 單元`, MARGIN, y);
  y = doc.y + 4;

  doc.fontSize(18).fillColor(DARK);
  doc.text(unit.title, MARGIN, y);
  y = doc.y + 12;

  // ── 主題 + 時間 + 目標 ──
  roundedRect(doc, MARGIN, y, CW, 65, 8, LIGHT_BG);
  doc.fontSize(11).fillColor(INDIGO);
  doc.text(`📌 今日主題：${g.todayTopic}`, MARGIN + 12, y + 10, { width: CW - 24 });
  doc.fontSize(10).fillColor(GRAY);
  doc.text(`⏱️ 預估時間：${g.estimatedTime}          🎯 目標：${g.learningGoal}`, MARGIN + 12, doc.y + 4, { width: CW - 24 });
  y = y + 65 + 14;

  // ── 陪伴方法 ──
  ensureSpace(doc, 100);
  doc.fontSize(13).fillColor(DARK);
  doc.text('💡 陪伴方法', MARGIN, y);
  y = doc.y + 8;

  const lines = g.guidanceText.split('\n');
  doc.fontSize(10.5).fillColor('#334155');
  for (const line of lines) {
    ensureSpace(doc, 18);
    doc.text(line.trim(), MARGIN + 8, doc.y, { width: CW - 16, lineGap: 3 });
  }
  y = doc.y + 16;

  // ── 過關清單 ──
  ensureSpace(doc, 90);
  doc.fontSize(13).fillColor(DARK);
  doc.text('✅ 過關清單', MARGIN, y);
  y = doc.y + 8;

  roundedRect(doc, MARGIN, y, CW, g.passChecklist.length * 22 + 16, 8, '#f0fdf4');
  doc.fontSize(10.5).fillColor(GREEN);
  for (let i = 0; i < g.passChecklist.length; i++) {
    doc.text(`☑ ${g.passChecklist[i]}`, MARGIN + 12, y + 10 + i * 22, { width: CW - 24 });
  }
  y = y + g.passChecklist.length * 22 + 16 + 14;

  // ── 常見問題 ──
  ensureSpace(doc, 70);
  doc.fontSize(13).fillColor(DARK);
  doc.text('⚠️ 常見問題', MARGIN, y);
  y = doc.y + 8;

  roundedRect(doc, MARGIN, y, CW, 50, 8, '#fffbeb');
  doc.fontSize(10.5).fillColor(AMBER);
  doc.text(g.commonIssues, MARGIN + 12, y + 10, { width: CW - 24, lineGap: 3 });
}

// ─── 產生結尾頁 ───
function drawEnding(doc) {
  doc.addPage();
  roundedRect(doc, 0, 0, PAGE_W, PAGE_H, 0, '#eef2ff');

  // 結尾頁裝飾：畫一個五角星（取代 🎉 emoji）
  doc.save();
  const sx = PAGE_W / 2;
  const sy = PAGE_H * 0.3;
  const sr = 32;
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? sr : sr * 0.42;
    points.push([sx + r * Math.cos(angle), sy + r * Math.sin(angle)]);
  }
  doc.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) doc.lineTo(points[i][0], points[i][1]);
  doc.closePath().fill('#f59e0b');
  doc.restore();

  doc.font(FONT).fontSize(20).fillColor(INDIGO);
  doc.text('指南到這裡結束了！', MARGIN, sy + sr + 24, { align: 'center', width: CW });

  doc.fontSize(13).fillColor(GRAY);
  doc.text('現在就去網站上陪孩子練習吧', MARGIN, doc.y + 16, { align: 'center', width: CW });

  doc.fontSize(14).fillColor(INDIGO);
  doc.text('learn.chparenting.com', MARGIN, doc.y + 24, { align: 'center', width: CW, link: 'https://learn.chparenting.com' });

  doc.fontSize(12).fillColor(GRAY);
  doc.text('\n\nAI 是大人的翅膀，卻只是孩子的起點\n孩子才是最強 AI', MARGIN, doc.y + 40, { align: 'center', width: CW });
}

// ─── 主流程 ───
let totalFiles = 0;
for (const [slug, book] of Object.entries(allData)) {
  const units = book.units.filter(u => u.guide);
  if (units.length === 0) {
    console.log(`⚠️  ${slug}: 沒有指南資料，跳過`);
    continue;
  }

  const outFile = path.join(outDir, `${slug}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
  const stream = fs.createWriteStream(outFile);
  doc.pipe(stream);

  // 封面
  drawCover(doc, book.bookName);

  // 目錄
  drawTOC(doc, units);

  // 各單元指南
  for (const unit of units) {
    drawUnitGuide(doc, unit);
  }

  // 結尾
  drawEnding(doc);

  // 頁尾（除了封面）
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 1; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.font(FONT).fontSize(8).fillColor('#94a3b8');
    doc.text(
      `${book.bookName}  ·  第 ${i} 頁`,
      MARGIN, PAGE_H - MARGIN + 10,
      { align: 'center', width: CW }
    );
  }

  doc.end();
  await new Promise(resolve => stream.on('finish', resolve));

  const size = (fs.statSync(outFile).size / 1024).toFixed(0);
  console.log(`✅ ${slug}.pdf (${units.length} units, ${size} KB)`);
  totalFiles++;
}

console.log(`\n🎉 完成！產生了 ${totalFiles} 本 ebook PDF → public/ebooks/`);
