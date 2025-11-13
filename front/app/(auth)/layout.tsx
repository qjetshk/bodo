"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import PrivateRoute from "./dashboard/PrivateRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={store}>{children}</Provider>;
}
