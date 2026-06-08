// Simple client-side auth for the Showroom OS.
// Two roles: "owner" (full access) and "worker" (limited access).
// Credentials are local-only for this in-house tool running on a few devices.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "owner" | "worker";

export interface User {
  name: string;
  role: Role;
}

// Worker can only access these routes. Owner can access everything.
export const WORKER_ROUTES = [
  "/catalog",
  "/orders",
  "/deliveries",
  "/calculator",
  "/settings",
] as const;

// Default landing per role
export const HOME_FOR_ROLE: Record<Role, string> = {
  owner: "/",
  worker: "/catalog",
};

interface Credential {
  id: string;
  pass: string;
  user: User;
}

const CREDENTIALS: Credential[] = [
  { id: "owner", pass: "owner@123", user: { name: "Rohan Shah", role: "owner" } },
  { id: "worker", pass: "worker@123", user: { name: "Showroom Staff", role: "worker" } },
];

const STORAGE_KEY = "showroom_auth_user";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (id: string, pass: string) => { ok: boolean; error?: string; role?: Role };
  logout: () => void;
  canAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const login = useCallback((id: string, pass: string) => {
    const match = CREDENTIALS.find(
      (c) => c.id === id.trim().toLowerCase() && c.pass === pass,
    );
    if (!match) return { ok: false, error: "Invalid ID or password" };
    setUser(match.user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
    } catch {
      // ignore
    }
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const canAccess = useCallback(
    (path: string) => {
      if (!user) return false;
      if (user.role === "owner") return true;
      return WORKER_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, ready, login, logout, canAccess }),
    [user, ready, login, logout, canAccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
