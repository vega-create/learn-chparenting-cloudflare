import { test } from "node:test";
import assert from "node:assert/strict";
import { nextStreak, recordCheckin, yesterdayOf, todayUtc } from "../src/lib/checkin.ts";
import { fakeD1 } from "./fake-d1.mts";

test("date helpers", () => {
  assert.equal(yesterdayOf("2026-03-01"), "2026-02-28");
  assert.equal(yesterdayOf("2026-01-01"), "2025-12-31");
  assert.equal(todayUtc(new Date("2026-11-11T23:30:00+08:00")), "2026-11-11"); // UTC 15:30
});

test("nextStreak mirrors record_checkin()", () => {
  assert.deepEqual(nextStreak(null, "2026-11-11"), { streak: { current_streak: 1, longest_streak: 1 }, write: "insert" });
  assert.deepEqual(nextStreak({ current_streak: 4, longest_streak: 9, last_checkin_date: "2026-11-11" }, "2026-11-11"), {
    streak: { current_streak: 4, longest_streak: 9 }, write: "none",
  });
  assert.deepEqual(nextStreak({ current_streak: 4, longest_streak: 4, last_checkin_date: "2026-11-10" }, "2026-11-11"), {
    streak: { current_streak: 5, longest_streak: 5 }, write: "update",
  });
  assert.deepEqual(nextStreak({ current_streak: 4, longest_streak: 9, last_checkin_date: "2026-11-01" }, "2026-11-11"), {
    streak: { current_streak: 1, longest_streak: 9 }, write: "update",
  });
});

test("recordCheckin batches checkin upsert + streak write", async () => {
  const f = fakeD1({ first: () => ({ current_streak: 2, longest_streak: 2, last_checkin_date: "2026-11-10" }) });
  const r = await recordCheckin(f.db, "u1", "2026-11-11");
  assert.deepEqual(r, { current_streak: 3, longest_streak: 3 });
  assert.equal(f.batches.length, 1);
  assert.equal(f.batches[0].length, 2);
  assert.match(f.batches[0][0].sql, /INSERT INTO daily_checkins [\s\S]* ON CONFLICT \(user_id, checkin_date\) DO UPDATE SET activity_count = daily_checkins.activity_count \+ 1/);
  assert.deepEqual(f.batches[0][0].params.slice(1), ["u1", "2026-11-11"]);
  assert.match(f.batches[0][1].sql, /^UPDATE user_streaks SET/);
  assert.deepEqual(f.batches[0][1].params.slice(0, 3), [3, 3, "2026-11-11"]);

  const g = fakeD1({ first: () => null });
  const first = await recordCheckin(g.db, "u2", "2026-11-11");
  assert.deepEqual(first, { current_streak: 1, longest_streak: 1 });
  assert.match(g.batches[0][1].sql, /^INSERT INTO user_streaks/);

  const h = fakeD1({ first: () => ({ current_streak: 5, longest_streak: 8, last_checkin_date: "2026-11-11" }) });
  await recordCheckin(h.db, "u3", "2026-11-11");
  assert.equal(h.batches[0].length, 1); // 今天已打卡：只累加 daily_checkins
});
