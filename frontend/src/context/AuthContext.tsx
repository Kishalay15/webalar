import { createContext, useContext, useState, type ReactNode } from "react";
import instance from "../api/axios";
import type { User, AuthContextType } from "../types/models.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (email: string, password: string) => {
    const res = await instance.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
    setToken(res.data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await instance.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data);
    setToken(res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
