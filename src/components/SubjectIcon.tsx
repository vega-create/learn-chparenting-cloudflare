/**
 * 首頁分類、頂部選單用的線條圖示（取代 emoji，讓整站看起來一致）。
 * 每個分類固定一個顏色，顏色在呼叫端用 text-* 設定。
 */
export type SubjectIconName =
  | "book" | "torii" | "reading" | "calculator" | "brain" | "keyboard" | "globe" | "music" | "coins";

export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="#E65E83" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8.5C13 6.5 8.5 6 4 6.8v17.5c4.5-.8 9 0 12 2 3-2 7.5-2.8 12-2V6.8c-4.5-.8-9-.3-12 1.7Z" />
      <path d="M16 8.5v17.8" />
    </svg>
  );
}

export default function SubjectIcon({ name, size = 36 }: { name: SubjectIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "book" && <><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5Z" /><path d="M12 6.5v13" /></>}
      {name === "torii" && <><path d="M3 5.5c3 .8 15 .8 18 0" /><path d="M4.5 9h15" /><path d="M7 6.3V20M17 6.3V20" /><path d="M12 9V6.6" /></>}
      {name === "reading" && <><path d="M3 5h6a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H3Z" /><path d="M21 5h-6a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H21Z" /><path d="M5.5 9h3.5M5.5 12h3.5M15 9h3.5M15 12h3.5" /></>}
      {name === "calculator" && <><rect x="5" y="3" width="14" height="18" rx="2" /><rect x="8" y="6" width="8" height="3.5" rx=".5" /><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth="2.4" /></>}
      {name === "brain" && <><path d="M12 5.5a3 3 0 0 0-5.5-1.2A3 3 0 0 0 4 9a3 3 0 0 0 .5 5.5A3.2 3.2 0 0 0 9 19.5a3 3 0 0 0 3-1.5Z" /><path d="M12 5.5a3 3 0 0 1 5.5-1.2A3 3 0 0 1 20 9a3 3 0 0 1-.5 5.5 3.2 3.2 0 0 1-4.5 5A3 3 0 0 1 12 18Z" /><path d="M12 5.5V18M8 9.5c1 0 2 .7 2 2M16 9.5c-1 0-2 .7-2 2M8.5 15c.8-.6 1.8-.6 2.5 0M15.5 15c-.8-.6-1.8-.6-2.5 0" /></>}
      {name === "keyboard" && <><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M6 13.5h.01M18 13.5h.01" strokeWidth="2.2" /><path d="M9 14.5h6" /></>}
      {name === "globe" && <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" /></>}
      {name === "music" && <><path d="M9 18V5.5l11-2V16" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>}
      {name === "coins" && <><ellipse cx="9" cy="7" rx="5" ry="2.2" /><path d="M4 7v4c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2V7" /><ellipse cx="15" cy="13.5" rx="5" ry="2.2" /><path d="M10 13.5v4c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2v-4" /></>}
    </svg>
  );
}
