/**
 * 首頁「每週一句英文」的內容：句型和諺語輪流，一週一句，52 週一輪。
 *
 * 從 2026-09-28（星期一）那一週開始算第 1 句，每週一自動換下一句（台灣時間），
 * 不用重新部署。要加新的句子就接在最後面；不要調動前面的順序，
 * 不然已經出現過的句子會提早重複。
 */
export interface WeeklyEnglish {
  type: "句型" | "諺語";
  en: string;         // 句型：例句；諺語：諺語本身
  zh: string;
  pattern?: string;   // 只有句型有：公式
  note: string;       // 什麼時候用、要注意什麼
}

export const WEEKLY_START = "2026-09-28"; // 第 1 句開始的星期一

export const WEEKLY_ENGLISH: WeeklyEnglish[] = [
  { type: "句型", en: "I like reading books.", zh: "我喜歡看書。", pattern: "I like + 動詞-ing", note: "說自己喜歡做的事。like 後面的動詞要加 -ing。" },
  { type: "諺語", en: "Practice makes perfect.", zh: "熟能生巧。", note: "鼓勵自己或別人多練習的時候說。" },
  { type: "句型", en: "Can I have some water?", zh: "我可以喝點水嗎？", pattern: "Can I + 原形動詞 ...?", note: "有禮貌地問「我可以…嗎？」。" },
  { type: "諺語", en: "Better late than never.", zh: "遲做總比不做好。", note: "事情晚了才做，但做了總比沒做好。" },
  { type: "句型", en: "There are three apples on the table.", zh: "桌上有三顆蘋果。", pattern: "There is / There are + 東西 + 地方", note: "說「某個地方有什麼」。一個用 is，兩個以上用 are。" },
  { type: "諺語", en: "Actions speak louder than words.", zh: "行動勝於言語。", note: "光說不做沒有用，要做出來才算數。" },
  { type: "句型", en: "I want to play soccer.", zh: "我想踢足球。", pattern: "I want to + 原形動詞", note: "說自己想做什麼。to 後面接原形動詞。" },
  { type: "諺語", en: "No pain, no gain.", zh: "一分耕耘，一分收穫。", note: "不付出努力就不會有收穫。" },
  { type: "句型", en: "What time is it? It's seven thirty.", zh: "現在幾點？七點半。", pattern: "What time is it? It's + 時間.", note: "問時間和回答時間。" },
  { type: "諺語", en: "The early bird catches the worm.", zh: "早起的鳥兒有蟲吃。", note: "早一點開始的人比較有機會。" },
  { type: "句型", en: "How many students are there?", zh: "有幾個學生？", pattern: "How many + 複數名詞 + are there?", note: "問數量。How many 後面的名詞要用複數。" },
  { type: "諺語", en: "Rome wasn't built in a day.", zh: "羅馬不是一天造成的。", note: "重要的事需要時間慢慢累積，不要急。" },
  { type: "句型", en: "I am good at drawing.", zh: "我很會畫畫。", pattern: "be good at + 動詞-ing / 名詞", note: "說自己擅長什麼。at 後面的動詞要加 -ing。" },
  { type: "諺語", en: "Where there's a will, there's a way.", zh: "有志者事竟成。", note: "只要有決心，就找得到辦法。" },
  { type: "句型", en: "Let's go to the park.", zh: "我們去公園吧。", pattern: "Let's + 原形動詞", note: "邀請別人一起做一件事。" },
  { type: "諺語", en: "Two heads are better than one.", zh: "三個臭皮匠，勝過一個諸葛亮。", note: "兩個人一起想，比一個人想得更好。" },
  { type: "句型", en: "I have to do my homework.", zh: "我必須寫功課。", pattern: "have to + 原形動詞", note: "說「一定要做」的事。主詞是 he、she 的時候用 has to。" },
  { type: "諺語", en: "Don't judge a book by its cover.", zh: "不要以貌取人。", note: "不要只看外表就下判斷。" },
  { type: "句型", en: "I want to be a doctor.", zh: "我想當醫生。", pattern: "I want to be a / an + 職業", note: "回答 What do you want to be?（你長大想做什麼？）" },
  { type: "諺語", en: "A friend in need is a friend indeed.", zh: "患難見真情。", note: "在你有困難時還幫你的，才是真正的朋友。" },
  { type: "句型", en: "It's fun to learn English.", zh: "學英文很有趣。", pattern: "It's + 形容詞 + to + 原形動詞", note: "說「做某件事怎麼樣」。" },
  { type: "諺語", en: "Honesty is the best policy.", zh: "誠實為上策。", note: "說實話是最好的做法。" },
  { type: "句型", en: "How often do you exercise? Twice a week.", zh: "你多久運動一次？一星期兩次。", pattern: "How often do you + 原形動詞?", note: "問「多久做一次」。回答可以用 once（一次）、twice（兩次）、every day（每天）。" },
  { type: "諺語", en: "Look before you leap.", zh: "三思而後行。", note: "做決定之前先想清楚。" },
  { type: "句型", en: "I'm looking for my pencil case.", zh: "我在找我的鉛筆盒。", pattern: "be looking for + 東西", note: "正在找東西的時候說。" },
  { type: "諺語", en: "Time flies.", zh: "光陰似箭。", note: "覺得時間過得很快的時候說。" },
  { type: "句型", en: "Would you like some juice?", zh: "你想喝點果汁嗎？", pattern: "Would you like + 名詞 / to + 原形動詞?", note: "比 Do you want 更有禮貌的問法。" },
  { type: "諺語", en: "Easy come, easy go.", zh: "來得容易，去得也快。", note: "輕鬆得到的東西，也很容易就沒了。" },
  { type: "句型", en: "I'm going to visit my grandma this weekend.", zh: "這個週末我要去看奶奶。", pattern: "be going to + 原形動詞", note: "說已經計畫好要做的事。" },
  { type: "諺語", en: "Every cloud has a silver lining.", zh: "再糟的事也有好的一面。", note: "安慰遇到壞事的人：事情總有好的一面。" },
  { type: "句型", en: "My brother is taller than me.", zh: "我哥哥比我高。", pattern: "A + be + 比較級 + than + B", note: "比較兩個人或兩樣東西。短的形容詞加 -er。" },
  { type: "諺語", en: "Haste makes waste.", zh: "欲速則不達。", note: "太急著做，反而容易出錯。" },
  { type: "句型", en: "Thank you for helping me.", zh: "謝謝你幫我。", pattern: "Thank you for + 動詞-ing / 名詞", note: "說明謝謝對方什麼。for 後面的動詞要加 -ing。" },
  { type: "諺語", en: "It's never too late to learn.", zh: "活到老，學到老。", note: "什麼時候開始學都不嫌晚。" },
  { type: "句型", en: "I'm sorry I'm late.", zh: "對不起，我遲到了。", pattern: "I'm sorry + 句子", note: "道歉的時候，把原因接在後面。" },
  { type: "諺語", en: "Many hands make light work.", zh: "人多好辦事。", note: "大家一起幫忙，事情就變輕鬆了。" },
  { type: "句型", en: "I go to school by bus.", zh: "我搭公車上學。", pattern: "by + 交通工具（走路是 on foot）", note: "回答 How do you go to school?（你怎麼上學？）" },
  { type: "諺語", en: "Don't put off until tomorrow what you can do today.", zh: "今日事，今日畢。", note: "今天能做的事，不要拖到明天。" },
  { type: "句型", en: "What's the weather like? It's sunny.", zh: "天氣怎麼樣？是晴天。", pattern: "What's the weather like? It's + 天氣形容詞.", note: "問天氣。常用的字：sunny、rainy、cloudy、windy。" },
  { type: "諺語", en: "An apple a day keeps the doctor away.", zh: "一天一蘋果，醫生遠離我。", note: "提醒大家吃得健康就比較不會生病。" },
  { type: "句型", en: "I think this book is interesting.", zh: "我覺得這本書很有趣。", pattern: "I think + 句子", note: "說自己的想法。" },
  { type: "諺語", en: "Slow and steady wins the race.", zh: "穩紮穩打才會贏。", note: "龜兔賽跑的道理：慢慢來、不放棄的人會贏。" },
  { type: "句型", en: "Don't forget to bring your umbrella.", zh: "別忘了帶雨傘。", pattern: "Don't forget to + 原形動詞", note: "提醒別人記得做某件事。" },
  { type: "諺語", en: "When in Rome, do as the Romans do.", zh: "入境隨俗。", note: "到了別的地方，就照當地的習慣做。" },
  { type: "句型", en: "Have you ever been to Japan?", zh: "你去過日本嗎？", pattern: "Have you ever + 過去分詞?", note: "問別人「有沒有…過」的經驗。" },
  { type: "諺語", en: "Knowledge is power.", zh: "知識就是力量。", note: "鼓勵人多學習、多讀書。" },
  { type: "句型", en: "If it rains, we will stay home.", zh: "如果下雨，我們就待在家。", pattern: "If + 現在式, 主詞 + will + 原形動詞", note: "說「如果…就…」。If 那一句用現在式，不用 will。" },
  { type: "諺語", en: "All that glitters is not gold.", zh: "會發亮的不一定是金子。", note: "看起來很好的東西，不一定真的好。" },
  { type: "句型", en: "I like both cats and dogs.", zh: "貓和狗我都喜歡。", pattern: "both A and B", note: "說「兩個都…」。" },
  { type: "諺語", en: "If at first you don't succeed, try, try again.", zh: "一次不成功，就再試一次。", note: "失敗了不要放棄，再試一次。" },
  { type: "句型", en: "I used to live in Tainan.", zh: "我以前住在台南。", pattern: "used to + 原形動詞", note: "說「以前常常…，現在沒有了」。" },
  { type: "諺語", en: "Kill two birds with one stone.", zh: "一石二鳥。", note: "做一件事同時達到兩個目的，就是中文的「一舉兩得」。" },
];

/** 台灣時間的今天是第幾週（從 WEEKLY_START 算起，第 1 週是 0） */
export function weekIndexOf(now: Date = new Date()): number {
  const today = now.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" }); // YYYY-MM-DD
  const days = Math.floor((Date.parse(today) - Date.parse(WEEKLY_START)) / 86400000);
  return Math.max(0, Math.floor(days / 7));
}

export function getWeeklyEnglish(now: Date = new Date(), offset = 0) {
  const week = Math.max(0, weekIndexOf(now) + offset);
  const item = WEEKLY_ENGLISH[week % WEEKLY_ENGLISH.length];
  const start = new Date(Date.parse(WEEKLY_START) + week * 7 * 86400000);
  const end = new Date(start.getTime() + 6 * 86400000);
  const md = (d: Date) => `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
  return { item, week, range: `${md(start)}–${md(end)}` };
}
