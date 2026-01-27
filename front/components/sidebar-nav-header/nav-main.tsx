"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
      description?: string
    }[];
  }[];
}) {
  const pathname = usePathname();

  // Функция для проверки активной ссылки
  const isLinkActive = (url: string) => {
    return pathname.includes(url) || pathname.startsWith(url + "/");
  };

  // Функция для проверки активного родительского элемента
  const isParentActive = (item: {
    url: string;
    items?: { url: string; isActive?: boolean }[];
    isActive?: boolean;
  }) => {
    // Если isActive = false, элемент неактивен
    if (item.isActive === false) return false;

    // Проверяем активен ли основной URL
    if (isLinkActive(item.url)) return true;

    // Проверяем активен ли любой из дочерних элементов
    if (item.items) {
      return item.items.some(
        (subItem) => subItem.isActive !== false && isLinkActive(subItem.url)
      );
    }

    return false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link href={"/dashboard"}>Home</Link>
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = isParentActive(item);

          if (item.items && item.items.length > 0) {
            // Если родитель неактивен - показываем только кнопку без выпадающего списка
            if (item.isActive === false) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={false}
                    className="opacity-50 cursor-not-allowed"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {/* Убираем стрелочку для неактивных элементов */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Активный родитель - показываем выпадающий список
            return (
              <Collapsible
                key={item.url}
                asChild
                defaultOpen={isActive}
                className="group/collapsible "
              >
                <SidebarMenuItem >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>

                    <SidebarMenuSub className="max-h-[500px] overflow-auto scrollbar-track-neutral-900! scrollbar-thumb-neutral-800!">
                      <ul className="flex flex-col gap-1">
                        {item.items.map((subItem) => {
                          const isSubItemActive =
                            subItem.isActive !== false && isLinkActive(subItem.url);
                          return (
                            <li key={subItem.url}>
                              {subItem.isActive === false ? (
                                <SidebarMenuSubButton
                                  isActive={false}
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubItemActive}
                                    >
                                      <Link href={`/dashboard/${item.url}${subItem.url}`}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p className="max-w-50 truncate">{subItem.description || subItem.title}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </SidebarMenuSub>


                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Простые ссылки (без подпунктов)
          const isSimpleItemActive =
            item.isActive !== false && isLinkActive(item.url);

          return (
            <SidebarMenuItem key={item.url}>
              {item.isActive === false ? (
                // Неактивная простая ссылка
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={false}
                  className="opacity-50 cursor-not-allowed"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                // Активная простая ссылка
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isSimpleItemActive}
                >
                  <Link href={`/dashboard/${item.url}`}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
