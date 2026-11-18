/**
 * 文章內商品卡（酷澎分潤）
 * 由文章 frontmatter 的 products[] 驅動（見 lib/blog.ts ProductPick），
 * 連結由 scripts/coupang.mjs 產生（已含分潤追蹤碼）。
 */
export interface ProductPick {
  name: string;
  url: string;
  price?: number;
  image?: string;
  note?: string;
}

interface Props {
  products?: ProductPick[];
  title?: string;
  intro?: string;
}

const fmt = (n?: number) => (typeof n === 'number' && n > 0 ? `NT$${n.toLocaleString('zh-TW')}` : '');

export default function ProductPicks({ products = [], title = '文中提到的用品', intro }: Props) {
  if (!products.length) return null;
  return (
    <section className="google-anno-skip mt-10 rounded-2xl border border-[#F3D5DE] bg-[#FFF6F8] p-5 md:p-6" aria-label="相關用品">
      <h2 className="text-lg md:text-xl font-bold text-[#263238] mt-0 mb-1 flex items-center gap-2">
        <span aria-hidden="true">🛒</span>{title}
      </h2>
      <p className="text-sm text-[#52616B] mt-0 mb-4">{intro ?? '想直接看價格或規格，可以從這裡到酷澎看看。'}</p>
      <ul className="list-none p-0 m-0 grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.url} className="m-0 p-0">
            <a
              href={p.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="flex gap-3 items-start no-underline bg-white border border-slate-200 rounded-xl p-3 hover:border-[#E65E83] hover:shadow-sm transition"
            >
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" width={88} height={88} loading="lazy" referrerPolicy="no-referrer" className="w-[88px] h-[88px] object-contain rounded-lg bg-white shrink-0 m-0" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[#263238] leading-snug line-clamp-2">{p.name}</span>
                {p.note && <span className="block text-xs text-[#52616B] mt-1 leading-relaxed">{p.note}</span>}
                <span className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-sm font-bold text-[#E65E83]">{fmt(p.price)}</span>
                  <span className="text-xs font-semibold text-white bg-[#E65E83] rounded-full px-3 py-1">到酷澎看看 ↗</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-slate-400 mt-3 mb-0 leading-relaxed">以上為酷澎分潤連結，透過連結購買不會增加您的費用，但能支持我們持續提供免費內容。價格以酷澎頁面為準。</p>
    </section>
  );
}
