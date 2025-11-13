import { Metadata } from "next";
import React from "react";
import HelloPage from "./HelloPage";

export const metadata: Metadata = {
  title: "Bōdo - Дашбоард",
  description: "Дашбоард",
};

const DashBoardPage = () => {


  return (
    <HelloPage/>
  );
};

export default DashBoardPage;
