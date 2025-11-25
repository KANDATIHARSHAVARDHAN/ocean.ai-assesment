import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { login as loginService, register as registerService } from "../services/auth";
import type { UserCredentials } from "../types";

type AuthContextValue = {
  token: string | null;
  loading: boolean;
  status: string;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
  setStatus: (value: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("ai-doc-token"));
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("ai-doc-token", token);
    } else {
      localStorage.removeItem("ai-doc-token");
    }
  }, [token]);

  const login = useCallback(async (credentials: UserCredentials) => {
    setLoading(true);
    try {
      const response = await loginService(credentials);
      if (response.access_token) {
        setToken(response.access_token);
        setStatus("Logged in successfully");
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      const errorMsg = (error as Error).message || "Login failed";
      setStatus(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: UserCredentials) => {
    setLoading(true);
    try {
      await registerService(credentials);
      setStatus("Registration successful. Please log in.");
      setToken(null);
    } catch (error) {
      const errorMsg = (error as Error).message || "Registration failed";
      setStatus(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStatus("");
  }, []);

  const value: AuthContextValue = {
    token,
    loading,
    status,
    login,
    register,
    logout,
    setStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}


