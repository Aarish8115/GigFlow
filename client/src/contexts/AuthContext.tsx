import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (_err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  async function login(identifier: string, password: string) {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { identifier, password });
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  }

  async function register(
    name: string,
    username: string,
    email: string,
    password: string
  ) {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        username,
        email,
        password,
      });
      setUser(res.data.user);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  async function refresh() {
    await fetchMe();
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
