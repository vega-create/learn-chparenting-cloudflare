# Learn CH Parenting — 免費多科學習平台

> 免費英檢、日檢、教育桌遊學習平台
> https://learn.chparenting.com

## 技術棧

- **框架**：Next.js 14.2.35 (App Router) + React 18 + TypeScript
- **樣式**：Tailwind CSS 3.4.1
- **認證**：Supabase Auth (Google OAuth)
- **資料庫**：無傳統 DB — 全部用靜態 TS 資料檔 + localStorage
- **部署**：Cloudflare Pages（@cloudflare/next-on-pages，push main 自動部署）
- **組織**：智慧媽咪國際有限公司 (Mommy Wisdom International LTD)

## 核心功能

### 全民英檢 GEPT
- 3 個等級：初級 / 中級 / 中高級
- 每級 20 個單元：單字、文法、聽力、閱讀、寫作
- 7 種遊戲練習模式
- 模擬測驗
- 口說 & 寫作練習（Web Speech API）

### 日文檢定 JLPT
- 5 個等級：N5 ~ N1
- 每級 20+ 個單元
- 10,000+ 單字涵蓋

### 教育桌遊（10 款）
- 邏輯：Pattern Master, Mini Sudoku, Sequence Quest
- 程式：Code Path, Logic Gates, Loop Builder
- 記憶：Memory Match, Memory Sequence
- 反應：Color Tap, Whack-A-Mole

### 打字練習
- 中英文打字訓練

## 關鍵目錄結構

```
src/
├── app/                    # Next.js 頁面
│   ├── elementary/         # GEPT 初級（20 單元）
│   ├── intermediate/       # GEPT 中級（34 單元）
│   ├── upper-intermediate/ # GEPT 中高級
│   ├── jlpt-n5 ~ n1/      # 日文各級
│   ├── board-games/        # 10 款桌遊
│   ├── typing-game/        # 打字練習
│   ├── dashboard/          # 使用者儀表板
│   └── login/              # OAuth 登入
├── components/             # Header, Footer, MobileBottomNav, Breadcrumb, OnboardingTutorial
├── contexts/AuthContext.tsx # 使用者認證狀態
├── data/                   # 所有學習內容（靜態 TS 資料檔）
│   ├── units/              # GEPT 初級單元
│   ├── intermediate-units/ # GEPT 中級單元
│   ├── jlpt-n5-units/      # JLPT N5 單元
│   └── ...
└── lib/                    # supabase.ts, game-utils.tsx, speech.ts, sounds.ts
```

## 重要設計決策

- **全部學習內容是靜態 TS 檔**：無 CMS，極快且可離線
- **認證是可選的**：所有內容無需登入就能使用
- **遊戲分數存 localStorage**：星級評分、連擊倍數、倒數計時
- **Web Speech API**：英文 (en-US) 和日文 (ja-JP) 朗讀
- **Google AdSense 整合**：`ca-pub-3493526929407874`

## 環境變數

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_CODE=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://learn.chparenting.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
