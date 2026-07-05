-- =============================================================
-- RLS 補漏 SQL — 貼進 Supabase SQL Editor 執行一次即可
--
-- 背景:supabase-schema.sql 裡的 5 個用戶表已有正確 RLS + policy,
-- 但後來在 dashboard 手動建的 2 個統計表沒有 policy。
-- 上次直接開 RLS 開關 → 沒 policy = 全部拒絕 → 網站功能壞掉。
-- 這份 SQL 會「先建好放行規則、再開鎖」,執行後網站功能不受影響。
--
-- 可重複執行(idempotent),跑兩次也不會壞。
-- =============================================================

-- -------------------------------------------------------------
-- 1. daily_challenge_stats — 每日挑戰全站統計(匿名讀寫)
--    API route 用 anon key 做 SELECT / INSERT / UPDATE
-- -------------------------------------------------------------
ALTER TABLE daily_challenge_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read challenge stats" ON daily_challenge_stats;
CREATE POLICY "Public read challenge stats" ON daily_challenge_stats
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert challenge stats" ON daily_challenge_stats;
CREATE POLICY "Public insert challenge stats" ON daily_challenge_stats
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update challenge stats" ON daily_challenge_stats;
CREATE POLICY "Public update challenge stats" ON daily_challenge_stats
  FOR UPDATE USING (true) WITH CHECK (true);

-- -------------------------------------------------------------
-- 2. practice_counts — 全站練習次數計數器(id=1 單列)
--    track-practice 需要 UPDATE,stats 需要 SELECT。
--    不給 INSERT / DELETE:計數列已存在,沒人需要新增或刪除。
-- -------------------------------------------------------------
ALTER TABLE practice_counts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read practice counts" ON practice_counts;
CREATE POLICY "Public read practice counts" ON practice_counts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public update practice counts" ON practice_counts;
CREATE POLICY "Public update practice counts" ON practice_counts
  FOR UPDATE USING (true) WITH CHECK (true);

-- -------------------------------------------------------------
-- 3. newsletter_subscribers — 確認訂閱名單鎖好
--    只允許 INSERT(報名)。沒有 SELECT policy = 任何人都
--    「不能」用網站的 anon key 撈走 email 名單(最重要的保護)。
--    註:程式碼已改為純 INSERT(不再 upsert),所以不需要 UPDATE policy。
-- -------------------------------------------------------------
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- =============================================================
-- 驗證(執行完看這段輸出):每個表應該 rowsecurity = true
-- 且 policy 數量:daily_challenge_stats=3, practice_counts=2,
-- newsletter_subscribers=1
-- =============================================================
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('daily_challenge_stats', 'practice_counts', 'newsletter_subscribers');

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('daily_challenge_stats', 'practice_counts', 'newsletter_subscribers')
ORDER BY tablename, policyname;
