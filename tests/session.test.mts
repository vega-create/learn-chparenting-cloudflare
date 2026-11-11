import { test } from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, readSession, signPayload, verifyToken, parseCookies, sha256base64url, base64url, SESSION_TTL_SECONDS } from "../src/lib/session.ts";

const SECRET = "test-secret-not-for-production";
const user = { id: "11111111-2222-3333-4444-555555555555", email: "kid@example.com", name: "小明", avatar: null };

test("sign → verify round trip, tampering and wrong secret fail", async () => {
  const token = await signPayload({ a: 1, b: "中文" }, SECRET);
  assert.deepEqual(await verifyToken(token, SECRET), { a: 1, b: "中文" });
  assert.equal(await verifyToken(token, "other"), null);
  const [body, sig] = token.split(".");
  assert.equal(await verifyToken(`${body}x.${sig}`, SECRET), null);
  assert.equal(await verifyToken(`${body}.${sig.slice(0, -2)}AA`, SECRET), null);
  assert.equal(await verifyToken("garbage", SECRET), null);
  assert.equal(await verifyToken(undefined, SECRET), null);
});

test("session token carries user and expires after 30 days", async () => {
  const now = new Date("2026-11-11T00:00:00Z");
  const token = await createSessionToken(user, SECRET, now);
  const s = await readSession(token, SECRET, now);
  assert.equal(s?.id, user.id);
  assert.equal(s?.email, user.email);
  assert.equal(s?.name, "小明");
  assert.equal(s!.exp - s!.iat, SESSION_TTL_SECONDS);
  assert.equal(await readSession(token, SECRET, new Date(now.getTime() + 29 * 86400 * 1000)) !== null, true);
  assert.equal(await readSession(token, SECRET, new Date(now.getTime() + 31 * 86400 * 1000)), null);
});

test("helpers: cookies, base64url, PKCE S256", async () => {
  assert.deepEqual(parseCookies("a=1; learn_session=abc.def; x=%E4%B8%AD"), { a: "1", learn_session: "abc.def", x: "中" });
  assert.deepEqual(parseCookies(null), {});
  assert.equal(base64url("hello"), "aGVsbG8");
  // RFC 7636 appendix B 範例
  assert.equal(await sha256base64url("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"), "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
});
