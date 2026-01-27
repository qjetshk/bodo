import { Metadata } from "next";
import React from "react";
import DashBoard from "./DashBoardPage";

export const metadata: Metadata = {
  title: "Bōdo - Dashboard",
  description: "Your personal dashboard in Bōdo. Manage your kanban boards, tasks, and projects efficiently, collaborate with your team, and track progress all in one place.",
  keywords: [
    "dashboard",
    "kanban boards",
    "tasks",
    "projects",
    "workspace",
    "team collaboration",
    "Bōdo",
    "project management",
    "task management",
    "productivity"
  ],
  authors: [
    { name: "Bōdo Team", url: "https://bodo-planner.com" }
  ],
  creator: "Bōdo",
  publisher: "Bōdo",
  category: "productivity",
  robots: "index, follow",
  icons: "/logo.svg",
  openGraph: {
    title: "Bōdo - Dashboard",
    description: "Your personal dashboard in Bōdo. Manage your kanban boards, tasks, and projects efficiently, collaborate with your team, and track progress all in one place.",
    type: "website",
    url: "https://bodo-planner.com/dashboard",
    siteName: "Bōdo",
    images: [
      {
        url: "/logo.svg",
        alt: "Bōdo Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bōdo - Dashboard",
    description: "Your personal dashboard in Bōdo. Manage your kanban boards, tasks, and projects efficiently, collaborate with your team, and track progress all in one place.",
    creator: "@Bodo",
    images: ["/logo.svg"]
  }
};


const DashBoardPage = () => {

  return (
    <DashBoard />
  );
};

export default DashBoardPage;
