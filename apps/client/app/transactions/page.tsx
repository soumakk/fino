import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TransactionTable from "@/modules/transactions/components/TransactionsTable";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <h2 className="font-medium text-xl">All Transaction</h2>
          </div>
        </header>
        <div className="flex-1 p-4 pt-0">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            <TransactionTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
