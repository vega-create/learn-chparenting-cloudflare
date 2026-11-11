/**
 * 薄的 supabase-js 相容層，跑在 Cloudflare D1（SQLite）上。
 *
 * 支援既有程式用到的鏈式寫法：
 *   db.from(t).select(cols, { count, head }).eq().gte().lte().order().limit().range().single()
 *   db.from(t).insert(row | rows) / .upsert(row, { onConflict }) / .update(row).eq() / .delete().eq()
 *
 * 型別轉換（依表／欄位設定於 COLUMN_TYPES）：
 *   json → 寫入 JSON.stringify、讀出 JSON.parse
 *   bool → 寫入 0/1、讀出 true/false
 *   Date → ISO 字串
 * UUID 主鍵的表在 insert 沒給 id 時自動補 crypto.randomUUID()。
 * 唯一鍵衝突回傳 error.code = "23505"（與 Postgres 相同，既有路由靠這個判斷重複 email）。
 *
 * 這個檔案不 import 任何 Cloudflare / Next 模組，方便用 node:test 直接測。
 */

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta?: { changes?: number } }>;
}
export interface D1Like {
  prepare(sql: string): D1PreparedStatementLike;
  batch<T = unknown>(statements: D1PreparedStatementLike[]): Promise<T[]>;
}

export type ColType = "json" | "bool";
export const COLUMN_TYPES: Record<string, Record<string, ColType>> = {
  learning_activities: { metadata: "json" },
  weekly_schedules: { activities: "json" },
  newsletter_subscribers: { is_active: "bool" },
};
/** 主鍵是 UUID 文字的表：insert 沒帶 id 就自動產生 */
export const UUID_ID_TABLES = new Set([
  "users",
  "learning_activities",
  "daily_checkins",
  "weekly_schedules",
  "newsletter_subscribers",
]);

export type DbError = { code?: string; message: string };
export type Result<T> = { data: T | null; error: DbError | null; count?: number };
export type Row = Record<string, unknown>;
export type Statement = { sql: string; params: unknown[] };

type FilterOp = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "is" | "like";
type Filter = { col: string; op: FilterOp; val: unknown };
type Mode = "select" | "insert" | "upsert" | "update" | "delete";

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;
function ident(name: string): string {
  if (!IDENT.test(name)) throw new Error(`Invalid identifier: ${name}`);
  return `"${name}"`;
}

export function encodeValue(table: string, col: string, v: unknown): unknown {
  const t = COLUMN_TYPES[table]?.[col];
  if (v === undefined) return undefined;
  if (v === null) return null;
  if (v instanceof Date) return v.toISOString();
  if (t === "json") return typeof v === "string" ? v : JSON.stringify(v);
  if (t === "bool") return v ? 1 : 0;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "object") return JSON.stringify(v);
  return v;
}

export function decodeRow<T extends Row = Row>(table: string, row: Row): T {
  const types = COLUMN_TYPES[table];
  if (!types) return row as T;
  const out: Row = { ...row };
  for (const [col, t] of Object.entries(types)) {
    if (!(col in out)) continue;
    const v = out[col];
    if (t === "json" && typeof v === "string") {
      try { out[col] = JSON.parse(v); } catch { /* 保留原字串 */ }
    } else if (t === "bool" && v !== null && v !== undefined) {
      out[col] = v === 1 || v === true || v === "1" || v === "true";
    }
  }
  return out as T;
}

function toDbError(e: unknown): DbError {
  const message = e instanceof Error ? e.message : String(e);
  if (/UNIQUE constraint failed/i.test(message)) return { code: "23505", message };
  if (/CHECK constraint failed/i.test(message)) return { code: "23514", message };
  return { code: "D1", message };
}

export class QueryBuilder<R extends Row = Row> {
  private mode: Mode = "select";
  private selectCols = "*";
  private filters: Filter[] = [];
  private orders: { col: string; asc: boolean }[] = [];
  private limitN: number | null = null;
  private offsetN: number | null = null;
  private countMode: "exact" | null = null;
  private headOnly = false;
  private singleMode: "single" | "maybe" | null = null;
  private rows: Row[] = [];
  private conflictCols: string[] = [];
  private readonly db: D1Like | null;
  readonly table: string;

  constructor(db: D1Like | null, table: string) {
    this.db = db;
    this.table = table;
    ident(table);
  }

