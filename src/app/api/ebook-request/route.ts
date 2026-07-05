export const runtime = "edge";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Use Resend REST API directly via fetch instead of the SDK.
// The Resend npm package depends on Node APIs and fails to load in
// Cloudflare's Edge runtime, which causes the route to 500 before
// our try/catch can run.
async function sendResendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

const BOOK_NAMES: Record<string, string> = {
  "gept-elementary": "GEPT 初級家長陪伴指南",
  "gept-intermediate": "GEPT 中級家長陪伴指南",
  "gept-upper-intermediate": "GEPT 中高級家長陪伴指南",
  "japanese-n5": "日文 N5 家長陪伴指南",
  "japanese-n4": "日文 N4 家長陪伴指南",
  "japanese-n3": "日文 N3 家長陪伴指南",
  "japanese-n2": "日文 N2 家長陪伴指南",
  "japanese-n1": "日文 N1 家長陪伴指南",
};

const GUIDE_URLS: Record<string, string> = {
  "gept-elementary": "/elementary/guide",
  "gept-intermediate": "/intermediate/guide",
  "gept-upper-intermediate": "/upper-intermediate/guide",
  "japanese-n5": "/jlpt-n5/guide",
  "japanese-n4": "/jlpt-n4/guide",
  "japanese-n3": "/jlpt-n3/guide",
  "japanese-n2": "/jlpt-n2/guide",
  "japanese-n1": "/jlpt-n1/guide",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://learn.chparenting.com";

function buildEmailHtml(bookName: string, ebookSlug: string, guideUrl: string): string {
  const fullUrl = `${SITE_URL}${guideUrl}`;
  const pdfUrl = `${SITE_URL}/ebooks/${ebookSlug}.pdf`;

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px;">

    <div style="background:#ffffff;border-radius:16px;padding:32px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:48px;margin-bottom:8px;">📚</div>
        <h1 style="font-size:20px;font-weight:800;color:#1e293b;margin:0 0 4px;">
          你的《${bookName}》來囉！
        </h1>
        <p style="font-size:14px;color:#64748b;margin:0;">
          PDF 下載 + 線上閱讀，兩種方式任你選
        </p>
      </div>

      <div style="text-align:center;margin:24px 0;">
        <a href="${pdfUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:16px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;">
          下載 PDF 電子書 📥
        </a>
      </div>

      <div style="text-align:center;margin:8px 0 24px;">
        <a href="${fullUrl}" style="display:inline-block;background:#ffffff;color:#4f46e5;font-size:14px;font-weight:600;padding:10px 24px;border-radius:10px;text-decoration:none;border:2px solid #4f46e5;">
          線上閱讀指南 →
        </a>
      </div>

      <div style="background:#f1f5f9;border-radius:12px;padding:16px;margin:24px 0;">
        <div style="font-size:13px;color:#475569;line-height:1.8;">
          <div>✅ 每單元 30 秒看完就知道怎麼陪</div>
          <div>✅ 常見問題 & 解決方式</div>
          <div>✅ 學習目標 & 過關清單</div>
          <div>✅ 精美排版，手機也能輕鬆看</div>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding-top:16px;margin-top:24px;">
        <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0 0 8px;line-height:1.6;">
          AI 是大人的翅膀，卻只是孩子的起點<br>
          <strong style="color:#64748b;">孩子才是最強 AI</strong>
        </p>
        <p style="font-size:12px;color:#cbd5e1;text-align:center;margin:0;">
          <a href="${SITE_URL}" style="color:#94a3b8;">learn.chparenting.com</a>
        </p>
      </div>
    </div>

  </div>
</body>
</html>`.trim();
}

// Practical email shape check: one @, no spaces/control chars, has a TLD.
// RFC 5321 caps addresses at 254 chars.
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const { email, ebookSlug } = await request.json();

    if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!ebookSlug || !BOOK_NAMES[ebookSlug]) {
      return NextResponse.json({ error: "Invalid ebook" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const bookName = BOOK_NAMES[ebookSlug];
    const guideUrl = GUIDE_URLS[ebookSlug];

    // 1. Store email in Supabase.
    // Plain INSERT (not upsert): the RLS policy only allows INSERT, and a
    // duplicate email (23505) just means they're already subscribed — fine.
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: cleanEmail,
          source: `ebook-${ebookSlug}`,
          is_active: true,
        });

      if (dbError && dbError.code !== "23505") {
        console.error("Supabase error:", dbError);
      }
    }

    // 2. Send email via Resend REST API (edge-compatible)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && guideUrl) {
      try {
        const result = await sendResendEmail({
          apiKey: resendKey,
          from: "親子學習平台 <no-reply@chparenting.com>",
          to: cleanEmail,
          subject: `你的《${bookName}》來囉！`,
          html: buildEmailHtml(bookName, ebookSlug, guideUrl),
        });
        if (!result.ok) {
          console.error("Resend API error:", result.status, result.body);
        }
      } catch (emailErr) {
        console.error("Resend fetch error:", emailErr);
        // Don't fail the request — email is stored, user sees success
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("ebook-request error:", msg, err);
    return NextResponse.json({ error: "Server error", detail: msg }, { status: 500 });
  }
}
