import { BgSection } from "@/components/BgSection";
import FeatureCard from "@/components/FeatureCard";
import { MotionDiv } from "@/components/MotionDiv";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { FEATURES_CARDS } from "@/data/features-cards.data";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className=" relative overflow-hidden">
        <section className="_container h-full relative">
          <MotionDiv
            initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "none",
              transition: { duration: 0.3 },
            }}
          >
            <header className="relative py-5 flex z-100 justify-between">
              <Link href={"/"} className="font-bold text-3xl font-unbounded">
                Bōdo
              </Link>
              <NavBar />
            </header>
          </MotionDiv>
        </section>
        <div className="h-[500px]">
          <BgSection style="" textStyle="!p-0 !justify-center" />
        </div>
      </section>

      <main className="_container">
        <MotionDiv
          initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "none",
            transition: { duration: 1 },
          }}
          className=" font-unbounded font-semibold text-5xl sm:text-6xl justify-center flex items-center min-h-[300px] h-[calc(100vh-576px)]"
        >
          Features
        </MotionDiv>
        <section className="mt-20 mx-auto w-fit flex flex-col gap-40">
          {FEATURES_CARDS.map((card, index) => (
            <MotionDiv
              key={index}
              initial={{
                y: 50,
                x: index % 2 === 0 ? -10 : 10,
                opacity: 0,
                filter: "blur(10px)",
              }}
              whileInView={{
                y: 0,
                x: 0,
                opacity: 1,
                filter: "none",
                transition: { duration: 0.6 },
              }}
              viewport={{ once: true }}
            >
              <FeatureCard
                title={card.title}
                desc={card.desc}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                index={index}
              />
            </MotionDiv>
          ))}
        </section>
        <div className="flex justify-center">
          <MotionDiv
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Link href={"/login"}>
              <Button
                variant={"secondary"}
                size={"lg"}
                className="text-xl p-6 mt-30"
              >
                Попробовать бесплатно
              </Button>
            </Link>
          </MotionDiv>
        </div>
        <MotionDiv
          initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
          whileInView={{
            y: 0,
            opacity: 1,
            filter: "none",
            transition: { duration: 0.3 },
          }}
          viewport={{ once: true }}
        >
          <footer className="flex gap-2.5 mx-auto items-center mt-25 mb-15 flex-wrap justify-center">
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
          </footer>
        </MotionDiv>
      </main>
    </>
  );
}