  // ── 查詢 ───────────────────────────────────────────
  select(cols = "*", options: { count?: "exact"; head?: boolean } = {}) {
    this.selectCols = cols;
    if (options.count) this.countMode = options.count;
    if (options.head) this.headOnly = true;
    return this;
  }
  eq(col: string, val: unknown) { return this.where(col, "eq", val); }
  neq(col: string, val: unknown) { return this.where(col, "neq", val); }
  gt(col: string, val: unknown) { return this.where(col, "gt", val); }
  gte(col: string, val: unknown) { return this.where(col, "gte", val); }
  lt(col: string, val: unknown) { return this.where(col, "lt", val); }
  lte(col: string, val: unknown) { return this.where(col, "lte", val); }
  like(col: string, val: string) { return this.where(col, "like", val); }
  in(col: string, vals: unknown[]) { return this.where(col, "in", vals); }
  is(col: string, val: null | boolean) { return this.where(col, "is", val); }
  private where(col: string, op: FilterOp, val: unknown) {
    ident(col);
    this.filters.push({ col, op, val });
    return this;
  }
  order(col: string, options: { ascending?: boolean } = {}) {
    ident(col);
    this.orders.push({ col, asc: options.ascending !== false });
    return this;
  }
  limit(n: number) { this.limitN = n; return this; }
  range(from: number, to: number) { this.offsetN = from; this.limitN = to - from + 1; return this; }
  single() { this.singleMode = "single"; this.limitN = 1; return this.exec() as unknown as Promise<Result<R>>; }
  maybeSingle() { this.singleMode = "maybe"; this.limitN = 1; return this.exec() as unknown as Promise<Result<R>>; }

