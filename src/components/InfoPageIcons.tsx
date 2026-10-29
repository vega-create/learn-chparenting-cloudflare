/**
 * 說明類內頁（家長指南、報考資訊、我的學習、登入、FAQ、關於、使用說明）共用的小線條圖示。
 * 顏色由呼叫端用 text-* 設定（stroke="currentColor"）。
 */
export type InfoIconName =
  | "calendar" | "check" | "download" | "search" | "lock" | "clock" | "phone" | "keyboard"
  | "volume" | "list" | "chat" | "heart" | "users" | "sprout" | "arrow" | "external" | "info"
  | "chevron" | "help" | "bulb" | "target" | "book" | "trophy" | "pen" | "home";

export default function InfoIcon({ name, size = 20, className = "" }: { name: InfoIconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className}`}>
      {name === "calendar" && <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>}
      {name === "check" && <path d="M5 12.5l4.5 4.5L19 7.5" />}
      {name === "download" && <><path d="M12 4v11M7 10.5l5 5 5-5" /><path d="M5 19.5h14" /></>}
      {name === "search" && <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></>}
      {name === "lock" && <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>}
      {name === "clock" && <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>}
      {name === "phone" && <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 17.5h2" /></>}
      {name === "keyboard" && <><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M6 13.5h.01M18 13.5h.01" strokeWidth="2.2" /><path d="M9 14.5h6" /></>}
      {name === "volume" && <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>}
      {name === "list" && <><path d="M9 7h11M9 12h11M9 17h11" /><path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" strokeWidth="2.6" /></>}
      {name === "chat" && <><path d="M4 5.5h16v10H10l-4.5 3.5V15.5H4Z" /><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth="2.4" /></>}
      {name === "heart" && <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10Z" />}
      {name === "users" && <><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5" /><circle cx="16.5" cy="9.5" r="2.5" /><path d="M15.5 14.2c2.5 0 4.4 1.8 5 4.8" /></>}
      {name === "sprout" && <><path d="M12 20v-8" /><path d="M12 12c0-4 2.5-6.5 7-6.5 0 4.5-2.5 6.5-7 6.5Z" /><path d="M12 14c0-3-2-5-6-5 0 3.5 2 5 6 5Z" /></>}
      {name === "arrow" && <path d="M9 5.5l6.5 6.5L9 18.5" />}
      {name === "external" && <><path d="M14 4h6v6M20 4l-8.5 8.5" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>}
      {name === "info" && <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.8h.01" /></>}
      {name === "chevron" && <path d="M6 9.5l6 6 6-6" />}
      {name === "help" && <><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17h.01" /></>}
      {name === "bulb" && <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" /></>}
      {name === "target" && <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".8" /></>}
      {name === "book" && <><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5Z" /><path d="M12 6.5v13" /></>}
      {name === "trophy" && <><path d="M8 4h8v5a4 4 0 0 1-8 0Z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4" /></>}
      {name === "pen" && <><path d="M15 5l4 4L8.5 19.5H4.5v-4Z" /><path d="M13 7l4 4" /></>}
      {name === "home" && <><path d="M4 11l8-6.5 8 6.5" /><path d="M6 9.5V20h12V9.5" /></>}
    </svg>
  );
}
