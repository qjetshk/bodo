"use client";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MENU_BAR, SidebarData } from "@/data/menubar.data";

const getPathInfo = (
  navMain: SidebarData["navMain"],
  pathname: string
) => {
  const breadcrumbs: { title: string; url: string; isMain?: boolean }[] = [];

  // убираем префикс /dashboard для сравнения с navMain
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

  const breadcrumbs = getPathInfo(MENU_BAR.navMain, pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {isOnDashboardMainPage ? (
                <BreadcrumbPage>Главная</BreadcrumbPage>
              ) : (
                <Link
                  className="transition-colors hover:text-white"
                  href="/dashboard"
                >
                  Главная
                </Link>
              )}
            </BreadcrumbItem>

            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <React.Fragment key={crumb.url}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
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
