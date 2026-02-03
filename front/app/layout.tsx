import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./providers/ph-provider";
import { Suspense } from "react";
import { PostHogPageview } from "./providers/ph-page-view";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bōdo - Kanban-Board",
  description: "Visual task planner with Kanban board",
  keywords: ["kanban", "task planner", "task manager", "tasks", "projects"],
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} bg-neutral-950 text-white`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageview />
          </Suspense>

          {children}

          <Toaster theme="dark" richColors position="top-center" />
        </PostHogProvider>
      </body>
    </html>
  );
}
