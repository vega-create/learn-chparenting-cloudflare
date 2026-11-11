"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * 登入狀態來源：GET /api/auth/me（簽章 cookie session，由網站自己接的 Google OAuth 發出）。
 * user 物件保留 user_metadata.full_name / avatar_url 兩個欄位，既有的 Header、儀表板不用改。
 */
export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  user_metadata: { full_name?: string; avatar_url?: string };
}
export interface AppSession {
  user: AppUser;
}

interface AuthContextType {
  user: AppUser | null;
  session: AppSession | null;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  configured: true,
  signOut: async () => {},
  refresh: async () => {},
});

function toAppUser(raw: { id: string; email: string; name: string | null; avatar: string | null }): AppUser {
  return {
    ...raw,
    user_metadata: {
      full_name: raw.name ?? undefined,
      avatar_url: raw.avatar ?? undefined,
    },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" });
      const json = (await res.json()) as { user: { id: string; email: string; name: string | null; avatar: string | null } | null };
      setUser(json.user ? toAppUser(json.user) : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      // 清不掉也導回首頁，cookie 最多撐到過期
    }
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session: user ? { user } : null, loading, configured: true, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
