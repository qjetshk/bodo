import { ReactNode } from "react";
import {
  LucideIcon,
  ListTodo,
  Kanban,
  BookOpen,
  Settings2,
  CircleQuestionMark,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
  description?: string;
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
      title: "? ? ?",
      url: "/todo",
      icon: CircleQuestionMark,
      isActive: false,
    },
    {
      title: "? ? ?",
      url: "/md",
      icon: CircleQuestionMark,
      isActive: false,
    },
    {
      title: "Kanban",
      url: "/kanban",
      icon: Kanban,
      isMain: false,
      items: [
        {
          title: "+ New Board",
          url: "/new",
          description: "Create a new board",
        },
      ],
    },
  ],
};

// example object
/* {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
  navMain: [
    {
      title: "Todo",
      url: "/todo",
      icon: ListTodo,
      isActive: false
    },
    {
      title: "Kanban",
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
