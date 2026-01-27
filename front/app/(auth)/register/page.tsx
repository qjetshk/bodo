import Link from "next/link";
import { BgImage } from "@/components/bg/BgImage";
import { BgSection } from "@/components/bg/BgSection";
import { MotionDiv } from "@/components/MotionDiv";
import { RegisterForm } from "./RegisterForm";
import { Metadata } from "next";
import { MoveLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Bōdo - Sign Up",
  description: "Create an account in Bōdo",
  keywords: ["sign up", "create account", "register"],
  authors: [{ name: "Bōdo Team", url: "https://bodo-planner.com" }],
  creator: "Bōdo Team",
  icons: "/logo.svg",
  openGraph: {
    title: "Bōdo - Sign Up",
    description: "Create an account in Bōdo",
    url: "https://bodo-planner.com/register",
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
    title: "Bōdo - Sign Up",
    description: "Create an account in Bōdo",
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
          <RegisterForm />
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
