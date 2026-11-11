import { test } from "node:test";
import assert from "node:assert/strict";
import { D1Client, QueryBuilder, encodeValue, decodeRow } from "../src/lib/d1-compat.ts";
import { fakeD1 } from "./fake-d1.mts";

test("select + filters + order + range compiles to parameterised SQL", () => {
  const q = new QueryBuilder(null, "learning_activities")
    .select("*", { count: "exact" })
    .eq("user_id", "u1")
    .gte("completed_at", "2026-01-01T00:00:00")
    .order("completed_at", { ascending: false })
    .range(20, 39);
  const c = q.compile();
  assert.equal(c.statements[0].sql, 'SELECT * FROM "learning_activities" WHERE "user_id" = ? AND "completed_at" >= ? ORDER BY "completed_at" DESC LIMIT ? OFFSET ?');
  assert.deepEqual(c.statements[0].params, ["u1", "2026-01-01T00:00:00", 20, 20]);
  assert.equal(c.count?.sql, 'SELECT COUNT(*) AS n FROM "learning_activities" WHERE "user_id" = ? AND "completed_at" >= ?');
});

test("select specific columns quotes identifiers and rejects injection", () => {
  const q = new QueryBuilder(null, "user_streaks").select("current_streak, longest_streak").eq("user_id", "u1");
  assert.equal(q.compile().statements[0].sql, 'SELECT "current_streak", "longest_streak" FROM "user_streaks" WHERE "user_id" = ?');
  assert.throws(() => new QueryBuilder(null, "x").select("a; DROP TABLE y").compile());
  assert.throws(() => new QueryBuilder(null, 'x"').compile());
});

test("insert fills uuid id and encodes json / bool", () => {
  const q = new QueryBuilder(null, "learning_activities").insert({ user_id: "u1", subject: "gept", metadata: { a: 1 }, score: null });
  const s = q.compile().statements[0];
  assert.equal(s.sql, 'INSERT INTO "learning_activities" ("user_id", "subject", "metadata", "score", "id") VALUES (?, ?, ?, ?, ?)');
  assert.equal(s.params[2], '{"a":1}');
  assert.equal(s.params[3], null);
  assert.match(String(s.params[4]), /^[0-9a-f-]{36}$/);
  assert.equal(encodeValue("newsletter_subscribers", "is_active", true), 1);
  assert.equal(encodeValue("newsletter_subscribers", "is_active", false), 0);
  assert.equal(encodeValue("x", "d", new Date("2026-01-02T03:04:05Z")), "2026-01-02T03:04:05.000Z");
});

test("upsert with onConflict becomes ON CONFLICT DO UPDATE", () => {
  const q = new QueryBuilder(null, "weekly_schedules").upsert(
    { user_id: "u1", day_of_week: 2, activities: [{ a: 1 }], updated_at: "t" },
    { onConflict: "user_id,day_of_week" },
  );
  const s = q.compile().statements[0];
  assert.equal(
    s.sql,
    'INSERT INTO "weekly_schedules" ("user_id", "day_of_week", "activities", "updated_at", "id") VALUES (?, ?, ?, ?, ?) ON CONFLICT ("user_id", "day_of_week") DO UPDATE SET "activities" = excluded."activities", "updated_at" = excluded."updated_at"',
  );
  assert.equal(s.params[2], '[{"a":1}]');
});

test("update / delete require a filter", () => {
  const u = new QueryBuilder(null, "practice_counts").update({ total: 5 }).eq("id", 1).compile().statements[0];
  assert.equal(u.sql, 'UPDATE "practice_counts" SET "total" = ? WHERE "id" = ?');
  assert.deepEqual(u.params, [5, 1]);
  const d = new QueryBuilder(null, "weekly_schedules").delete().eq("user_id", "u").eq("day_of_week", 3).compile().statements[0];
  assert.equal(d.sql, 'DELETE FROM "weekly_schedules" WHERE "user_id" = ? AND "day_of_week" = ?');
  assert.throws(() => new QueryBuilder(null, "x").update({ a: 1 }).compile());
  assert.throws(() => new QueryBuilder(null, "x").delete().compile());
});

test("decodeRow parses json and bool columns", () => {
  assert.deepEqual(decodeRow("weekly_schedules", { day_of_week: 1, activities: "[1,2]" }), { day_of_week: 1, activities: [1, 2] });
  assert.deepEqual(decodeRow("newsletter_subscribers", { is_active: 1 }), { is_active: true });
  assert.deepEqual(decodeRow("learning_activities", { metadata: "{bad" }), { metadata: "{bad" });
});

test("executes against D1: single / list+count / head count / unique error → 23505", async () => {
  const f = fakeD1({
    first: (c) => (c.sql.startsWith("SELECT COUNT") ? { n: 7 } : { total_attempts: 3, correct_attempts: 1 }),
    all: () => [{ id: "a", metadata: '{"x":1}' }],
    runError: (c) => (c.sql.startsWith("INSERT") ? new Error("D1_ERROR: UNIQUE constraint failed: newsletter_subscribers.email") : null),
  });
  const db = new D1Client(f.db);

  const one = await db.from("daily_challenge_stats").select("total_attempts, correct_attempts").eq("date", "2026-11-11").single();
  assert.deepEqual(one.data, { total_attempts: 3, correct_attempts: 1 });
  assert.equal(f.calls.at(-1)?.sql, 'SELECT "total_attempts", "correct_attempts" FROM "daily_challenge_stats" WHERE "date" = ? LIMIT ?');

  const list = await db.from("learning_activities").select("*", { count: "exact" }).eq("user_id", "u").limit(5);
  assert.equal(list.count, 7);
  assert.deepEqual(list.data, [{ id: "a", metadata: { x: 1 } }]);

  const head = await db.from("learning_activities").select("*", { count: "exact", head: true });
  assert.equal(head.count, 7);
  assert.equal(head.data, null);

  const dup = await db.from("newsletter_subscribers").insert({ email: "a@b.c" });
  assert.equal(dup.error?.code, "23505");

  const miss = await db.from("user_streaks").select("*").eq("user_id", "nobody").maybeSingle();
  assert.equal(miss.error, null);

  const noDb = await new D1Client(null).from("x").select("*");
  assert.equal(noDb.error?.code, "NO_DB");
});
