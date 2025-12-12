"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CircleQuestionMark,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getAvatarFallback } from "@/utils/avatar-fallback.util";
import { NotificationsModal } from "../notifications/NotificationsModal";
import { Dialog } from "../ui/dialog";
import Account from "../Account";
import { useState } from "react";
import { useSubscription } from "@apollo/client/react";
import { GET_BOARD_INVITATION } from "@/apollo/requests/invitation";
import { useCurrentUser } from "@/hooks/use-user";

export function NavUser() {
  const { isMobile } = useSidebar();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { user } = useCurrentUser()

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Вы успешно вышли!", { duration: 1000 });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      toast.error("Ошибка при выходе");
    }
  };

  useSubscription(GET_BOARD_INVITATION, {
    onData: () => {
      toast.success("У Вас новое приглашение!", {
        action: {
          label: "Посмотреть",
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
                  Аккаунт
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNotificationsOpen(true);
                  }}
                >
                  <Bell />
                  Уведомления
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut />
                Выйти
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
