/**
 * 閱讀文章：照原文的換行分段顯示（原本整篇塞在一個 <p>，換行全被吃掉）。
 * 沒有換行的長文章，每 3 句分一段，方便追蹤閱讀位置。
 * 只改顯示，不改文章原文（音檔是用原文對應的）。
 */
const SENTENCES_PER_PARAGRAPH = 3;

function toParagraphs(text: string): string[] {
  const byLine = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (byLine.length > 1 || text.length < 300) return byLine;
  const sentences = text.match(/[^.!?。！？]+[.!?。！？]+["'」』)]*\s*|[^.!?。！？]+$/g) ?? [text];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += SENTENCES_PER_PARAGRAPH) {
    paragraphs.push(sentences.slice(i, i + SENTENCES_PER_PARAGRAPH).join("").trim());
  }
  return paragraphs;
}

export function PassageText({ text }: { text: string }) {
  return (
    <div className="max-w-[68ch] text-base md:text-lg leading-8 md:leading-9 text-slate-800">
      {toParagraphs(text).map((p, i) => (
        <p key={i} className="mb-4 last:mb-0">{p}</p>
      ))}
    </div>
  );
}
