"use client";
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Demo() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["demo"],
    queryFn: () => fetchTransactions(),
    retry: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  console.log({ data });
  return (
    <div>
      Hello, dashboard
      <Button onClick={() => refetch()}>Refresh</Button>
    </div>
  );
}
