import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
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
  title: "Bōdo - Канбан-доска",
  description: "Визуальный планировщик задач с канбан-доской",
  keywords: ["канбан", "планировщик", "задачи", "проекты"],
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${
          (geistSans.variable, geistMono.variable, unbounded.variable)
        } bg-neutral-950 text-white `}
      >
        {children}
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}
