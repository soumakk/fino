"use client";

import * as React from "react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Analytics01Icon,
  CommandIcon,
  Invoice03Icon,
  MoneyBagIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const data = {
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={Analytics01Icon} />,
    },
    {
      name: "Transactions",
      url: "/transactions",
      icon: <HugeiconsIcon icon={Invoice03Icon} />,
    },
    // {
    //   name: "Categories",
    //   url: "/transactions",
    //   icon: <HugeiconsIcon icon={Tag} />,
    // },
    // {
    //   name: "Budget",
    //   url: "#",
    //   icon: <HugeiconsIcon icon={MapsIcon} strokeWidth={2} />,
    // },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon
                  icon={MoneyBagIcon}
                  strokeWidth={2}
                  className="size-4"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Fino</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
