/**
 * Extract all guide data to JSON for ebook PDF generation
 */
import { UNITS } from '../src/data/elementary';
import { INTER_UNITS } from '../src/data/intermediate';
import { UI_UNITS } from '../src/data/upper-intermediate';
import { N5_UNITS } from '../src/data/jlpt-n5';
import { N4_UNITS } from '../src/data/jlpt-n4';
import { N3_UNITS } from '../src/data/jlpt-n3';
import { N2_UNITS } from '../src/data/jlpt-n2';
import { N1_UNITS } from '../src/data/jlpt-n1';

import { GEPT_ELEMENTARY_GUIDES } from '../src/data/guides/gept-elementary-guides';
import { GEPT_INTERMEDIATE_GUIDES } from '../src/data/guides/gept-intermediate-guides';
import { GEPT_UPPER_INTERMEDIATE_GUIDES } from '../src/data/guides/gept-upper-intermediate-guides';
import { JLPT_N5_GUIDES } from '../src/data/guides/jlpt-n5-guides';
import { JLPT_N4_GUIDES } from '../src/data/guides/jlpt-n4-guides';
import { JLPT_N3_GUIDES } from '../src/data/guides/jlpt-n3-guides';
import { JLPT_N2_GUIDES } from '../src/data/guides/jlpt-n2-guides';
import { JLPT_N1_GUIDES } from '../src/data/guides/jlpt-n1-guides';

import * as fs from 'fs';

function mapUnits(units: any[], guides: Record<number, any>) {
  return units.map(u => ({
    id: u.id,
    title: u.title,
    icon: u.icon,
    guide: guides[u.id] || null,
  }));
}

const data = {
  "gept-elementary": {
    bookName: "GEPT 初級家長陪伴指南",
    units: mapUnits(UNITS, GEPT_ELEMENTARY_GUIDES),
  },
  "gept-intermediate": {
    bookName: "GEPT 中級家長陪伴指南",
    units: mapUnits(INTER_UNITS, GEPT_INTERMEDIATE_GUIDES),
  },
  "gept-upper-intermediate": {
    bookName: "GEPT 中高級家長陪伴指南",
    units: mapUnits(UI_UNITS, GEPT_UPPER_INTERMEDIATE_GUIDES),
  },
  "japanese-n5": {
    bookName: "日文 N5 家長陪伴指南",
    units: mapUnits(N5_UNITS, JLPT_N5_GUIDES),
  },
  "japanese-n4": {
    bookName: "日文 N4 家長陪伴指南",
    units: mapUnits(N4_UNITS, JLPT_N4_GUIDES),
  },
  "japanese-n3": {
    bookName: "日文 N3 家長陪伴指南",
    units: mapUnits(N3_UNITS, JLPT_N3_GUIDES),
  },
  "japanese-n2": {
    bookName: "日文 N2 家長陪伴指南",
    units: mapUnits(N2_UNITS, JLPT_N2_GUIDES),
  },
  "japanese-n1": {
    bookName: "日文 N1 家長陪伴指南",
    units: mapUnits(N1_UNITS, JLPT_N1_GUIDES),
  },
};

fs.writeFileSync('./scripts/guides-data.json', JSON.stringify(data, null, 2));

let total = 0;
for (const [slug, book] of Object.entries(data)) {
  const count = book.units.filter(u => u.guide).length;
  total += count;
  console.log(`  ${slug}: ${count} guides`);
}
console.log(`\n✅ 指南資料已輸出到 scripts/guides-data.json (${total} guides)`);
