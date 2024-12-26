"use client";

import { AuthContext } from "@/context/AuthContext";
import { Session } from "lucia";
import React, { createContext, useContext } from "react";
interface User {
  id: string;
  mongoId: string;
  name: string;
  email: string;
  role: string;
  avatarurl: string;
}
interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
