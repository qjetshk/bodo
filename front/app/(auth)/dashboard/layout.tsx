"use client";
import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-nav-header/app-sidebar";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import DashBoardHeader from "@/components/sidebar-nav-header/DashBoardHeader";
import PrivateRoute from "./PrivateRoute";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubscription } from "@apollo/client/react";
import { BOARD_DELETED, GET_ALL_USER_BOARDS_FOR_DASHBOARD, GET_ALL_USER_BOARDS_FOR_NAVIGATION } from "@/apollo/requests/boards";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";


const DashBoardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const router = useRouter()
  const path = usePathname()

  useSubscription(BOARD_DELETED, {
    onData({ data, client }) {
      console.log('sfsdfs')
      const board = data.data?.boardDeleted
      if (!board) return

      if (path.includes(board.id)) {
        setTimeout(() => router.push('/dashboard'), 200)
      }

      toast.warning(`Доска ${board.name} была удалена!`)

      client.refetchQueries({
        include: [GET_ALL_USER_BOARDS_FOR_NAVIGATION, GET_ALL_USER_BOARDS_FOR_DASHBOARD]
      })
    },
  })

  return (
    <PrivateRoute>
      <motion.section
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "none", opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="dark"
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col h-screen">
            <DashBoardHeader />
            <Separator />
            <ScrollArea className=" w-full h-full overflow-x-hidden flex-1 ">
              <div className="p-5">{children}</div>
            </ScrollArea>
          </SidebarInset>
        </SidebarProvider>
      </motion.section>
    </PrivateRoute>
  );
};

export default DashBoardLayout;
