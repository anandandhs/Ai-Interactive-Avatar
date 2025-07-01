"use client";
import React, { createContext, ReactNode, useContext } from "react";
import { useAuth } from "../logic";
import { UseAuthReturn } from "../logic/useAuth";

const AuthContext = createContext<UseAuthReturn | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
