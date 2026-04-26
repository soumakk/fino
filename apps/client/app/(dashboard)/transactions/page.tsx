import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TransactionTable from "@/modules/transactions/components/TransactionsTable";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 p-4 pt-0">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            <header className="mt-6">
              <h2 className="font-semibold text-2xl">Transactions</h2>
            </header>
            <TransactionTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
