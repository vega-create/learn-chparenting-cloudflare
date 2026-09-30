"use client";
import { usePathname } from "next/navigation";

/**
 * 頁面主要內容的外框。
 *
 * Google 自動廣告的「廣告意圖」會把頁面上的字詞變成廣告連結或小標籤，
 * 插進麵包屑、標籤、遊戲畫面裡會把版面撐破，孩子玩遊戲時也可能誤點。
 * 加上 google-anno-skip 這個 class，Google 就不會在裡面插入。
 *
 * 只有部落格文章頁不加（文章內文可以有，文章的麵包屑和標題區另外在該頁排除）。
 */
export default function MainArea({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isArticle = pathname.startsWith("/blog/");
  return <main className={`min-h-[calc(100vh-140px)] ${isArticle ? "" : "google-anno-skip"}`}>{children}</main>;
}
