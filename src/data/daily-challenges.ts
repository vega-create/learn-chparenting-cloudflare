export interface DailyChallenge {
  id: string;
  category: string;
  categoryLink: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  // ─── 英檢初級 ───
  { id: "dc-001", category: "英檢初級", categoryLink: "/elementary", question: "What does 'beautiful' mean?", options: ["漂亮的", "快速的", "困難的", "重要的"], answer: 0, explanation: "beautiful 是「漂亮的、美麗的」的意思。" },
  { id: "dc-002", category: "英檢初級", categoryLink: "/elementary", question: "He ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1, explanation: "第三人稱單數（he/she/it）現在式動詞要加 -s/-es。" },
  { id: "dc-003", category: "英檢初級", categoryLink: "/elementary", question: "Which is the correct spelling?", options: ["recieve", "receive", "receeve", "receve"], answer: 1, explanation: "receive 的拼寫是 r-e-c-e-i-v-e（i before e except after c）。" },
  { id: "dc-004", category: "英檢初級", categoryLink: "/elementary", question: "What is the opposite of 'expensive'?", options: ["cheap", "heavy", "large", "fast"], answer: 0, explanation: "expensive（昂貴的）的反義詞是 cheap（便宜的）。" },
  { id: "dc-005", category: "英檢初級", categoryLink: "/elementary", question: "I ___ a student.", options: ["is", "am", "are", "be"], answer: 1, explanation: "I 搭配 am，He/She/It 搭配 is，You/We/They 搭配 are。" },
  { id: "dc-006", category: "英檢初級", categoryLink: "/elementary", question: "She ___ her homework yesterday.", options: ["do", "does", "did", "done"], answer: 2, explanation: "yesterday 表示過去式，do 的過去式是 did。" },
  { id: "dc-007", category: "英檢初級", categoryLink: "/elementary", question: "There ___ many books on the table.", options: ["is", "are", "has", "have"], answer: 1, explanation: "books 是複數，所以用 There are。" },
  { id: "dc-008", category: "英檢初級", categoryLink: "/elementary", question: "What does 'delicious' mean?", options: ["危險的", "美味的", "困難的", "不同的"], answer: 1, explanation: "delicious 是「美味的」的意思，常用來形容食物。" },
  { id: "dc-009", category: "英檢初級", categoryLink: "/elementary", question: "We ___ to the park last weekend.", options: ["go", "went", "going", "goes"], answer: 1, explanation: "last weekend 是過去式，go 的過去式是 went。" },
  { id: "dc-010", category: "英檢初級", categoryLink: "/elementary", question: "___ you like coffee?", options: ["Do", "Does", "Are", "Is"], answer: 0, explanation: "問 you 的喜好用 Do you like...?" },

  // ─── 英檢中級 ───
  { id: "dc-011", category: "英檢中級", categoryLink: "/intermediate", question: "If I ___ you, I would study harder.", options: ["am", "was", "were", "be"], answer: 2, explanation: "假設語氣（與事實相反）中，be 動詞一律用 were。" },
  { id: "dc-012", category: "英檢中級", categoryLink: "/intermediate", question: "She suggested that we ___ early.", options: ["leave", "leaves", "left", "leaving"], answer: 0, explanation: "suggest that + 主詞 + 原形動詞（subjunctive mood）。" },
  { id: "dc-013", category: "英檢中級", categoryLink: "/intermediate", question: "The book ___ I bought yesterday is interesting.", options: ["who", "which", "what", "where"], answer: 1, explanation: "修飾事物的關係代名詞用 which 或 that。" },
  { id: "dc-014", category: "英檢中級", categoryLink: "/intermediate", question: "Not until he arrived ___ the meeting begin.", options: ["did", "does", "was", "had"], answer: 0, explanation: "Not until 開頭的倒裝句，主句用助動詞 did + 原形動詞。" },
  { id: "dc-015", category: "英檢中級", categoryLink: "/intermediate", question: "He has been working here ___ 2015.", options: ["for", "since", "from", "at"], answer: 1, explanation: "since + 過去時間點，for + 一段時間。2015 是時間點，用 since。" },

  // ─── 日文 N5 ───
  { id: "dc-016", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「ありがとう」是什麼意思？", options: ["對不起", "謝謝", "你好", "再見"], answer: 1, explanation: "ありがとう（arigatou）是日文的「謝謝」。" },
  { id: "dc-017", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「おはよう」是什麼意思？", options: ["午安", "早安", "晚安", "你好"], answer: 1, explanation: "おはよう（ohayou）是日文的「早安」。" },
  { id: "dc-018", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「猫」的讀音是？", options: ["いぬ", "ねこ", "とり", "さかな"], answer: 1, explanation: "猫（ねこ・neko）是「貓」的意思。" },
  { id: "dc-019", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「すみません」是什麼意思？", options: ["謝謝", "再見", "不好意思/對不起", "歡迎"], answer: 2, explanation: "すみません（sumimasen）是「不好意思/對不起」。" },
  { id: "dc-020", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「食べる」的意思是？", options: ["喝", "吃", "看", "走"], answer: 1, explanation: "食べる（たべる・taberu）是「吃」的意思。" },

  // ─── 日文 N4 ───
  { id: "dc-021", category: "日文 N4", categoryLink: "/jlpt-n4", question: "「嬉しい」的意思是？", options: ["悲傷的", "高興的", "生氣的", "害怕的"], answer: 1, explanation: "嬉しい（うれしい・ureshii）是「高興的」的意思。" },
  { id: "dc-022", category: "日文 N4", categoryLink: "/jlpt-n4", question: "「〜てもいいですか」表示？", options: ["不可以做", "可以做嗎？", "必須做", "不想做"], answer: 1, explanation: "〜てもいいですか 是詢問許可「可以做...嗎？」。" },
  { id: "dc-023", category: "日文 N4", categoryLink: "/jlpt-n4", question: "「約束」的讀音是？", options: ["やくそく", "やくそう", "かんそく", "しゅうそく"], answer: 0, explanation: "約束（やくそく・yakusoku）是「約定、約會」的意思。" },

  // ─── 數學 ───
  { id: "dc-024", category: "數學", categoryLink: "/math", question: "125 × 8 = ?", options: ["800", "1000", "900", "1025"], answer: 1, explanation: "125 × 8 = 1000。小技巧：125 = 1000 ÷ 8。" },
  { id: "dc-025", category: "數學", categoryLink: "/math", question: "1/4 + 1/2 = ?", options: ["1/6", "2/6", "3/4", "1/3"], answer: 2, explanation: "1/4 + 1/2 = 1/4 + 2/4 = 3/4。先通分再相加。" },
  { id: "dc-026", category: "數學", categoryLink: "/math", question: "三角形三個內角的和是幾度？", options: ["90°", "180°", "270°", "360°"], answer: 1, explanation: "三角形的內角和永遠是 180 度。" },
  { id: "dc-027", category: "數學", categoryLink: "/math", question: "如果 x + 5 = 12，x = ?", options: ["5", "6", "7", "8"], answer: 2, explanation: "x = 12 - 5 = 7。" },
  { id: "dc-028", category: "數學", categoryLink: "/math", question: "25% 等於多少？", options: ["1/5", "1/4", "1/3", "1/2"], answer: 1, explanation: "25% = 25/100 = 1/4。" },
  { id: "dc-029", category: "數學", categoryLink: "/math", question: "72 ÷ 9 = ?", options: ["7", "8", "9", "6"], answer: 1, explanation: "72 ÷ 9 = 8。九九乘法表：9 × 8 = 72。" },
  { id: "dc-030", category: "數學", categoryLink: "/math", question: "0.5 × 0.2 = ?", options: ["0.1", "0.01", "1.0", "0.7"], answer: 0, explanation: "0.5 × 0.2 = 0.10 = 0.1。" },

  // ─── 更多英檢初級 ───
  { id: "dc-031", category: "英檢初級", categoryLink: "/elementary", question: "What color is the sky on a clear day?", options: ["red", "blue", "green", "yellow"], answer: 1, explanation: "晴天的天空是 blue（藍色的）。" },
  { id: "dc-032", category: "英檢初級", categoryLink: "/elementary", question: "How many months are there in a year?", options: ["10", "11", "12", "13"], answer: 2, explanation: "一年有 12 個月。" },
  { id: "dc-033", category: "英檢初級", categoryLink: "/elementary", question: "She can ___ very well.", options: ["sings", "sang", "sing", "sung"], answer: 2, explanation: "can 後面接原形動詞，所以是 can sing。" },
  { id: "dc-034", category: "英檢初級", categoryLink: "/elementary", question: "What does 'friendly' mean?", options: ["害怕的", "友善的", "生氣的", "悲傷的"], answer: 1, explanation: "friendly 是「友善的」，friend（朋友）+ -ly。" },
  { id: "dc-035", category: "英檢初級", categoryLink: "/elementary", question: "I have ___ books than you.", options: ["many", "much", "more", "most"], answer: 2, explanation: "比較級用 more + 名詞 + than。" },

  // ─── 更多英檢中級 ───
  { id: "dc-036", category: "英檢中級", categoryLink: "/intermediate", question: "By the time she arrived, we ___ already left.", options: ["have", "had", "has", "having"], answer: 1, explanation: "過去完成式：By the time + 過去式，主句用 had + p.p.。" },
  { id: "dc-037", category: "英檢中級", categoryLink: "/intermediate", question: "The report ___ by next Monday.", options: ["will finish", "will be finished", "is finishing", "finishes"], answer: 1, explanation: "被動語態未來式：will be + p.p.（報告會被完成）。" },
  { id: "dc-038", category: "英檢中級", categoryLink: "/intermediate", question: "I wish I ___ taller.", options: ["am", "was", "were", "be"], answer: 2, explanation: "wish 後面用假設語氣，be 動詞用 were。" },
  { id: "dc-039", category: "英檢中級", categoryLink: "/intermediate", question: "She speaks English ___ a native speaker.", options: ["as", "like", "for", "to"], answer: 1, explanation: "like + 名詞 表示「像⋯一樣」。" },
  { id: "dc-040", category: "英檢中級", categoryLink: "/intermediate", question: "The more you practice, the ___ you get.", options: ["good", "better", "best", "well"], answer: 1, explanation: "The more...the better...（越⋯越⋯）用比較級。" },

  // ─── 更多日文 ───
  { id: "dc-041", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「大きい」的意思是？", options: ["小的", "大的", "長的", "短的"], answer: 1, explanation: "大きい（おおきい・ookii）是「大的」。" },
  { id: "dc-042", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「水」的讀音是？", options: ["みず", "ひ", "き", "かぜ"], answer: 0, explanation: "水（みず・mizu）是「水」的意思。" },
  { id: "dc-043", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「学校」的意思是？", options: ["醫院", "學校", "車站", "圖書館"], answer: 1, explanation: "学校（がっこう・gakkou）是「學校」。" },
  { id: "dc-044", category: "日文 N5", categoryLink: "/jlpt-n5", question: "1 到 10 的日文中，「さん」代表數字幾？", options: ["1", "2", "3", "4"], answer: 2, explanation: "さん（san）= 3。いち(1)、に(2)、さん(3)。" },
  { id: "dc-045", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「天気」的意思是？", options: ["電車", "天氣", "天才", "元氣"], answer: 1, explanation: "天気（てんき・tenki）是「天氣」。" },

  // ─── 更多數學 ───
  { id: "dc-046", category: "數學", categoryLink: "/math", question: "一個正方形的邊長是 5 公分，面積是多少？", options: ["10 cm²", "20 cm²", "25 cm²", "15 cm²"], answer: 2, explanation: "正方形面積 = 邊長 × 邊長 = 5 × 5 = 25 cm²。" },
  { id: "dc-047", category: "數學", categoryLink: "/math", question: "36 的平方根是？", options: ["4", "5", "6", "7"], answer: 2, explanation: "√36 = 6，因為 6 × 6 = 36。" },
  { id: "dc-048", category: "數學", categoryLink: "/math", question: "2/3 × 3/4 = ?", options: ["6/12", "5/7", "1/2", "2/4"], answer: 2, explanation: "分數相乘：(2×3)/(3×4) = 6/12 = 1/2。" },
  { id: "dc-049", category: "數學", categoryLink: "/math", question: "一打（dozen）是幾個？", options: ["6", "10", "12", "24"], answer: 2, explanation: "一打（dozen）= 12 個。" },
  { id: "dc-050", category: "數學", categoryLink: "/math", question: "圓的周長公式是？", options: ["πr", "2πr", "πr²", "2πr²"], answer: 1, explanation: "圓的周長 = 2πr（2 × 圓周率 × 半徑）。" },

  // ─── 更多混合題 ───
  { id: "dc-051", category: "英檢初級", categoryLink: "/elementary", question: "What is the past tense of 'eat'?", options: ["eated", "ate", "eaten", "eating"], answer: 1, explanation: "eat 的過去式是 ate，過去分詞是 eaten。" },
  { id: "dc-052", category: "英檢初級", categoryLink: "/elementary", question: "___ is your birthday?", options: ["What", "When", "Where", "Who"], answer: 1, explanation: "問時間用 When。When is your birthday?（你的生日是什麼時候？）" },
  { id: "dc-053", category: "英檢初級", categoryLink: "/elementary", question: "I ___ swimming every weekend.", options: ["go", "goes", "going", "went"], answer: 0, explanation: "I 的現在式用原形動詞 go。every weekend 表示習慣。" },
  { id: "dc-054", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「赤い」的意思是？", options: ["藍色的", "紅色的", "白色的", "黑色的"], answer: 1, explanation: "赤い（あかい・akai）是「紅色的」。" },
  { id: "dc-055", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「先生」在日文中通常指？", options: ["學生", "先生/老師", "醫生", "警察"], answer: 1, explanation: "先生（せんせい・sensei）是「老師/醫生/律師等尊稱」。" },
  { id: "dc-056", category: "數學", categoryLink: "/math", question: "3² + 4² = ?", options: ["7", "12", "25", "49"], answer: 2, explanation: "3² + 4² = 9 + 16 = 25。（這也是 5² 哦！）" },
  { id: "dc-057", category: "數學", categoryLink: "/math", question: "100 的 15% 是多少？", options: ["10", "15", "20", "25"], answer: 1, explanation: "100 × 15% = 100 × 0.15 = 15。" },
  { id: "dc-058", category: "英檢中級", categoryLink: "/intermediate", question: "I'm looking forward ___ seeing you.", options: ["for", "to", "at", "on"], answer: 1, explanation: "look forward to + V-ing 是固定用法，表示「期待」。" },
  { id: "dc-059", category: "英檢中級", categoryLink: "/intermediate", question: "She ___ here since 2020.", options: ["works", "worked", "has worked", "is working"], answer: 2, explanation: "since + 過去時間 → 現在完成式 has/have + p.p.。" },
  { id: "dc-060", category: "日文 N4", categoryLink: "/jlpt-n4", question: "「〜なければならない」表示？", options: ["不可以", "必須", "想要", "可能"], answer: 1, explanation: "〜なければならない 表示「必須做...」。" },

  // ─── 國語 ───
  { id: "dc-cl-01", category: "國語", categoryLink: "/chinese-lang", question: "「守株待兔」的意思是？", options: ["不勞而獲", "勇敢面對", "團結合作", "助人為樂"], answer: 0, explanation: "「守株待兔」比喻不努力而想得到收穫，坐等好運降臨。" },
  { id: "dc-cl-02", category: "國語", categoryLink: "/chinese-lang", question: "下列哪個字的部首是「水」（氵）？", options: ["林", "河", "明", "花"], answer: 1, explanation: "「河」的部首是三點水（氵），屬於「水」部。" },
  { id: "dc-cl-03", category: "國語", categoryLink: "/chinese-lang", question: "「ㄅㄆㄇ」是注音符號的前三個，第四個是？", options: ["ㄈ", "ㄉ", "ㄊ", "ㄋ"], answer: 0, explanation: "注音符號的順序是：ㄅㄆㄇㄈ…，第四個是ㄈ。" },
  { id: "dc-cl-04", category: "國語", categoryLink: "/chinese-lang", question: "「畫蛇添足」比喻什麼？", options: ["做事認真", "多此一舉", "勇於嘗試", "精益求精"], answer: 1, explanation: "「畫蛇添足」比喻做了多餘的事，反而把事情弄糟了。" },
  { id: "dc-cl-05", category: "國語", categoryLink: "/chinese-lang", question: "「快樂」的相反詞是？", options: ["高興", "悲傷", "開心", "歡喜"], answer: 1, explanation: "「快樂」的相反詞是「悲傷」。" },
  { id: "dc-cl-06", category: "國語", categoryLink: "/chinese-lang", question: "哪個句子使用了「譬喻」修辭？", options: ["風在唱歌", "他跑得像風一樣快", "我好餓", "今天天氣好"], answer: 1, explanation: "「像風一樣快」用「像」比喻，是明喻的修辭手法。" },
  { id: "dc-cl-07", category: "國語", categoryLink: "/chinese-lang", question: "「亡羊補牢」告訴我們什麼道理？", options: ["不要養羊", "犯錯後及時改正還來得及", "羊不能跑", "要蓋好圍欄"], answer: 1, explanation: "「亡羊補牢，猶未遲也」——發現問題及時改正，還不算太晚。" },
  { id: "dc-cl-08", category: "國語", categoryLink: "/chinese-lang", question: "「日」加一筆可以變成哪個字？", options: ["月", "田", "目", "白"], answer: 3, explanation: "「日」加一撇就變成「白」字。" },
  { id: "dc-cl-09", category: "國語", categoryLink: "/chinese-lang", question: "一隻（　）鳥，括號中應填入什麼量詞？", options: ["張", "顆", "隻", "條"], answer: 2, explanation: "鳥用量詞「隻」。一隻鳥。" },
  { id: "dc-cl-10", category: "國語", categoryLink: "/chinese-lang", question: "「杯弓蛇影」形容什麼？", options: ["非常勇敢", "疑神疑鬼", "很有學問", "做事認真"], answer: 1, explanation: "「杯弓蛇影」比喻因疑慮而引起恐懼，疑神疑鬼。" },

  // ─── 歷史地理 ───
  { id: "dc-hg-01", category: "歷史地理", categoryLink: "/history-geo", question: "台灣最高的山是哪一座？", options: ["阿里山", "玉山", "雪山", "大霸尖山"], answer: 1, explanation: "玉山海拔 3,952 公尺，是台灣最高峰，也是東北亞最高峰。" },
  { id: "dc-hg-02", category: "歷史地理", categoryLink: "/history-geo", question: "世界上最長的河流是？", options: ["亞馬遜河", "長江", "尼羅河", "密西西比河"], answer: 2, explanation: "尼羅河全長約 6,650 公里，是世界上最長的河流。" },
  { id: "dc-hg-03", category: "歷史地理", categoryLink: "/history-geo", question: "哪一個朝代修建了萬里長城的大部分？", options: ["秦朝", "漢朝", "唐朝", "明朝"], answer: 3, explanation: "雖然秦朝開始修建，但現存的萬里長城大多是明朝重新修建的。" },
  { id: "dc-hg-04", category: "歷史地理", categoryLink: "/history-geo", question: "日本的首都是？", options: ["大阪", "京都", "東京", "名古屋"], answer: 2, explanation: "東京是日本的首都，也是世界最大的都會區之一。" },
  { id: "dc-hg-05", category: "歷史地理", categoryLink: "/history-geo", question: "台灣在日治時期建造了哪個大型水利工程？", options: ["翡翠水庫", "嘉南大圳", "石門水庫", "曾文水庫"], answer: 1, explanation: "嘉南大圳由八田與一設計，1930年完工，是日治時期最重要的水利建設。" },
  { id: "dc-hg-06", category: "歷史地理", categoryLink: "/history-geo", question: "世界上面積最大的國家是？", options: ["中國", "美國", "加拿大", "俄羅斯"], answer: 3, explanation: "俄羅斯面積約 1,710 萬平方公里，是世界上面積最大的國家。" },
  { id: "dc-hg-07", category: "歷史地理", categoryLink: "/history-geo", question: "古埃及人建造金字塔的主要目的是？", options: ["存放糧食", "作為法老的陵墓", "觀測天象", "防禦外敵"], answer: 1, explanation: "金字塔主要是作為法老（古埃及國王）的陵墓而建造的。" },
  { id: "dc-hg-08", category: "歷史地理", categoryLink: "/history-geo", question: "台灣最長的河流是？", options: ["高屏溪", "淡水河", "濁水溪", "大甲溪"], answer: 2, explanation: "濁水溪全長約 186.6 公里，是台灣最長的河流。" },

  // ─── 樂理 ───
  { id: "dc-mu-01", category: "樂理", categoryLink: "/music", question: "五線譜上有幾條線？", options: ["3 條", "4 條", "5 條", "6 條"], answer: 2, explanation: "五線譜由 5 條平行的橫線組成，線和線之間的空間叫做「間」。" },
  { id: "dc-mu-02", category: "樂理", categoryLink: "/music", question: "一個全音符等於幾個四分音符？", options: ["2 個", "3 個", "4 個", "8 個"], answer: 2, explanation: "全音符 = 4 拍 = 4 個四分音符（每個四分音符 1 拍）。" },
  { id: "dc-mu-03", category: "樂理", categoryLink: "/music", question: "「f」這個力度記號代表什麼？", options: ["很弱", "弱", "強", "很強"], answer: 2, explanation: "f 是 forte 的縮寫，意思是「強」。" },
  { id: "dc-mu-04", category: "樂理", categoryLink: "/music", question: "C 大調音階有幾個升降記號？", options: ["0 個", "1 個", "2 個", "3 個"], answer: 0, explanation: "C 大調沒有任何升降記號，只使用白鍵（C D E F G A B）。" },
  { id: "dc-mu-05", category: "樂理", categoryLink: "/music", question: "「Allegro」是什麼意思？", options: ["慢板", "行板", "快板", "極快"], answer: 2, explanation: "Allegro 是「快板」，速度約 120-156 BPM。" },
  { id: "dc-mu-06", category: "樂理", categoryLink: "/music", question: "被稱為「音樂之父」的是哪位作曲家？", options: ["莫札特", "貝多芬", "巴哈", "蕭邦"], answer: 2, explanation: "巴哈（J.S. Bach）被尊稱為「音樂之父」，是巴洛克時期最重要的作曲家。" },
  { id: "dc-mu-07", category: "樂理", categoryLink: "/music", question: "小提琴屬於哪個樂器家族？", options: ["管樂", "弦樂", "打擊樂", "鍵盤樂"], answer: 1, explanation: "小提琴是弦樂器，靠弓摩擦琴弦發聲。" },
  { id: "dc-mu-08", category: "樂理", categoryLink: "/music", question: "4/4 拍表示什麼？", options: ["每小節 4 拍，以二分音符為一拍", "每小節 4 拍，以四分音符為一拍", "每小節 3 拍，以四分音符為一拍", "每小節 2 拍，以四分音符為一拍"], answer: 1, explanation: "4/4 拍：上面的 4 = 每小節 4 拍，下面的 4 = 四分音符為一拍。" },

  // ─── 繼續補充到 100+ 題 ───
  { id: "dc-061", category: "英檢初級", categoryLink: "/elementary", question: "What does 'surprised' mean?", options: ["開心的", "驚訝的", "害怕的", "無聊的"], answer: 1, explanation: "surprised 是「驚訝的」，surprise 是驚喜。" },
  { id: "dc-062", category: "英檢初級", categoryLink: "/elementary", question: "They ___ playing in the park now.", options: ["is", "am", "are", "was"], answer: 2, explanation: "They 搭配 are，現在進行式：are + V-ing。" },
  { id: "dc-063", category: "英檢初級", categoryLink: "/elementary", question: "A doctor works in a ___.", options: ["school", "hospital", "restaurant", "library"], answer: 1, explanation: "doctor（醫生）在 hospital（醫院）工作。" },
  { id: "dc-064", category: "英檢初級", categoryLink: "/elementary", question: "Which animal can fly?", options: ["dog", "cat", "bird", "fish"], answer: 2, explanation: "bird（鳥）可以 fly（飛）。" },
  { id: "dc-065", category: "英檢初級", categoryLink: "/elementary", question: "My mother's sister is my ___.", options: ["grandmother", "aunt", "cousin", "niece"], answer: 1, explanation: "媽媽的姐妹是 aunt（阿姨/姑姑）。" },
  { id: "dc-066", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「いただきます」什麼時候說？", options: ["睡前", "吃飯前", "出門前", "回家時"], answer: 1, explanation: "いただきます（itadakimasu）在吃飯前說，表示「我要開動了」。" },
  { id: "dc-067", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「友達」的意思是？", options: ["家人", "老師", "朋友", "同學"], answer: 2, explanation: "友達（ともだち・tomodachi）是「朋友」。" },
  { id: "dc-068", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「右」的讀音是？", options: ["ひだり", "みぎ", "うえ", "した"], answer: 1, explanation: "右（みぎ・migi）是「右邊」。左是 ひだり。" },
  { id: "dc-069", category: "數學", categoryLink: "/math", question: "一個三角形的底是 6，高是 4，面積是？", options: ["24", "10", "12", "20"], answer: 2, explanation: "三角形面積 = 底 × 高 ÷ 2 = 6 × 4 ÷ 2 = 12。" },
  { id: "dc-070", category: "數學", categoryLink: "/math", question: "最小的質數是？", options: ["0", "1", "2", "3"], answer: 2, explanation: "2 是最小的質數。1 不是質數，0 也不是。" },

  { id: "dc-071", category: "英檢中級", categoryLink: "/intermediate", question: "He apologized ___ being late.", options: ["to", "for", "at", "about"], answer: 1, explanation: "apologize for + V-ing 是固定搭配，表示「為⋯道歉」。" },
  { id: "dc-072", category: "英檢中級", categoryLink: "/intermediate", question: "Neither Tom ___ Jerry was there.", options: ["or", "and", "nor", "but"], answer: 2, explanation: "neither...nor... 是固定搭配，表示「既不⋯也不⋯」。" },
  { id: "dc-073", category: "英檢初級", categoryLink: "/elementary", question: "We ___ a cat and a dog.", options: ["has", "have", "having", "had"], answer: 1, explanation: "We 搭配 have（有）。He/She 才搭配 has。" },
  { id: "dc-074", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「電話」的讀音是？", options: ["でんわ", "でんき", "でんしゃ", "でんち"], answer: 0, explanation: "電話（でんわ・denwa）是「電話」。" },
  { id: "dc-075", category: "數學", categoryLink: "/math", question: "5! (5 的階乘) 等於多少？", options: ["25", "60", "120", "720"], answer: 2, explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120。" },

  { id: "dc-076", category: "英檢初級", categoryLink: "/elementary", question: "What is the plural of 'child'?", options: ["childs", "children", "childes", "childrens"], answer: 1, explanation: "child 的複數是不規則變化：children。" },
  { id: "dc-077", category: "英檢初級", categoryLink: "/elementary", question: "The opposite of 'hot' is ___.", options: ["warm", "cold", "cool", "ice"], answer: 1, explanation: "hot（熱的）的相反是 cold（冷的）。" },
  { id: "dc-078", category: "英檢初級", categoryLink: "/elementary", question: "I ___ like spicy food.", options: ["doesn't", "don't", "isn't", "aren't"], answer: 1, explanation: "I 的否定用 don't。He/She 才用 doesn't。" },
  { id: "dc-079", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「月曜日」是星期幾？", options: ["星期日", "星期一", "星期二", "星期三"], answer: 1, explanation: "月曜日（げつようび・getsuyoubi）是星期一。" },
  { id: "dc-080", category: "數學", categoryLink: "/math", question: "一個長方形的長是 8，寬是 3，周長是？", options: ["11", "22", "24", "48"], answer: 1, explanation: "周長 = (長 + 寬) × 2 = (8 + 3) × 2 = 22。" },

  { id: "dc-081", category: "英檢中級", categoryLink: "/intermediate", question: "Despite ___ hard, he failed the exam.", options: ["study", "studying", "studied", "to study"], answer: 1, explanation: "despite + V-ing / 名詞，表示「儘管」。" },
  { id: "dc-082", category: "英檢初級", categoryLink: "/elementary", question: "Which season comes after winter?", options: ["summer", "fall", "spring", "winter"], answer: 2, explanation: "冬天後面是春天（spring）。四季：spring → summer → fall → winter。" },
  { id: "dc-083", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「ごめんなさい」是什麼意思？", options: ["謝謝", "對不起", "沒關係", "打擾了"], answer: 1, explanation: "ごめんなさい（gomen nasai）是「對不起」。" },
  { id: "dc-084", category: "數學", categoryLink: "/math", question: "如果一件東西打 8 折，原價 500 元，打折後多少？", options: ["80", "400", "420", "450"], answer: 1, explanation: "打 8 折 = 原價 × 0.8 = 500 × 0.8 = 400 元。" },
  { id: "dc-085", category: "英檢初級", categoryLink: "/elementary", question: "What time do you ___ up in the morning?", options: ["wake", "get", "stand", "rise"], answer: 1, explanation: "get up 是「起床」最常用的說法。wake up 也可以。" },
  { id: "dc-086", category: "日文 N4", categoryLink: "/jlpt-n4", question: "「〜たことがある」表示？", options: ["正在做", "曾經做過", "想要做", "打算做"], answer: 1, explanation: "〜たことがある 表示「有過⋯的經驗」。" },
  { id: "dc-087", category: "英檢中級", categoryLink: "/intermediate", question: "She is ___ intelligent ___ hardworking.", options: ["both/and", "either/or", "neither/nor", "not only/but"], answer: 0, explanation: "both A and B 表示「A 和 B 兩者都⋯」。" },
  { id: "dc-088", category: "數學", categoryLink: "/math", question: "(-3) × (-4) = ?", options: ["-12", "-7", "7", "12"], answer: 3, explanation: "負數 × 負數 = 正數。(-3) × (-4) = 12。" },
  { id: "dc-089", category: "英檢初級", categoryLink: "/elementary", question: "I'm thirsty. Can I have some ___?", options: ["food", "water", "book", "pen"], answer: 1, explanation: "thirsty（口渴的）→ 需要 water（水）。" },
  { id: "dc-090", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「一」在日文中的讀音是？", options: ["に", "いち", "さん", "し"], answer: 1, explanation: "一（いち・ichi）= 1。" },

  { id: "dc-091", category: "英檢初級", categoryLink: "/elementary", question: "What does 'honest' mean?", options: ["勇敢的", "誠實的", "聰明的", "善良的"], answer: 1, explanation: "honest 是「誠實的」。注意 h 不發音，所以是 an honest person。" },
  { id: "dc-092", category: "數學", categoryLink: "/math", question: "0.25 換成分數是？", options: ["1/5", "1/4", "1/3", "1/2"], answer: 1, explanation: "0.25 = 25/100 = 1/4。" },
  { id: "dc-093", category: "英檢中級", categoryLink: "/intermediate", question: "I'd rather ___ at home tonight.", options: ["stay", "staying", "stayed", "to stay"], answer: 0, explanation: "would rather + 原形動詞，表示「寧願⋯」。" },
  { id: "dc-094", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「暑い」的意思是？", options: ["冷的", "熱的(天氣)", "暖和的", "涼爽的"], answer: 1, explanation: "暑い（あつい・atsui）是「（天氣）熱的」。" },
  { id: "dc-095", category: "英檢初級", categoryLink: "/elementary", question: "She ___ born in 2010.", options: ["is", "was", "were", "are"], answer: 1, explanation: "出生用過去式 was born。She 搭配 was。" },
  { id: "dc-096", category: "數學", categoryLink: "/math", question: "一個圓的半徑是 7，直徑是多少？", options: ["3.5", "7", "14", "21"], answer: 2, explanation: "直徑 = 半徑 × 2 = 7 × 2 = 14。" },
  { id: "dc-097", category: "英檢初級", categoryLink: "/elementary", question: "What does 'comfortable' mean?", options: ["危險的", "舒適的", "昂貴的", "奇怪的"], answer: 1, explanation: "comfortable 是「舒適的」，comfort（舒適）+ able。" },
  { id: "dc-098", category: "日文 N5", categoryLink: "/jlpt-n5", question: "「本」這個量詞用來數什麼？", options: ["書", "人", "長條狀物品", "動物"], answer: 2, explanation: "本（ほん）是數長條狀物品（如筆、瓶子、傘）的量詞。" },
  { id: "dc-099", category: "英檢中級", categoryLink: "/intermediate", question: "It's high time we ___ a decision.", options: ["make", "made", "making", "to make"], answer: 1, explanation: "It's high time + 過去式，表示「該是⋯的時候了」。" },
  { id: "dc-100", category: "數學", categoryLink: "/math", question: "1 公里等於幾公尺？", options: ["100", "500", "1000", "10000"], answer: 2, explanation: "1 公里（km）= 1000 公尺（m）。" },
];

/* ─── Hash function for daily seed ─── */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/* ─── Weekday subject rotation ─── */
const WEEKDAY_SUBJECTS: Record<number, string[]> = {
  0: ["數學", "國語", "樂理"],              // 週日
  1: ["英檢初級", "歷史地理"],              // 週一
  2: ["日文 N5", "日文 N4", "樂理"],        // 週二
  3: ["英檢中級", "國語"],                  // 週三
  4: ["數學", "歷史地理"],                  // 週四
  5: ["英檢初級", "英檢中級", "樂理"],      // 週五
  6: ["日文 N5", "國語", "歷史地理"],       // 週六
};

export function getDailyChallenge(date: Date): DailyChallenge {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dateString = `${y}-${m}-${d}`;
  const seed = hashString(dateString);
  const day = date.getDay(); // 0=Sun, 1=Mon...

  // Filter by today's subject
  const subjects = WEEKDAY_SUBJECTS[day] ?? [];
  const filtered = DAILY_CHALLENGES.filter((q) => subjects.includes(q.category));

  // If filtered has questions, pick from them; otherwise pick from all
  const pool = filtered.length > 0 ? filtered : DAILY_CHALLENGES;
  const index = seed % pool.length;
  return pool[index];
}
