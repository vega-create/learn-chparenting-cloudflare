/**
 * 自動洗牌所有 JLPT / GEPT 測驗答案
 * 處理：quiz, listening, reading 的 opts + ans
 *
 * Usage: node scripts/shuffle-answers.mjs
 */
import fs from 'fs';
import path from 'path';

// Seeded random for reproducibility (Fisher-Yates)
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle opts and update ans index
function shuffleQuestion(opts, ans) {
  const indices = opts.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  return {
    newOpts: shuffled.map(i => opts[i]),
    newAns: shuffled.indexOf(ans),
  };
}

// Process a single .ts file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  let shuffledCount = 0;

  // Match patterns like: opts: ["A", "B", "C", "D"], ans: 0
  // Handles single-line and multi-line opts arrays

  // Strategy: find all `opts:` arrays followed by `ans:` numbers
  // We use a regex to find opts arrays and their corresponding ans values

  // Pattern: opts: [array], ans: number (possibly with other fields in between but typically adjacent)
  const optsAnsRegex = /opts:\s*\[((?:[^\]]*?))\],\s*ans:\s*(\d+)/g;

  content = content.replace(optsAnsRegex, (match, optsContent, ansStr) => {
    const ans = parseInt(ansStr);

    // Parse the opts array - handle quoted strings
    const opts = [];
    const optRegex = /(?:"([^"]*(?:\\.[^"]*)*)"|'([^']*(?:\\.[^']*)*)'|`([^`]*(?:\\.[^`]*)*)`)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(optsContent)) !== null) {
      opts.push(optMatch[1] ?? optMatch[2] ?? optMatch[3]);
    }

    if (opts.length < 2 || ans >= opts.length) return match; // skip invalid
    if (ans === 0 || shouldShuffle(opts, ans)) {
      const { newOpts, newAns } = shuffleQuestion(opts, ans);

      // Detect quote style used in original
      const quoteChar = optsContent.includes('"') ? '"' : "'";
      const newOptsStr = newOpts.map(o => {
        // Escape quotes within option text
        const escaped = o.replace(/\\/g, '\\\\').replace(new RegExp(quoteChar, 'g'), '\\' + quoteChar);
        return `${quoteChar}${escaped}${quoteChar}`;
      }).join(', ');

      changed = true;
      shuffledCount++;
      return `opts: [${newOptsStr}], ans: ${newAns}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${path.basename(filePath)} — ${shuffledCount} questions shuffled`);
  } else {
    console.log(`  ⏭️  ${path.basename(filePath)} — no changes needed`);
  }
  return shuffledCount;
}

function shouldShuffle(opts, ans) {
  // Always shuffle - we want random distribution
  return true;
}

// Directories to process
const BASE = '/Users/vega/Desktop/gept-learning/src/data';
const dirs = [
  // JLPT
  'jlpt-n5-units',
  'jlpt-n4-units',
  'jlpt-n3-units',
  'jlpt-n2-units',
  'jlpt-n1-units',
  // GEPT
  'units',              // elementary
  'intermediate-units',
  'upper-intermediate-units',
];

let totalFiles = 0;
let totalShuffled = 0;

for (const dir of dirs) {
  const dirPath = path.join(BASE, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    continue;
  }

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.ts'))
    .sort();

  console.log(`\n📁 ${dir} (${files.length} files)`);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const count = processFile(filePath);
    totalFiles++;
    totalShuffled += count;
  }
}

console.log(`\n🎉 Done! Processed ${totalFiles} files, shuffled ${totalShuffled} questions.`);
