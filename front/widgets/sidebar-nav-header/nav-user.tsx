"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CircleQuestionMark,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui-kit/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui-kit/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui-kit/sidebar";
import { useLogoutMutation } from "@/features/auth/api/auth.slice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAvatarFallback } from "@/shared/lib/avatar-fallback.util";
import { NotificationsModal } from "../../entities/notifications/ui/NotificationsModal";
import { Dialog } from "../../shared/ui-kit/dialog";
import Account from "../../entities/user/ui/Account";
import { useState } from "react";
import { useSubscription } from "@apollo/client/react";
import { GET_BOARD_INVITATION } from "@/apollo/requests/invitation";
import { useCurrentUser } from "@/shared/hooks/use-user";

export function NavUser() {
  const { isMobile } = useSidebar();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have successfully logged out!", { duration: 1000 });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      toast.error("Logout error");
    }
  };

  useSubscription(GET_BOARD_INVITATION, {
    onData: () => {
      toast.success("You have a new invitation!", {
        action: {
          label: "View",
          onClick: () => setIsNotificationsOpen(true),
        },
      });
    },
  });

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatarUrl} alt={user?.nickName} />
                  <AvatarFallback className="rounded-lg">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`@${user?.nickName}`}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) dark min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatarUrl} alt={user?.nickName} />
                    <AvatarFallback className="rounded-lg">
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{`@${user?.nickName}`}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <CircleQuestionMark />
                  ? ? ?
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAccountOpen(true);
                  }}
                >
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNotificationsOpen(true);
                  }}
                >
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
        <Account />
      </Dialog>

      <NotificationsModal
        isOpened={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
    </>
  );
}
