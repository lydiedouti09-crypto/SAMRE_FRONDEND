import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  adminAuthApi,
  clearAdminToken,
  getAdminToken,
  setAdminToken,
  type User,
} from "@/lib/api";

type AdminAuthContextValue = {
  adminUser: User | null;
  adminLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<User>;
  adminLogout: (redirectTo?: string) => void;
  refreshAdmin: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      setAdminUser(null);
      setAdminLoading(false);
      return;
    }
    try {
      const me = await adminAuthApi.me();
      if (me.role !== "admin") {
        clearAdminToken();
        setAdminUser(null);
      } else {
        setAdminUser(me);
      }
    } catch {
      clearAdminToken();
      setAdminUser(null);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAdmin();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "samre_admin_token") {
        refreshAdmin();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshAdmin]);

  const adminLogin = async (email: string, password: string): Promise<User> => {
    const { token } = await adminAuthApi.login(email, password);
    setAdminToken(token);
    const me = await adminAuthApi.me(token);

    if (me.role !== "admin") {
      clearAdminToken();
      throw new Error(
        "Accès refusé : Ce compte ne dispose pas des privilèges administrateur."
      );
    }

    setAdminUser(me);
    return me;
  };

  const adminLogout = (redirectTo: string = "/admin/login") => {
    clearAdminToken();
    setAdminUser(null);
    navigate(redirectTo, { replace: true });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminLoading,
        adminLogin,
        adminLogout,
        refreshAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    return {
      adminUser: null,
      adminLoading: false,
      adminLogin: async (email, password) => {
        const { token } = await adminAuthApi.login(email, password);
        setAdminToken(token);
        const me = await adminAuthApi.me(token);
        if (me.role !== "admin") {
          clearAdminToken();
          throw new Error(
            "Accès refusé : Ce compte ne dispose pas des privilèges administrateur."
          );
        }
        return me;
      },
      adminLogout: () => {
        clearAdminToken();
        window.location.href = "/admin/login";
      },
      refreshAdmin: async () => {},
    };
  }
  return ctx;
}