  // ── 寫入 ───────────────────────────────────────────
  insert(row: Row | Row[]) { this.mode = "insert"; this.rows = Array.isArray(row) ? row : [row]; return this; }
  upsert(row: Row | Row[], options: { onConflict?: string } = {}) {
    this.mode = "upsert";
    this.rows = Array.isArray(row) ? row : [row];
    this.conflictCols = (options.onConflict ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    this.conflictCols.forEach(ident);
    return this;
  }
  update(row: Row) { this.mode = "update"; this.rows = [row]; return this; }
  delete() { this.mode = "delete"; return this; }

  // ── thenable：讓 `await db.from(...).select(...)` 直接拿到 Result ──
  then<T1 = Result<R[]>, T2 = never>(
    onfulfilled?: (value: Result<R[]>) => T1 | PromiseLike<T1>,
    onrejected?: (reason: unknown) => T2 | PromiseLike<T2>,
  ): Promise<T1 | T2> {
    return (this.exec() as Promise<Result<R[]>>).then(onfulfilled, onrejected);
  }

  // ── SQL 編譯（純函式，測試用）────────────────────────
  private whereSql(): Statement {
    const parts: string[] = [];
    const params: unknown[] = [];
    for (const f of this.filters) {
      const c = ident(f.col);
      const v = encodeValue(this.table, f.col, f.val);
      switch (f.op) {
        case "eq": parts.push(`${c} = ?`); params.push(v); break;
        case "neq": parts.push(`${c} <> ?`); params.push(v); break;
        case "gt": parts.push(`${c} > ?`); params.push(v); break;
        case "gte": parts.push(`${c} >= ?`); params.push(v); break;
        case "lt": parts.push(`${c} < ?`); params.push(v); break;
        case "lte": parts.push(`${c} <= ?`); params.push(v); break;
        case "like": parts.push(`${c} LIKE ?`); params.push(v); break;
        case "in": {
          const vals = Array.isArray(f.val) ? f.val : [f.val];
          if (vals.length === 0) { parts.push("0"); break; }
          parts.push(`${c} IN (${vals.map(() => "?").join(", ")})`);
          params.push(...vals.map((x) => encodeValue(this.table, f.col, x)));
          break;
        }
        case "is":
          if (f.val === null) parts.push(`${c} IS NULL`);
          else { parts.push(`${c} IS ?`); params.push(f.val ? 1 : 0); }
          break;
      }
    }
    return { sql: parts.length ? ` WHERE ${parts.join(" AND ")}` : "", params };
  }

  private selectList(): string {
    if (this.selectCols.trim() === "*") return "*";
    return this.selectCols.split(",").map((s) => ident(s.trim())).join(", ");
  }

  compile(): { statements: Statement[]; count?: Statement } {
    const t = ident(this.table);
    const where = this.whereSql();
    switch (this.mode) {
      case "select": {
        let sql = `SELECT ${this.selectList()} FROM ${t}${where.sql}`;
        if (this.orders.length) sql += ` ORDER BY ${this.orders.map((o) => `${ident(o.col)} ${o.asc ? "ASC" : "DESC"}`).join(", ")}`;
        const params = [...where.params];
        if (this.limitN != null) { sql += ` LIMIT ?`; params.push(this.limitN); }
        if (this.offsetN != null) { sql += ` OFFSET ?`; params.push(this.offsetN); }
        const count = this.countMode ? { sql: `SELECT COUNT(*) AS n FROM ${t}${where.sql}`, params: where.params } : undefined;
        return { statements: this.headOnly ? [] : [{ sql, params }], count };
      }
      case "insert":
      case "upsert": {
        const statements = this.rows.map((raw) => {
          const row: Row = { ...raw };
          if (UUID_ID_TABLES.has(this.table) && row.id == null) row.id = crypto.randomUUID();
          const cols = Object.keys(row).filter((k) => row[k] !== undefined);
          cols.forEach(ident);
          const params = cols.map((k) => encodeValue(this.table, k, row[k]));
          let sql = `INSERT ${this.mode === "upsert" && this.conflictCols.length === 0 ? "OR REPLACE " : ""}INTO ${t} (${cols.map(ident).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
          if (this.mode === "upsert" && this.conflictCols.length) {
            const updates = cols.filter((c) => !this.conflictCols.includes(c) && c !== "id");
            sql += ` ON CONFLICT (${this.conflictCols.map(ident).join(", ")}) DO UPDATE SET ${
              updates.length ? updates.map((c) => `${ident(c)} = excluded.${ident(c)}`).join(", ") : `${ident(this.conflictCols[0])} = excluded.${ident(this.conflictCols[0])}`
            }`;
          }
          return { sql, params };
        });
        return { statements };
      }
      case "update": {
        if (!this.filters.length) throw new Error("update() without a filter is not allowed");
        const row = this.rows[0] ?? {};
        const cols = Object.keys(row).filter((k) => row[k] !== undefined);
        if (!cols.length) return { statements: [] };
        cols.forEach(ident);
        const sql = `UPDATE ${t} SET ${cols.map((c) => `${ident(c)} = ?`).join(", ")}${where.sql}`;
        return { statements: [{ sql, params: [...cols.map((c) => encodeValue(this.table, c, row[c])), ...where.params] }] };
      }
      case "delete": {
        if (!this.filters.length) throw new Error("delete() without a filter is not allowed");
        return { statements: [{ sql: `DELETE FROM ${t}${where.sql}`, params: where.params }] };
      }
    }
  }

  // ── 執行 ───────────────────────────────────────────
  private async exec(): Promise<Result<R[] | R>> {
    let compiled: ReturnType<QueryBuilder["compile"]>;
    try { compiled = this.compile(); } catch (e) { return { data: null, error: toDbError(e) }; }
    if (!this.db) return { data: null, error: { code: "NO_DB", message: "D1 binding DB not available" } };
    try {
      if (this.mode === "select") {
        const stmt = compiled.statements[0];
        const countStmt = compiled.count;
        let count: number | undefined;
        if (countStmt) {
          const c = await this.db.prepare(countStmt.sql).bind(...countStmt.params).first<{ n: number }>();
          count = Number(c?.n ?? 0);
        }
        if (!stmt) return { data: null, error: null, count };
        if (this.singleMode) {
          const row = await this.db.prepare(stmt.sql).bind(...stmt.params).first<Row>();
          if (!row) {
            return this.singleMode === "maybe"
              ? { data: null, error: null, count }
              : { data: null, error: { code: "PGRST116", message: "The result contains 0 rows" }, count };
          }
          return { data: decodeRow<R>(this.table, row), error: null, count };
        }
        const { results } = await this.db.prepare(stmt.sql).bind(...stmt.params).all<Row>();
        return { data: results.map((r) => decodeRow<R>(this.table, r)), error: null, count };
      }
      const prepared = compiled.statements.map((s) => this.db!.prepare(s.sql).bind(...s.params));
      if (prepared.length === 1) await prepared[0].run();
      else if (prepared.length > 1) await this.db.batch(prepared);
      return { data: null, error: null };
    } catch (e) {
      return { data: null, error: toDbError(e) };
    }
  }
}

export class D1Client {
  private readonly db: D1Like | null;
  constructor(db: D1Like | null) { this.db = db; }
  // eslint-disable-next-line
  from<R extends Row = any>(table: string) { return new QueryBuilder<R>(this.db, table); }
  /** 直接拿 D1（打卡等需要 batch 的邏輯用） */
  get raw(): D1Like | null { return this.db; }
}
