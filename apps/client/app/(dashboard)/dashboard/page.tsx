import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AmountByMonthChart } from "@/modules/dashboard/components/AmountByMonthChart";
import { ExpenseByCategoryChart } from "@/modules/dashboard/components/ExpenseByCategoryChart";
import DashboardDateFilter from "@/modules/dashboard/components/DashboardDateFilter";
import DashboardSummary from "@/modules/dashboard/components/DashboardSummary";
import RecentTransactionsTable from "@/modules/dashboard/components/RecentTransactionsTable";
import DashboardTitle from "@/modules/dashboard/components/DashboardTitle";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className=" flex-1 gap-4 p-4 pt-0 ">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            <header className="mt-6 flex justify-between items-center">
              <DashboardTitle />
              <DashboardDateFilter />
            </header>

            <DashboardSummary />
            <AmountByMonthChart />

            <div className="grid grid-cols-3 gap-5">
              <ExpenseByCategoryChart />
              <RecentTransactionsTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
