import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, registerApi } from "../services/api";

type AuthContextType = {
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  // read once on mount
  useEffect(() => {
    const token = localStorage.getItem("xd_token");
    setIsAuthed(!!token);
  }, []);

  const value = useMemo(
    () => ({
      isAuthed,
      login: async (email: string, password: string) => {
        const result = await loginApi(email, password);
        localStorage.setItem("xd_token", result.token);
        localStorage.setItem("xd_isAuthed", "true");
        setIsAuthed(true);
      },
      register: async (email: string, password: string, username: string) => {
        const result = await registerApi(email, password, username);
        localStorage.setItem("xd_token", result.token);
        localStorage.setItem("xd_isAuthed", "true");
        setIsAuthed(true);
      },
      logout: () => {
        localStorage.removeItem("xd_token");
        localStorage.removeItem("xd_isAuthed");
        setIsAuthed(false);
      },
    }),
    [isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
