import type { MusicConcept, MusicTopic } from "../types";

const dynamics: MusicTopic = {
  id: "dynamics",
  title: "力度與速度記號",
  icon: "📢",
  description: "力度記號、速度記號與表情術語",
  color: "from-violet-500 to-violet-600",
  border: "border-violet-200",
  concepts: [
    {
      title: "力度記號",
      explanation:
        "力度記號告訴演奏者要彈多大聲或多小聲，從很弱到很強有一整套記號。",
      visual: `🔈 音量大小的刻度：
🤫 pp ─ p ─ mp ─ mf ─ f ─ ff 📢
  很弱  弱  中弱  中強  強  很強
   ░░   ▒▒  ▓▓▓  ███  ███ ████`,
      keyPoints: [
        "pp（很弱）→ p（弱）→ mp（中弱）→ mf（中強）→ f（強）→ ff（很強）",
        "p 來自義大利文 piano（輕柔），f 來自 forte（有力）",
        "m 是 mezzo（中等）的意思",
        "記號越多越極端：ppp 比 pp 更弱，fff 比 ff 更強",
      ],
      audioDemos: [
        {
          label: "🔊 弱（p）→ 強（f）",
          steps: [
            [329.63, 0.6, 0.08], [329.63, 0.6, 0.15], [329.63, 0.6, 0.25], [329.63, 0.6, 0.4], [329.63, 0.6, 0.55], [329.63, 0.6, 0.7],
          ],
          gap: 0.15,
        },
      ],
    },
    {
      title: "漸變記號",
      explanation:
        "漸變記號表示音量要慢慢變大或慢慢變小，不是突然改變，而是像溜滑梯一樣漸漸過渡。",
      visual: `📈 漸強 cresc.        📉 漸弱 dim.
  ＜               ＞
 ／  ＼            ＼  ／
p → → → f        f → → → p
小聲→大聲         大聲→小聲`,
      keyPoints: [
        "crescendo（漸強）：音量慢慢變大，符號像張開的嘴巴「<」",
        "diminuendo（漸弱）：音量慢慢變小，符號像收合的嘴巴「>」",
        "縮寫：cresc.（漸強）、dim. 或 decresc.（漸弱）",
        "sfz（突強）是突然大聲一下，和漸強不同",
      ],
      audioDemos: [
        {
          label: "🔊 漸強 cresc.",
          steps: [
            [261.63, 0.5, 0.05], [293.66, 0.5, 0.1], [329.63, 0.5, 0.18], [349.23, 0.5, 0.28],
            [392.00, 0.5, 0.4], [440.00, 0.5, 0.55], [493.88, 0.5, 0.65], [523.25, 0.6, 0.8],
          ],
          gap: 0.02,
        },
        {
          label: "🔊 漸弱 dim.",
          steps: [
            [523.25, 0.5, 0.8], [493.88, 0.5, 0.65], [440.00, 0.5, 0.55], [392.00, 0.5, 0.4],
            [349.23, 0.5, 0.28], [329.63, 0.5, 0.18], [293.66, 0.5, 0.1], [261.63, 0.6, 0.05],
          ],
          gap: 0.02,
        },
      ],
    },
    {
      title: "速度記號",
      explanation:
        "速度記號告訴演奏者這首曲子要彈多快或多慢，用義大利文標示在樂譜開頭。",
      visual: `🐌 慢 ─────────────────────→ 快 🐇
Largo  Adagio  Andante  Moderato  Allegro  Presto
~40    ~66     ~76      ~108      ~120     ~168
最緩板  慢板    行板     中板      快板     急板`,
      keyPoints: [
        "Largo（很慢）→ Adagio（慢板）→ Andante（行板）→ Moderato（中速）",
        "Allegro（快板）→ Presto（急板），速度越來越快",
        "accel.（漸快）= 慢慢加速，rit.（漸慢）= 慢慢減速",
        "a tempo = 回到原本的速度",
      ],
    },
    {
      title: "其他表情記號",
      explanation:
        "表情記號告訴演奏者用什麼方式或感覺來演奏，讓音樂更有生命力。",
      visual: `🎶 常見表情記號：
legato（圓滑）：♩‿♩‿♩‿♩  音音相連
staccato（斷奏）：♩·♩·♩·♩ 短促分離
accent（重音）：♩ > ♩    強調某音
fermata（延長）：♩ 🔴    自由延長`,
      keyPoints: [
        "legato（圓滑）：音與音之間要連接順暢",
        "staccato（斷奏）：每個音短促分離，音符上標一個小圓點",
        "accent（重音）：特別強調某個音，標記為「>」",
        "fermata（延長記號 ⌓）：自由延長那個音的長度",
      ],
    },
  ] satisfies MusicConcept[],
  questions: [
    // ===== 力度記號 (10) =====
    {
      s: "「p」這個力度記號代表什麼意思？",
      opts: ["弱（piano）", "強（forte）", "中等（mezzo）", "非常強"],
      ans: 0,
      explain: "p 是 piano 的縮寫，意思是「弱」，演奏時音量要輕柔。",
    },
    {
      s: "「f」這個力度記號代表什麼意思？",
      opts: ["強（forte）", "弱（piano）", "中強", "漸強"],
      ans: 0,
      explain: "f 是 forte 的縮寫，意思是「強」，演奏時音量要宏亮有力。",
    },
    {
      s: "下列力度記號由弱到強的正確排序為何？",
      opts: [
        "pp → p → mp → mf → f → ff",
        "ff → f → mf → mp → p → pp",
        "pp → mp → p → f → mf → ff",
        "p → pp → mp → mf → f → ff",
      ],
      ans: 0,
      explain: "力度由弱到強排序：pp（很弱）→ p（弱）→ mp（中弱）→ mf（中強）→ f（強）→ ff（很強）。",
    },
    {
      s: "「mp」代表什麼意思？",
      opts: ["中弱", "中強", "很弱", "很強"],
      ans: 0,
      explain: "mp 是 mezzo piano 的縮寫，意思是「中弱」，介於弱（p）和中強（mf）之間。",
    },
    {
      s: "「mf」代表什麼意思？",
      opts: ["中強", "中弱", "很強", "漸強"],
      ans: 0,
      explain: "mf 是 mezzo forte 的縮寫，意思是「中強」，介於中弱（mp）和強（f）之間。",
    },
    {
      s: "「ff」代表什麼意思？",
      opts: ["很強", "很弱", "中強", "漸強"],
      ans: 0,
      explain: "ff 是 fortissimo 的縮寫，意思是「很強」，比 f（強）更加有力。",
    },
    {
      s: "「pp」代表什麼意思？",
      opts: ["很弱", "很強", "中弱", "漸弱"],
      ans: 0,
      explain: "pp 是 pianissimo 的縮寫，意思是「很弱」，比 p（弱）更加輕柔。",
    },
    {
      s: "漸強記號（crescendo）的符號是什麼形狀？",
      opts: [
        "由左到右逐漸張開的「<」形",
        "由左到右逐漸收合的「>」形",
        "水平直線",
        "波浪線",
      ],
      ans: 0,
      explain: "漸強記號（cresc.）的形狀像張開的嘴巴「<」，表示音量從弱到強逐漸增大。",
    },
    {
      s: "漸弱記號（diminuendo）的符號是什麼形狀？",
      opts: [
        "由左到右逐漸收合的「>」形",
        "由左到右逐漸張開的「<」形",
        "向下的箭頭",
        "虛線",
      ],
      ans: 0,
      explain: "漸弱記號（dim.）的形狀是「>」，表示音量從強到弱逐漸減小。",
    },
    {
      s: "「sfz」代表什麼意思？",
      opts: [
        "突強（sforzando）",
        "突弱",
        "漸強",
        "中強",
      ],
      ans: 0,
      explain: "sfz 是 sforzando 的縮寫，意思是「突強」，指某個音或和弦要突然加重力度。",
    },

    // ===== 速度記號 (10) =====
    {
      s: "「Allegro」代表什麼速度？",
      opts: ["快板", "慢板", "行板", "中板"],
      ans: 0,
      explain: "Allegro 意為「快板」，速度大約在每分鐘 120-156 拍之間，帶有活潑愉快的感覺。",
    },
    {
      s: "「Adagio」代表什麼速度？",
      opts: ["慢板", "快板", "中板", "急板"],
      ans: 0,
      explain: "Adagio 意為「慢板」，速度大約在每分鐘 66-76 拍之間，帶有從容悠閒的感覺。",
    },
    {
      s: "「Andante」代表什麼速度？",
      opts: ["行板", "快板", "慢板", "急板"],
      ans: 0,
      explain: "Andante 意為「行板」，速度大約在每分鐘 76-108 拍之間，如同悠閒步行的速度。",
    },
    {
      s: "「Moderato」代表什麼速度？",
      opts: ["中板", "快板", "慢板", "急板"],
      ans: 0,
      explain: "Moderato 意為「中板」，速度大約在每分鐘 108-120 拍之間，是中等速度。",
    },
    {
      s: "「Presto」代表什麼速度？",
      opts: ["急板", "慢板", "行板", "中板"],
      ans: 0,
      explain: "Presto 意為「急板」，速度大約在每分鐘 168-200 拍之間，是非常快的速度。",
    },
    {
      s: "「Largo」代表什麼速度？",
      opts: ["最緩板", "行板", "中板", "快板"],
      ans: 0,
      explain: "Largo 意為「最緩板」，速度大約在每分鐘 40-66 拍之間，是非常緩慢的速度。",
    },
    {
      s: "下列速度術語由慢到快的正確排序為何？",
      opts: [
        "Largo → Adagio → Andante → Moderato → Allegro → Presto",
        "Presto → Allegro → Moderato → Andante → Adagio → Largo",
        "Adagio → Largo → Andante → Allegro → Moderato → Presto",
        "Largo → Andante → Adagio → Moderato → Presto → Allegro",
      ],
      ans: 0,
      explain: "速度由慢到快：Largo（最緩板）→ Adagio（慢板）→ Andante（行板）→ Moderato（中板）→ Allegro（快板）→ Presto（急板）。",
    },
    {
      s: "「accelerando（accel.）」代表什麼意思？",
      opts: ["漸快", "漸慢", "突然加快", "回原速"],
      ans: 0,
      explain: "accelerando（縮寫 accel.）意為「漸快」，表示速度逐漸加快。",
    },
    {
      s: "「ritardando（rit.）」代表什麼意思？",
      opts: ["漸慢", "漸快", "突然變慢", "回原速"],
      ans: 0,
      explain: "ritardando（縮寫 rit.）意為「漸慢」，表示速度逐漸變慢。",
    },
    {
      s: "「a tempo」代表什麼意思？",
      opts: [
        "回到原來的速度",
        "加快速度",
        "放慢速度",
        "自由速度",
      ],
      ans: 0,
      explain: "a tempo 意為「回到原來的速度」，通常在漸快或漸慢之後使用，恢復到先前的速度。",
    },

    // ===== 表情記號 (10) =====
    {
      s: "「dolce」代表什麼意思？",
      opts: ["柔美地", "強烈地", "快速地", "沉重地"],
      ans: 0,
      explain: "dolce 是義大利文，意為「柔美地、甜美地」，演奏時要表現出溫柔甜美的感覺。",
    },
    {
      s: "「cantabile」代表什麼意思？",
      opts: ["如歌地", "跳躍地", "莊嚴地", "急促地"],
      ans: 0,
      explain: "cantabile 意為「如歌地」，演奏時要像唱歌一樣流暢優美。",
    },
    {
      s: "「legato」代表什麼演奏方式？",
      opts: ["圓滑地（連奏）", "斷奏", "跳躍地", "重音"],
      ans: 0,
      explain: "legato 意為「圓滑地」，音與音之間要連接順暢，不能有間斷。",
    },
    {
      s: "「staccato」代表什麼演奏方式？",
      opts: ["斷奏", "連奏", "漸強", "顫音"],
      ans: 0,
      explain: "staccato 意為「斷奏」，每個音要短促分離，在音符上方或下方標記一個小圓點。",
    },
    {
      s: "「fermata（延長記號）」代表什麼意思？",
      opts: [
        "延長記號，自由延長音符時值",
        "反覆記號",
        "結束記號",
        "漸強記號",
      ],
      ans: 0,
      explain: "fermata（延長記號）表示該音符可以自由延長，通常延長到原時值的 1.5 到 2 倍。",
    },
    {
      s: "「espressivo（espress.）」代表什麼意思？",
      opts: ["富有表情地", "平淡地", "快速地", "安靜地"],
      ans: 0,
      explain: "espressivo 意為「富有表情地」，演奏時要充滿感情和表現力。",
    },
    {
      s: "「con brio」代表什麼意思？",
      opts: ["有活力地", "安靜地", "緩慢地", "悲傷地"],
      ans: 0,
      explain: "con brio 意為「有活力地、有精神地」，演奏時要充滿朝氣和生命力。",
    },
    {
      s: "「maestoso」代表什麼意思？",
      opts: ["莊嚴地", "輕快地", "柔和地", "急促地"],
      ans: 0,
      explain: "maestoso 意為「莊嚴地、雄偉地」，演奏時要呈現出莊嚴宏偉的氣勢。",
    },
    {
      s: "「tenuto」的演奏方式是什麼？",
      opts: [
        "保持音符的完整時值",
        "縮短音符時值",
        "加重音符力度",
        "裝飾音",
      ],
      ans: 0,
      explain: "tenuto 意為「保持」，在音符上方或下方標記一條短橫線，表示要完整保持該音的時值。",
    },
    {
      s: "「marcato」代表什麼演奏方式？",
      opts: [
        "加重強調地",
        "輕柔地",
        "圓滑地",
        "自由速度地",
      ],
      ans: 0,
      explain: "marcato 意為「加重強調地」，標記為「>」或「^」，每個音都要明確有力地演奏。",
    },
  ],
};

export default dynamics;
