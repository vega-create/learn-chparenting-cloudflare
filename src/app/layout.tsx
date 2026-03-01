import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
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
  title: "親子多元學習平台 | 全民英檢・日文・數學・免費學習資源",
  description: "免費親子多元學習平台，提供全民英檢（初級・中級・中高級）電子書教學、互動測驗、模擬考試。日文、數學、教育桌遊等更多學習工具即將推出。",
  keywords: "親子學習, 免費學習, 全民英檢, GEPT, 英檢初級, 英檢中級, 英檢模擬試題, 英文學習, 日文學習, 數學練習",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "親子多元學習",
  },
  openGraph: {
    title: "親子多元學習平台 | 免費學習資源",
    description: "免費互動式學習平台：全民英檢電子書教學 + 遊戲練習 + 模擬考試，更多學習工具即將推出",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
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
      </head>
      <body className="min-h-screen pb-16 md:pb-0">
        <SpeechCleanup />
        <AuthProvider>
          <Header />
          <Breadcrumb />
          <main className="min-h-[calc(100vh-140px)]">{children}</main>
          <Footer />
          <MobileBottomNav />
          <OnboardingTutorial />
        </AuthProvider>
      </body>
    </html>
  );
}
