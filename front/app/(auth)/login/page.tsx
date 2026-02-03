import Link from "next/link";
import { BgImage } from "@/widgets/bg/BgImage";
import { BgSection } from "@/widgets/bg/BgSection";
import { MotionDiv } from "@/shared/components/MotionDiv";
import { LoginForm } from "../../../features/auth/ui/LoginForm";
import { Metadata } from "next";
import { MoveLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Bōdo - Sign In",
  description: "Sign in to Bōdo",
  keywords: [
    "sign in",
    "log in",
    "authenticate",
    "login",
    "sign in to account",
  ],
  authors: [{ name: "Bōdo Team", url: "https://bodo-planner.com" }],
  creator: "Bōdo Team",
  icons: "/logo.svg",
  openGraph: {
    title: "Bōdo - Sign In",
    description: "Sign in to Bōdo",
    url: "https://bodo-planner.com/login",
    siteName: "Bōdo",
    images: [
      {
        url: "https://bodo-planner.com/logo.svg",
        width: 512,
        height: 512,
        alt: "Bōdo Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bōdo - Sign In",
    description: "Sign in to Bōdo",
    images: ["https://bodo-planner.com/logo.svg"],
    creator: "@Bodo",
  },
};


export default function RegisterPage() {
  return (
    <main className="w-full h-[100vh] lg:grid grid-cols-2 flex justify-center text-white">
      <section className="w-full flex justify-end items-center">
        <MotionDiv
          initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "none",
            transition: { duration: 0.4 },
          }}
          className="max-w-[350px] lg:max-w-[300px] lg:px-0 px-5 lg:mr-[15%] mx-auto w-[-webkit-fill-available] z-100"
        >
          <LoginForm />
        </MotionDiv>

        <MotionDiv
          className="lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 2 } }}
        >
          <BgImage />
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 2 } }}
        >
          <Link href={"/"}>
            <MoveLeft
              width={28}
              height={28}
              className="absolute top-5 left-5 z-100"
            />
          </Link>
        </MotionDiv>
      </section>
      <BgSection style="hidden lg:block" textStyle="" />
    </main>
  );
}
