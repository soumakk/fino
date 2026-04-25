export async function fetchTransactions() {
  const res = await fetch("/api/transaction", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw Error(data?.message);
  }

  return data;
}
