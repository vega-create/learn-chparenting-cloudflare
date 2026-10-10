import { NextResponse, type NextRequest } from "next/server";

/**
 * 只做一件事：把 Cloudflare 預設的 learn-chparenting.pages.dev 網址 301 到正式網址。
 *
 * 這個站用 next-on-pages 部署，沒有 functions/ 目錄可用，所以放在 Next 的 middleware。
 * 登入保護仍然在前端的 AuthContext 處理，這裡不碰。
 * 分支預覽網址（xxxx.learn-chparenting.pages.dev）不攔，還能測試。
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (url.hostname === "learn-chparenting.pages.dev") {
    url.hostname = "learn.chparenting.com";
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
