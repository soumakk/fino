import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartBarInteractive } from "@/modules/dashboard/components/DashboardChart1";
import { ChartPieDonutText } from "@/modules/dashboard/components/DashboardChart2";
import DashboardSummary from "@/modules/dashboard/components/DashboardSummary";
import RecentTransactionsTable from "@/modules/dashboard/components/RecentTransactionsTable";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <h2 className="font-medium text-xl">Dashboard</h2>
          </div>
        </header>
        <div className=" flex-1 gap-4 p-4 pt-0 ">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            <DashboardSummary />
            <ChartBarInteractive />

            <div className="grid grid-cols-3 gap-5">
              <ChartPieDonutText />
              <RecentTransactionsTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
