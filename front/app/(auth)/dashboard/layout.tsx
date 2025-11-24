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


const DashBoardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

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
