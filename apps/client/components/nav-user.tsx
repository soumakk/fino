"use client";

import { logoutAction } from "@/app/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/contexts/SessionProvider";
import { LogoutIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function NavUser() {
  const session = useSession();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={logoutAction} className="cursor-pointer">
          <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
          Log out
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar>
            <AvatarImage src={""} alt={session?.name} />
            <AvatarFallback>{session?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{session?.name}</span>
            <span className="truncate text-xs">{session?.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
