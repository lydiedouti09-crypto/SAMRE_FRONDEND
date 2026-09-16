"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, clearToken, getToken, setToken, type User } from "@/lib/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
  }) => Promise<void>;
  logout: (redirectTo?: string | unknown) => void;
  refresh: () => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string): Promise<User> => {
    const { token } = await authApi.login(email, password);
    setToken(token);
    const me = await authApi.me();
    setUser(me);
    return me;
  };

  const register = async (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
  }) => {
    await authApi.register(data);
    // Le backend ne renvoie pas de token à l'inscription :
    // on enchaîne avec un login pour récupérer la session.
    await login(data.email, data.password);
  };

  const logout = (redirectTo?: string | unknown) => {
    clearToken();
    setUser(null);
    const destination = typeof redirectTo === "string" ? redirectTo : "/connexion";
    router.push(destination);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
