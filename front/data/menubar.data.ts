import { ReactNode } from "react";
import {
  LucideIcon,
  ListTodo,
  Kanban,
  BookOpen,
  Settings2,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  isMain?: boolean;
  items?: NavSubItem[];
}

export interface SidebarData {
  navMain: NavMainItem[];
}

export const MENU_BAR: SidebarData = {
  navMain: [
    {
      title: "Туду",
      url: "/todo",
      icon: ListTodo,
      isActive: false,
    },
    {
      title: "Канбан",
      url: "/kanban",
      icon: Kanban,
      isMain: false,
      items: [
        {
          title: "1",
          url: "/1",
        },
        {
          title: "+ Новая доска",
          url: "/new",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "General",
          url: "/general",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

//пример объекта
/* {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
  navMain: [
    {
      title: "Туду",
      url: "/todo",
      icon: ListTodo,
      isActive: false
    },
    {
      title: "Канбан",
      url: "/kanban",
      icon: Kanban,
      
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

};
 */
