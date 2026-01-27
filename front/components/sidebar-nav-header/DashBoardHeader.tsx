"use client";

import React from "react";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { SidebarData } from "@/data/menubar.data";
import { SidebarTrigger } from "../ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

// function for building breadcrumbs
const getPathInfo = (navMain: SidebarData["navMain"], pathname: string) => {
  const breadcrumbs: { title: string; url: string; isMain?: boolean }[] = [];

  const cleanPath = pathname.replace(/^\/dashboard/, "");

  for (const item of navMain) {
    if (cleanPath.startsWith(item.url)) {
      breadcrumbs.push({
        title: item.title,
        url: item.url,
        isMain: item.isMain ?? true,
      });

      if (item.items?.length) {
        for (const sub of item.items) {
          const fullUrl = item.url + sub.url;

          if (cleanPath.startsWith(fullUrl)) {
            breadcrumbs.push({
              title: sub.title,
              url: fullUrl,
            });
          }
        }
      }
    }
  }

  return breadcrumbs;
};

const DashBoardHeader = () => {
  const pathname = usePathname();
  const isOnDashboardMainPage = pathname === "/dashboard";

  const navMain = useSelector((state: RootState) => state.nav.navMain);

  const breadcrumbs = getPathInfo(navMain, pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="w-full">
          <BreadcrumbList>
            <BreadcrumbItem>
              {isOnDashboardMainPage ? (
                <BreadcrumbPage>Home</BreadcrumbPage>
              ) : (
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              )}
            </BreadcrumbItem>

            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <React.Fragment key={crumb.url}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="max-w-[40%] ">
                    {isLast ? (
                      <BreadcrumbPage className="truncate">
                        {crumb.title}
                      </BreadcrumbPage>
                    ) : crumb.isMain === false ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    ) : (
                      <Link
                        href={`/dashboard${crumb.url}`}
                        className="transition-colors hover:text-white"
                      >
                        {crumb.title}
                      </Link>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default DashBoardHeader;
