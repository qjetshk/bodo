import { Metadata } from "next";
import React from "react";
import DashBoard from "./DashBoardPage";

export const metadata: Metadata = {
  title: "Bōdo - Дашбоард",
  description: "Дашбоард",
};

const DashBoardPage = () => {

  return (
    <DashBoard />
  );
};

export default DashBoardPage;
