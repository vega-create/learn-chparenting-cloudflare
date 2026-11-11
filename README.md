# learn.chparenting.com

免費英檢、日檢、教育桌遊學習平台（Next.js 15 App Router，部署在 Cloudflare Pages）。內容架構見 [CLAUDE.md](CLAUDE.md)。

## 本機開發

```bash
npm install
cp .dev.vars.example .dev.vars        # 填 AUTH_SECRET / GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET（本機測登入才需要）
npx wrangler d1 migrations apply learn --local   # 建本機 D1（.wrangler/state）
npm run dev                            # http://localhost:3000（next dev，透過 setupDevPlatform 拿到 D1 binding）
```

接近正式環境的跑法（workerd）：

```bash
npm run pages:build
npm run pages:dev                      # http://localhost:8788
```

測試：`npm test`（node:test，涵蓋 D1 相容層、打卡／連續天數邏輯、session cookie 簽章）。

## 架構：資料層與登入（2026-11 從 Supabase 搬到 Cloudflare）

| 項目 | 現在 | 以前 |
|---|---|---|
| 學習紀錄、打卡、連續天數、學習計畫、電子報名單、每日挑戰統計、練習次數 | Cloudflare D1 `learn`（binding `DB`，schema 在 `migrations/d1/`） | Supabase Postgres（專案 lexcvc） |
| 使用者 | D1 `users` 表（id 沿用 Supabase 的 UUID） | Supabase auth.users |
| 登入 | 網站自己接 Google OAuth（PKCE）：`/api/auth/login` → Google → `/api/auth/callback/google`；session 是 HMAC 簽章 cookie `learn_session`（30 天） | Supabase 代接 Google |
| 瀏覽器讀寫自己的紀錄 | `/api/me/activities`、`/api/me/streak`、`/api/me/schedule`（用 cookie 認人） | 前端直接打 Supabase + RLS |

重點檔案：

- `src/lib/d1-compat.ts`：薄的 supabase-js 相容層（`from().select().eq().order().limit().single()` / `insert` / `upsert` / `update` / `delete`），既有 API route 查詢寫法不用改。json／bool／時間欄位轉換在這裡。
- `src/lib/db.ts`：取 D1 binding 與 secrets（Cloudflare env → `process.env`）。
- `src/lib/checkin.ts`：原 Supabase RPC `record_checkin` 的程式版（D1 batch）。
- `src/lib/session.ts`、`src/lib/auth-server.ts`、`src/app/api/auth/*`：登入。
- `src/contexts/AuthContext.tsx`：前端登入狀態來源改為 `GET /api/auth/me`；`user.user_metadata.full_name / avatar_url` 保留，Header 與儀表板不用改。
- `scripts/migrate-from-supabase.mjs`：一次性搬遷腳本（匯出 → data.sql → 寫入 D1 → 核對筆數）。
- `supabase-schema.sql`、`supabase-rls-fix.sql`：舊 Supabase 的 schema，留作對照，30 天觀察期後可刪。

Secrets（正式用 `wrangler pages secret put`，本機放 `.dev.vars`）：`AUTH_SECRET`、`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`。

## 切換步驟（Vega 操作）

全部指令在專案根目錄執行。順序很重要：先把 D1 建好、資料灌好、Google 設好，最後才部署。

### 1. 建 D1 並填 database_id

```bash
npx wrangler d1 create learn
```

把輸出的 `database_id` 貼進 `wrangler.toml` 的 `database_id = "REPLACE_WITH_D1_DATABASE_ID"`，然後建表：

```bash
npx wrangler d1 migrations apply learn --remote
```

### 2. 從 Supabase 搬資料（Supabase 只讀，不會改到任何東西）

先把 service key 放進 `.env.local`（gitignore；不要 cat、不要貼到對話）：

```bash
{ grep '^SUPABASE_URL=' ~/mommywisdom-tw/.env; grep '^SUPABASE_SERVICE_ROLE_KEY=' ~/mommywisdom-tw/.env; } >> .env.local
```

匯出並寫進正式 D1（輸出資料夾含 email 等個資，放專案外）：

```bash
node scripts/migrate-from-supabase.mjs ~/learn-migration --apply remote
```

腳本最後會印每張表「Supabase 幾筆 / D1 幾筆」，全部打勾才算成功。想先在本機試：把 `remote` 換成 `local`。

### 3. Google Cloud Console：加授權重新導向 URI

1. 打開 https://console.cloud.google.com/apis/credentials ，選 Supabase 登入目前用的那個專案。
2. 在「OAuth 2.0 用戶端 ID」找到目前這個網站用的用戶端（Client ID 可到 Supabase 後台 **Authentication → Providers → Google** 比對；Client Secret 也在那裡可以抄，之後第 4 步要用）。
3. 點進去 → 「已授權的重新導向 URI」按「新增 URI」，加上：
   `https://learn.chparenting.com/api/auth/callback/google`
   （原本的 `https://lexcvcinmphkmavgswgn.supabase.co/auth/v1/callback` 先留著，30 天後再刪。本機要測真實登入的話再加 `http://localhost:8788/api/auth/callback/google`。）
4. 儲存。

### 4. 設 Pages secrets

```bash
openssl rand -base64 32
```

把產生的字串當 AUTH_SECRET，依序執行（每一個會提示你貼值）：

```bash
npx wrangler pages secret put AUTH_SECRET --project-name learn-chparenting
```

```bash
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name learn-chparenting
```

```bash
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name learn-chparenting
```

### 5. 切換前再同步一次資料，然後部署

挑冷門時段（例如深夜），先把最後這段時間新增的紀錄補進 D1（可重跑，INSERT OR REPLACE）：

```bash
node scripts/migrate-from-supabase.mjs ~/learn-migration --apply remote
```

確認 `wrangler.toml` 的 `database_id` 已填好並 commit，再說「可以 push」「可以部署」：

```bash
git push origin main
```

（push main 會觸發 GitHub Actions 部署；或手動 `npm run deploy`。GitHub secrets 裡的 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 已不再使用，可刪。）

### 6. 上線驗證

- `https://learn.chparenting.com/api/stats` 有數字、`/api/daily-challenge` 回 `{total, correct}`。
- `/login` 按「使用 Google 帳號登入」→ Google 選帳號 → 回到 `/dashboard`，右上角出現名字與頭像，舊的學習紀錄、連續天數、學習計畫都在。
- 玩一個遊戲到結算畫面 → 儀表板多一筆紀錄。
- 首頁電子報訂閱、電子書索取成功。

**使用者要重新登入一次**：舊的 Supabase session 不再有效，切換後每個人要再按一次 Google 登入（同一個 Google 帳號，紀錄會自動接回）。

### 7. 之後

- 30 天（2026-12 中）確認沒問題後：到 Supabase lexcvc 刪掉本站的 7 張表 `learning_activities`、`daily_checkins`、`user_streaks`、`weekly_schedules`、`newsletter_subscribers`、`daily_challenge_stats`、`practice_counts` 與函式 `record_checkin`（**只刪這些，lexcvc 還有記帳系統在用**）；Google Console 刪掉 Supabase 那條 redirect URI；`.env.local` 的兩行 SUPABASE 變數可刪。
- 本站 Google 登入的使用者資料在 Supabase auth.users 裡保留不動（其他站也在用同一個 auth）。
