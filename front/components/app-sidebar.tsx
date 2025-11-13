"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";

import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { MENU_BAR } from "@/data/menubar.data";
import { useGetMeQuery } from "@/store/auth";

// This is sample data.
const menu_data = MENU_BAR;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isActive = state === "expanded";
  const { isLoading, data } = useGetMeQuery();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href={"/"}
          className={`font-bold text-${
            isActive ? "2xl" : "lg"
          } text-center font-unbounded pt-2`}
        >
          {isActive ? "Bōdo" : "Bō"}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu_data.navMain} />
      </SidebarContent>
      <SidebarFooter>{data && <NavUser user={data} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
