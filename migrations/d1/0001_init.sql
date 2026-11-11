-- learn.chparenting.com — D1 (SQLite) schema
-- 對應原 Supabase 專案 lexcvc 的 7 張學習網站表 + 新的 users 表。
-- 型別約定：
--   UUID / timestamptz / date → TEXT（timestamptz 一律存 ISO 8601 UTC，例 2026-11-11T08:00:00.000Z；date 存 YYYY-MM-DD）
--   boolean → INTEGER 0/1
--   jsonb   → TEXT（JSON 字串，程式層自動 parse / stringify）

-- 使用者（取代 Supabase auth.users；id 沿用原本的 Supabase UUID，舊學習紀錄才接得回來）
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  avatar        TEXT,
  google_sub    TEXT UNIQUE,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_login_at TEXT
);

-- 學習活動（每完成一個練習一筆）
CREATE TABLE IF NOT EXISTS learning_activities (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject          TEXT NOT NULL,
  activity_type    TEXT NOT NULL,
  activity_id      TEXT NOT NULL,
  activity_name    TEXT NOT NULL,
  score            INTEGER,
  max_score        INTEGER,
  stars            INTEGER CHECK (stars IS NULL OR stars BETWEEN 0 AND 3),
  duration_seconds INTEGER,
  metadata         TEXT NOT NULL DEFAULT '{}',
  completed_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_activities_user_date    ON learning_activities(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_subject ON learning_activities(user_id, subject);

-- 每日打卡（record_checkin 用）
CREATE TABLE IF NOT EXISTS daily_checkins (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date   TEXT NOT NULL,
  activity_count INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (user_id, checkin_date)
);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);

-- 連續學習天數快取
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id           TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak    INTEGER NOT NULL DEFAULT 0,
  longest_streak    INTEGER NOT NULL DEFAULT 0,
  last_checkin_date TEXT,
  updated_at        TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- 每週學習計畫（每人每天一列）
CREATE TABLE IF NOT EXISTS weekly_schedules (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  activities  TEXT NOT NULL DEFAULT '[]',
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (user_id, day_of_week)
);

-- 電子報 / 電子書索取名單（匿名寫入）
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  is_active     INTEGER NOT NULL DEFAULT 1,
  source        TEXT NOT NULL DEFAULT 'website'
);

-- 每日挑戰全站統計（匿名讀寫；Supabase 原表沒有 id 欄）
CREATE TABLE IF NOT EXISTS daily_challenge_stats (
  date             TEXT NOT NULL,
  subject          TEXT NOT NULL,
  question_id      TEXT NOT NULL,
  total_attempts   INTEGER NOT NULL DEFAULT 0,
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (date, question_id)
);

-- 全站練習次數計數器（固定一列 id=1）
CREATE TABLE IF NOT EXISTS practice_counts (
  id         INTEGER PRIMARY KEY,
  total      INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
INSERT OR IGNORE INTO practice_counts (id, total) VALUES (1, 0);
