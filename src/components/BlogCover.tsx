"use client";
/**
 * 文章封面／縮圖：圖還沒放上去或載入失敗時，退回淺灰底＋書本圖示，不顯示破圖。
 * （水合前就失敗的圖抓不到 onError，所以 mount 時再檢查一次 naturalWidth。）
 */
import { useEffect, useRef, useState } from "react";

export default function BlogCover({
  src, alt = "", className = "", imgClassName = "", width = 1200, height = 630, priority = false,
}: {
  src?: string;
  alt?: string;
  className?: string;     // 外框（決定尺寸、圓角）
  imgClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-slate-50 ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-slate-300" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z" />
            <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
          </svg>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
