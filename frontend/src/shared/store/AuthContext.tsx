import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { loginRequest, meRequest, type AuthUser } from "../../features/auth/services/auth";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const ACCESS_TOKEN_KEY = "rewrite_access_token";
const USER_KEY = "rewrite_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedToken) {
      setIsAuthReady(true);
      return;
    }

    setToken(storedToken);
    setUser(storedUser ? (JSON.parse(storedUser) as AuthUser) : null);

    meRequest(storedToken)
      .then((nextUser) => {
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      })
      .catch(() => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsAuthReady(true);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest({ email, password });
    localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthReady,
      login,
      logout,
    }),
    [token, user, isAuthReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
