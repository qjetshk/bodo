"use client";

import { store } from "@/shared/store/store";
import { Provider } from "react-redux";
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from "@/apollo/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <div className={`bg-neutral-950 text-white `}>
          {children}
        </div>

      </Provider>
    </ApolloProvider>

  );
}
