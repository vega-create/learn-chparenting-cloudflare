/**
 * 抽取所有題庫資料為 JSON，供 PDF 產生腳本使用
 */
import { UNITS } from '../src/data/elementary';
import { INTER_UNITS } from '../src/data/intermediate';
import { UI_UNITS } from '../src/data/upper-intermediate';
import { N5_UNITS } from '../src/data/jlpt-n5';
import { N4_UNITS } from '../src/data/jlpt-n4';
import { N3_UNITS } from '../src/data/jlpt-n3';
import { N2_UNITS } from '../src/data/jlpt-n2';
import { N1_UNITS } from '../src/data/jlpt-n1';

const data = {
  gept: {
    elementary: UNITS.map(u => ({
      id: u.id, title: u.title, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
    intermediate: INTER_UNITS.map(u => ({
      id: u.id, title: u.title, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
    'upper-intermediate': UI_UNITS.map(u => ({
      id: u.id, title: u.title, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
  },
  jlpt: {
    n5: N5_UNITS.map(u => ({
      id: u.id, title: u.title, titleJa: u.titleJa, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
    n4: N4_UNITS.map(u => ({
      id: u.id, title: u.title, titleJa: u.titleJa, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
    n3: N3_UNITS.map(u => ({
      id: u.id, title: u.title, titleJa: u.titleJa, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
    n2: N2_UNITS.map(u => ({
      id: u.id, title: u.title, titleJa: u.titleJa, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
    n1: N1_UNITS.map(u => ({
      id: u.id, title: u.title, titleJa: u.titleJa, icon: u.icon, color: u.color,
      vocab: u.vocab, quiz: u.quiz, listening: u.listening,
      reading: Array.isArray(u.reading) ? u.reading : [u.reading],
      grammar: u.grammar,
    })),
  },
};

import * as fs from 'fs';
fs.writeFileSync('./scripts/all-data.json', JSON.stringify(data));
console.log('✅ 資料已輸出到 scripts/all-data.json');
console.log(`  GEPT: ${data.gept.elementary.length + data.gept.intermediate.length + data.gept['upper-intermediate'].length} units`);
console.log(`  JLPT: ${data.jlpt.n5.length + data.jlpt.n4.length + data.jlpt.n3.length + data.jlpt.n2.length + data.jlpt.n1.length} units`);
