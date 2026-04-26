"use client";

import { useSession } from "@/lib/contexts/SessionProvider";

const DashboardTitle = () => {
  const session = useSession();
  return (
    <div>
      <h2 className="font-semibold text-2xl">
        Welcome, {session?.name?.split(" ")[0]}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Here's your financial summary for this month
      </p>
    </div>
  );
};

export default DashboardTitle;
