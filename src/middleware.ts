// Middleware disabled for Cloudflare Pages compatibility
// Auth protection is handled client-side in AuthContext
import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
