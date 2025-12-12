import { MotionDiv } from "@/components/MotionDiv";
import NavBar from "@/components/sidebar-nav-header/NavBar";
import Image from "next/image";
import Link from "next/link";

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MotionDiv
            initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
            animate={{
                y: 0,
                opacity: 1,
                filter: "none",
                transition: { duration: 0.3 },
            }}
        >
            <section className="_container h-full relative">

                <header className="relative py-5 flex z-100 justify-between">
                    <Link href={"/"} className="font-bold text-3xl font-unbounded">
                        Bōdo
                    </Link>
                    <NavBar />
                </header>

            </section>
            {children}
            <footer className="  mx-auto  mt-20 mb-15 ">
                <div className="flex gap-2.5 items-center flex-wrap justify-center">
                    <span className="font-unbounded font-bold text-3xl">
                        See project on:
                    </span>
                    <Link
                        target="_blank"
                        className="flex items-center"
                        href={"https://github.com/qjetshk/Bodo-Planner-Front"}
                    >
                        <Image src={"/github.svg"} alt="" width={185} height={40} />
                    </Link>
                </div>

                <p className="select-none text-center text-neutral-600">Copyright © 2025. All rights reserved.</p>
            </footer>
        </MotionDiv>
    );
}