"use client";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const KanbanPage = () => {
  redirect("/dashboard/kanban/new");
};

export default KanbanPage;
