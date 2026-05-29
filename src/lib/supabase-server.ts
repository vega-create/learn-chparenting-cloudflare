// Pure-fetch Supabase client — zero npm SDK dependency.
//
// We previously used @supabase/supabase-js (and before that @supabase/auth-helpers-nextjs),
// but both pulled in transitive deps that try to `require("async_hooks")`. Cloudflare's
// next-on-pages bundler can't resolve that module even with the nodejs_compat flag set,
// so every /api/* route 500'd with: No such module "async_hooks".
//
// Since all we need is plain table reads/writes against the public REST endpoint, we
// implement a tiny client over fetch(). This works in any runtime (edge, node, browser).

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lexcvcinmphkmavgswgn.supabase.co";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleGN2Y2lubXBoa21hdmdzd2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEwODksImV4cCI6MjA4MjY3NzA4OX0.Ur2XPKbWU0Bfm87otq4uM_33cyWRi267nBbAEZtjcis";

type QueryFilter = { col: string; op: string; val: string | number };

// Using `any` for the default data shape — Supabase REST returns dynamic JSON
// and the callers want to access fields like `data.total` without ceremony.
// eslint-disable-next-line
type Result<T = any> = {
  data: T | null;
  error: { code?: string; message: string } | null;
};

class FetchTable {
  private countMode: "exact" | null = null;
  private headOnly = false;
  private pendingUpdate: Record<string, unknown> | null = null;

  constructor(
    private table: string,
    private filters: QueryFilter[] = [],
    private selectCols = "*",
  ) {}

  select(cols = "*", options: { count?: "exact"; head?: boolean } = {}) {
    this.selectCols = cols;
    if (options.count) this.countMode = options.count;
    if (options.head) this.headOnly = true;
    return this;
  }

  eq(col: string, val: string | number) {
    this.filters.push({ col, op: "eq", val });
    return this;
  }

  update(row: Record<string, unknown>) {
    this.pendingUpdate = row;
    return this;
  }

  // eslint-disable-next-line
  async single<T = any>(): Promise<Result<T>> {
    const url = this.buildUrl();
    const res = await fetch(url, {
      headers: this.headers({ "Accept": "application/vnd.pgrst.object+json" }),
    });
    return this.parse<T>(res);
  }

  // Allow `await table.select(...)` / `await table.update(...).eq(...)` directly
  then<TResult1 = Result<unknown[]> & { count?: number }, TResult2 = never>(
    onfulfilled?: (
      value: Result<unknown[]> & { count?: number },
    ) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>,
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }

  private async exec(): Promise<Result<unknown[]> & { count?: number }> {
    // PATCH (update)
    if (this.pendingUpdate) {
      const params = new URLSearchParams();
      for (const f of this.filters) params.append(f.col, `${f.op}.${f.val}`);
      const url = `${SUPABASE_URL}/rest/v1/${this.table}?${params.toString()}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: this.headers({
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        }),
        body: JSON.stringify(this.pendingUpdate),
      });
      return this.parse(res);
    }

    // GET (select / count)
    const url = this.buildUrl();
    const headers: Record<string, string> = this.headers();
    if (this.countMode === "exact") {
      headers["Prefer"] = "count=exact";
    }
    const fetchInit: RequestInit = {
      method: this.headOnly ? "HEAD" : "GET",
      headers,
    };
    const res = await fetch(url, fetchInit);
    const result = await this.parse<unknown[]>(res);
    if (this.countMode === "exact") {
      const range = res.headers.get("content-range"); // "0-9/123"
      const count = range ? parseInt(range.split("/")[1] || "0", 10) : 0;
      return { ...result, count };
    }
    return result;
  }

  async insert(row: Record<string, unknown>): Promise<Result> {
    const url = `${SUPABASE_URL}/rest/v1/${this.table}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify(row),
    });
    return this.parse(res);
  }

  async upsert(
    row: Record<string, unknown>,
    options: { onConflict?: string } = {},
  ): Promise<Result> {
    const params = new URLSearchParams();
    if (options.onConflict) params.set("on_conflict", options.onConflict);
    const qs = params.toString();
    const url = `${SUPABASE_URL}/rest/v1/${this.table}${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers({
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify(row),
    });
    return this.parse(res);
  }

  private buildUrl(): string {
    const params = new URLSearchParams({ select: this.selectCols });
    for (const f of this.filters) {
      params.append(f.col, `${f.op}.${f.val}`);
    }
    return `${SUPABASE_URL}/rest/v1/${this.table}?${params.toString()}`;
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      ...extra,
    };
  }

  private async parse<T>(res: Response): Promise<Result<T>> {
    if (res.status === 204 || res.status === 201) {
      return { data: null, error: null };
    }
    const text = await res.text();
    if (!res.ok) {
      let code: string | undefined;
      try {
        const j = JSON.parse(text);
        code = j.code;
      } catch {}
      return { data: null, error: { code, message: text || res.statusText } };
    }
    try {
      return { data: text ? (JSON.parse(text) as T) : null, error: null };
    } catch (e) {
      return { data: null, error: { message: `Parse failed: ${e}` } };
    }
  }
}

class FetchClient {
  from(table: string) {
    return new FetchTable(table);
  }
}

export async function createServerSupabaseClient() {
  return new FetchClient();
}
