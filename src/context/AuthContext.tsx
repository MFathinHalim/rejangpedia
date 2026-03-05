"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: userType;
  token: string;
  isLoggedIn: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/user/session/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();
    const newToken = data.token;
    if (!newToken) return;

    setToken(newToken);

    const check = await fetch("/api/user/session/token/check", {
      method: "POST",
      headers: { Authorization: `Bearer ${newToken}` },
    });

    if (!check.ok) return;

    const userData = await check.json();
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await fetch("/api/user/session/logout", {
      method: "DELETE",
    });
    setUser(null);
    setToken("");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
