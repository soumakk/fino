"use client";
import { createContext, useContext } from "react";

type Session = { id: string; email: string; name: string } | null;

const SessionContext = createContext<Session>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
