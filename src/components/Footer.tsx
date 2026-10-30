import { BrandMark } from "./SubjectIcon";

const LINKS = [
  { label: "關於平台", href: "/about" },
  { label: "使用說明", href: "/how-to-use" },
  { label: "常見問題", href: "/faq" },
  { label: "報考資訊", href: "/exam-info" },
  { label: "全部公告", href: "/updates" },
];

// 同一位作者經營的其他站（family network 互連，別拿掉）
const SISTER_SITES = [
  { label: "媽媽生活復原力 Lab", href: "https://chparenting.com/" },
  { label: "冒險英語", href: "https://english.chparenting.com/" },
  { label: "原來會這樣！品格互動繪本", href: "https://character.chparenting.com/" },
];

export default function Footer() {
  return (
    <footer className="google-anno-skip bg-[#F8EDDC] border-t border-[#EEDFC6] mt-12 hidden md:block">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 no-underline">
            <BrandMark size={24} />
            <span className="font-bold text-[#E65E83]">親子多元學習平台</span>
          </a>
          <nav aria-label="網站資訊" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-[#52616B] no-underline hover:text-[#E65E83]">{l.label}</a>
            ))}
          </nav>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-[#52616B]">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>關聯網站：</span>
            {SISTER_SITES.map((s) => (
              <a key={s.href} href={s.href} className="text-[#52616B] no-underline hover:text-[#E65E83]">{s.label}</a>
            ))}
          </div>
          <p className="m-0">
            © 2026 親子多元學習平台・由{" "}
            <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer" className="text-[#52616B] hover:text-[#E65E83]">
              智慧媽咪國際有限公司
            </a>{" "}
            製作・所有內容免費使用
          </p>
        </div>
      </div>
    </footer>
  );
}
