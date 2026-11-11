/** 極簡的 D1 假物件：記錄 prepare/bind 的 SQL 與參數，回傳預先設定的結果 */
import type { D1Like, D1PreparedStatementLike } from "../src/lib/d1-compat.ts";

export type Call = { sql: string; params: unknown[] };

export function fakeD1(opts: { first?: (c: Call) => unknown; all?: (c: Call) => unknown[]; runError?: (c: Call) => Error | null } = {}) {
  const calls: Call[] = [];
  const batches: Call[][] = [];
  function stmt(sql: string): D1PreparedStatementLike {
    const call: Call = { sql, params: [] };
    const s: D1PreparedStatementLike & { call: Call } = {
      call,
      bind(...values: unknown[]) { call.params = values; return s; },
      async first<T>() { calls.push(call); return (opts.first?.(call) ?? null) as T | null; },
      async all<T>() { calls.push(call); return { results: (opts.all?.(call) ?? []) as T[] }; },
      async run() { calls.push(call); const e = opts.runError?.(call); if (e) throw e; return { meta: { changes: 1 } }; },
    };
    return s;
  }
  const db: D1Like = {
    prepare: stmt,
    async batch(statements) {
      const b = statements.map((s) => (s as unknown as { call: Call }).call);
      batches.push(b);
      calls.push(...b);
      return [];
    },
  };
  return { db, calls, batches };
}
