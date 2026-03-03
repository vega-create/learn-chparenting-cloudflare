/**
 * 練習單 PDF 批量產生腳本
 * 先執行 npx tsx scripts/extract-data.ts 抽取資料
 * 再執行 node scripts/generate-worksheets.mjs 產生 PDF
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── 中文字體設定 ───
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

const CHINESE_FONT = getFont();
console.log(`📝 使用字體: ${CHINESE_FONT}`);

// ─── 頁面設定 ───
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── 顏色 ───
const BLUE = '#2563eb';
const GRAY = '#64748b';
const LIGHT_GRAY = '#e2e8f0';
const DARK = '#1e293b';

function padUnit(id) {
  return `unit-${String(id).padStart(2, '0')}`;
}

function drawHeader(doc, unitTitle, level, unitNum) {
  doc.font(CHINESE_FONT).fontSize(10).fillColor(GRAY);
  doc.text('learn.chparenting.com', MARGIN, MARGIN, { align: 'left' });
  doc.fontSize(9).fillColor(GRAY);
  doc.text(`${level} · Unit ${unitNum}`, MARGIN, MARGIN, { align: 'right', width: CONTENT_W });
  doc.moveTo(MARGIN, MARGIN + 18).lineTo(PAGE_W - MARGIN, MARGIN + 18).strokeColor(LIGHT_GRAY).lineWidth(1).stroke();
  doc.font(CHINESE_FONT).fontSize(18).fillColor(DARK);
  doc.text(unitTitle, MARGIN, MARGIN + 28, { align: 'center', width: CONTENT_W });
  doc.fontSize(10).fillColor(BLUE);
  doc.text('Practice Worksheet', MARGIN, MARGIN + 52, { align: 'center', width: CONTENT_W });
  return MARGIN + 75;
}

function drawFooter(doc) {
  doc.font(CHINESE_FONT).fontSize(8).fillColor(GRAY);
  doc.text('answers & more practice → learn.chparenting.com', MARGIN, PAGE_H - 35, { align: 'center', width: CONTENT_W });
}

function drawSectionTitle(doc, y, title) {
  doc.font(CHINESE_FONT).fontSize(12).fillColor(BLUE);
  doc.text(title, MARGIN, y);
  doc.moveTo(MARGIN, y + 18).lineTo(PAGE_W - MARGIN, y + 18).strokeColor(LIGHT_GRAY).lineWidth(0.5).stroke();
  return y + 26;
}

function checkNewPage(doc, y, needed) {
  if (y + needed > PAGE_H - 60) {
    drawFooter(doc);
    doc.addPage();
    return MARGIN + 20;
  }
  return y;
}

// ─── GEPT 練習單 ───
function generateGeptWorksheet(doc, unit, levelLabel) {
  let y = drawHeader(doc, unit.title, levelLabel, unit.id);

  // 1. 單字填空
  y = drawSectionTitle(doc, y, 'A. Vocabulary - Write the English word');
  doc.font(CHINESE_FONT).fontSize(9).fillColor(GRAY);
  doc.text('Write the correct English word for each Chinese meaning.', MARGIN, y);
  y += 16;

  const vocabItems = unit.vocab.slice(0, 15);
  for (let i = 0; i < vocabItems.length; i++) {
    const v = vocabItems[i];
    y = checkNewPage(doc, y, 26);
    doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
    doc.text(`${i + 1}. ${v.zh} (${v.pos})`, MARGIN, y, { width: 200 });
    const lineX = MARGIN + 210;
    doc.moveTo(lineX, y + 13).lineTo(lineX + 200, y + 13).strokeColor(LIGHT_GRAY).lineWidth(0.8).stroke();
    y += 26;
  }

  // 2. 文法選擇
  y = checkNewPage(doc, y, 50);
  y += 8;
  y = drawSectionTitle(doc, y, 'B. Grammar - Choose the correct answer');

  const quizItems = unit.quiz.slice(0, 10);
  for (let i = 0; i < quizItems.length; i++) {
    const q = quizItems[i];
    y = checkNewPage(doc, y, 48);
    doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
    doc.text(`${i + 1}. ${q.s}`, MARGIN, y, { width: CONTENT_W });
    y += 16;

    const optW = CONTENT_W / 2 - 10;
    for (let oi = 0; oi < q.opts.length; oi++) {
      const col = oi % 2;
      const row = Math.floor(oi / 2);
      doc.font(CHINESE_FONT).fontSize(9.5).fillColor(GRAY);
      doc.text(`(${String.fromCharCode(65 + oi)}) ${q.opts[oi]}`, MARGIN + 15 + col * (optW + 10), y + row * 15, { width: optW });
    }
    y += Math.ceil(q.opts.length / 2) * 15 + 8;
  }

  // 3. 聽力
  y = checkNewPage(doc, y, 50);
  y += 8;
  y = drawSectionTitle(doc, y, 'C. Listening - Go to learn.chparenting.com to listen');

  const listenItems = unit.listening.slice(0, 5);
  for (let i = 0; i < listenItems.length; i++) {
    const q = listenItems[i];
    y = checkNewPage(doc, y, 45);
    doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
    doc.text(`${i + 1}. ${q.zh}`, MARGIN, y, { width: CONTENT_W });
    y += 16;

    for (let oi = 0; oi < q.opts.length; oi++) {
      doc.font(CHINESE_FONT).fontSize(9.5).fillColor(GRAY);
      doc.text(`(${String.fromCharCode(65 + oi)}) ${q.opts[oi]}`, MARGIN + 15, y, { width: CONTENT_W - 20 });
      y += 14;
    }
    y += 6;
  }

  // 4. 閱讀理解
  const readings = unit.reading || [];
  if (readings.length > 0 && readings[0].questions && readings[0].questions.length > 0) {
    y = checkNewPage(doc, y, 50);
    y += 8;
    y = drawSectionTitle(doc, y, 'D. Reading - Go to learn.chparenting.com to read the passage');

    const reading = readings[0];
    const readingQs = reading.questions.slice(0, 5);
    for (let i = 0; i < readingQs.length; i++) {
      const q = readingQs[i];
      y = checkNewPage(doc, y, 50);
      doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
      doc.text(`${i + 1}. ${q.q}`, MARGIN, y, { width: CONTENT_W });
      y += 16;

      for (let oi = 0; oi < q.opts.length; oi++) {
        y = checkNewPage(doc, y, 15);
        doc.font(CHINESE_FONT).fontSize(9.5).fillColor(GRAY);
        doc.text(`(${String.fromCharCode(65 + oi)}) ${q.opts[oi]}`, MARGIN + 15, y, { width: CONTENT_W - 20 });
        y += 14;
      }
      y += 6;
    }
  }

  drawFooter(doc);
}

// ─── JLPT 練習單 ───
function generateJlptWorksheet(doc, unit, levelLabel) {
  const titleText = unit.titleJa ? `${unit.title}（${unit.titleJa}）` : unit.title;
  let y = drawHeader(doc, titleText, levelLabel, unit.id);

  // 1. 單字
  y = drawSectionTitle(doc, y, 'A. Vocabulary - Write the Japanese word');
  doc.font(CHINESE_FONT).fontSize(9).fillColor(GRAY);
  doc.text('Write the correct Japanese word (hiragana/katakana/kanji).', MARGIN, y);
  y += 16;

  const vocabItems = unit.vocab.slice(0, 15);
  for (let i = 0; i < vocabItems.length; i++) {
    const v = vocabItems[i];
    y = checkNewPage(doc, y, 26);
    doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
    doc.text(`${i + 1}. ${v.zh}`, MARGIN, y, { width: 200 });
    const lineX = MARGIN + 210;
    doc.moveTo(lineX, y + 13).lineTo(lineX + 200, y + 13).strokeColor(LIGHT_GRAY).lineWidth(0.8).stroke();
    y += 26;
  }

  // 2. 文法選擇
  y = checkNewPage(doc, y, 50);
  y += 8;
  y = drawSectionTitle(doc, y, 'B. Grammar - Choose the correct answer');

  const quizItems = unit.quiz.slice(0, 10);
  for (let i = 0; i < quizItems.length; i++) {
    const q = quizItems[i];
    y = checkNewPage(doc, y, 48);
    doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
    doc.text(`${i + 1}. ${q.s}`, MARGIN, y, { width: CONTENT_W });
    y += 16;

    const optW = CONTENT_W / 2 - 10;
    for (let oi = 0; oi < q.opts.length; oi++) {
      const col = oi % 2;
      const row = Math.floor(oi / 2);
      doc.font(CHINESE_FONT).fontSize(9.5).fillColor(GRAY);
      doc.text(`(${String.fromCharCode(65 + oi)}) ${q.opts[oi]}`, MARGIN + 15 + col * (optW + 10), y + row * 15, { width: optW });
    }
    y += Math.ceil(q.opts.length / 2) * 15 + 8;
  }

  // 3. 聽力
  y = checkNewPage(doc, y, 50);
  y += 8;
  y = drawSectionTitle(doc, y, 'C. Listening - Go to learn.chparenting.com to listen');

  const listenItems = unit.listening.slice(0, 5);
  for (let i = 0; i < listenItems.length; i++) {
    const q = listenItems[i];
    y = checkNewPage(doc, y, 45);
    doc.font(CHINESE_FONT).fontSize(10).fillColor(DARK);
    doc.text(`${i + 1}. ${q.zh}`, MARGIN, y, { width: CONTENT_W });
    y += 16;

    for (let oi = 0; oi < q.opts.length; oi++) {
      doc.font(CHINESE_FONT).fontSize(9.5).fillColor(GRAY);
      doc.text(`(${String.fromCharCode(65 + oi)}) ${q.opts[oi]}`, MARGIN + 15, y, { width: CONTENT_W - 20 });
      y += 14;
    }
    y += 6;
  }

  drawFooter(doc);
}

// ─── 主程式 ───
async function main() {
  const dataPath = path.join(__dirname, 'all-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('❌ 請先執行 npx tsx scripts/extract-data.ts');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let totalCount = 0;

  // ── GEPT ──
  const geptLevels = [
    { slug: 'elementary', label: 'GEPT Elementary' },
    { slug: 'intermediate', label: 'GEPT Intermediate' },
    { slug: 'upper-intermediate', label: 'GEPT Upper-Int.' },
  ];

  for (const level of geptLevels) {
    const units = data.gept[level.slug];
    if (!units || units.length === 0) { console.log(`⚠️ No data for ${level.label}`); continue; }
    console.log(`\n── ${level.label} (${units.length} units) ──`);

    for (const unit of units) {
      const unitId = padUnit(unit.id);
      const outDir = path.join(ROOT, 'public', 'worksheets', 'gept', level.slug);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `${unitId}.pdf`);

      const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
      const stream = fs.createWriteStream(outPath);
      doc.pipe(stream);
      generateGeptWorksheet(doc, unit, level.label);
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      totalCount++;
      process.stdout.write(`  ✅ ${unitId}\n`);
    }
  }

  // ── JLPT ──
  const jlptLevels = [
    { slug: 'n5', label: 'JLPT N5' },
    { slug: 'n4', label: 'JLPT N4' },
    { slug: 'n3', label: 'JLPT N3' },
    { slug: 'n2', label: 'JLPT N2' },
    { slug: 'n1', label: 'JLPT N1' },
  ];

  for (const level of jlptLevels) {
    const units = data.jlpt[level.slug];
    if (!units || units.length === 0) { console.log(`⚠️ No data for ${level.label}`); continue; }
    console.log(`\n── ${level.label} (${units.length} units) ──`);

    for (const unit of units) {
      const unitId = padUnit(unit.id);
      const outDir = path.join(ROOT, 'public', 'worksheets', 'japanese', level.slug);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, `${unitId}.pdf`);

      const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
      const stream = fs.createWriteStream(outPath);
      doc.pipe(stream);
      generateJlptWorksheet(doc, unit, level.label);
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      totalCount++;
      process.stdout.write(`  ✅ ${unitId}\n`);
    }
  }

  console.log(`\n🎉 Done! Generated ${totalCount} worksheet PDFs!`);
}

main().catch(console.error);
