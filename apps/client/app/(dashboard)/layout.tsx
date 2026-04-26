import { SessionProvider } from "@/lib/contexts/SessionProvider";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
