"use client";


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
import { useQuery } from "@apollo/client/react";
import { GET_ALL_USER_BOARDS_FOR_NAVIGATION } from "@/apollo/requests/boards";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setNavMain } from "@/store/nav-main";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { setIsMobile, setIsSidebarOpened } from "@/store/sidebar";

// This is sample data.
const menu_data = MENU_BAR;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile } = useSidebar();
  const isActive = state === "expanded";
  const { isLoading, data: userData } = useGetMeQuery();

  const { data: boardsData } = useQuery(GET_ALL_USER_BOARDS_FOR_NAVIGATION)
  const boards = boardsData?.getAllUserBoards || []

  const dispatch = useDispatch()

  const navMain = useMemo(() => {
    return MENU_BAR.navMain.map((item) => {
      if (item.title === "Канбан") {
        return {
          ...item,
          items: [
            ...boards.map((board: any) => ({
              title: board.name,
              url: `/${board.id}`,
              description: board.description,
            })),
            {
              title: "+ Новая доска",
              url: "/new",
              description: "Создать новую доску",
            },
          ],
        };
      }
      return item;
    });
  }, [boards]);

  useEffect(() => {
    dispatch(setNavMain(navMain));
  }, [dispatch, navMain]);

  useEffect(() => {
    dispatch(setIsSidebarOpened(isActive));
  }, [isActive])

  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href={"/"}
          className={`font-bold text-${isActive ? "2xl" : "lg"
            } text-center font-unbounded pt-2`}
        >
          {isActive ? "Bōdo" : "Bō"}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>{userData && <NavUser user={userData} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

