import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import AchievementNotification from "@/components/AchievementNotification";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import SpeechCleanup from "@/components/SpeechCleanup";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fda4af",
};

export const metadata: Metadata = {
  title: "Learn.chparenting.com 親子多元學習平台 | 華人家庭免費英文・數學・閱讀・注音・AI 工具",
  description: "Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文（全民英檢 GEPT 初級到中高級）、日文（JLPT N5-N1）、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
  keywords: "親子多元學習平台, 華人家庭學習, 免費親子學習, 親子共學, 親子英文, 親子數學, AI 工具親子, 英文自主學習, 數學自主學習, 注音學習, 閱讀學習, 全民英檢, GEPT, 英檢初級, 英檢中級, 英檢中高級, JLPT, 日文檢定, N5, N4, N3, 數學練習, 打字練習, 教育桌遊, 兒童理財, 免費英文學習, 免費日文學習, learn.chparenting.com",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "親子多元學習",
  },
  openGraph: {
    title: "Learn.chparenting.com 親子多元學習平台 | 華人家庭免費學習資源",
    description: "Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
    type: "website",
    url: "https://learn.chparenting.com",
    siteName: "親子多元學習平台",
    images: [{ url: "https://learn.chparenting.com/og-image.png", width: 1200, height: 630, alt: "親子多元學習平台" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn.chparenting.com 親子多元學習平台 | 華人家庭免費學習資源",
    description: "Learn.chparenting.com 是專為華人家庭打造的免費親子多元學習平台，整合英文、數學、閱讀、注音、AI 工具與親子共學資源，協助家長陪伴孩子自主學習。",
    images: ["https://learn.chparenting.com/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Hardcoded to prevent disappearing when env vars/secrets are accidentally cleared.
  // GA4 measurement IDs are public information anyway (visible in any deployed HTML).
  const gaId = "G-RK197FZYN8";
  const gscCode = process.env.NEXT_PUBLIC_GSC_CODE;

  return (
    <html lang="zh-TW">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {gscCode && <meta name="google-site-verification" content={gscCode} />}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}} />
          </>
        )}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3493526929407874" crossOrigin="anonymous" />
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '701206276303500');
          fbq('track', 'PageView');
        `}} />
        <noscript>
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=701206276303500&ev=PageView&noscript=1" />
        </noscript>
      </head>
      <body className="min-h-screen pb-16 md:pb-0">
        <SpeechCleanup />
        <AuthProvider>
          <AchievementProvider>
            <Header />
            <Breadcrumb />
            <main className="min-h-[calc(100vh-140px)]">{children}</main>
            <Footer />
            <MobileBottomNav />
            <OnboardingTutorial />
            <AchievementNotification />
          </AchievementProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
