import { BgSection } from "@/widgets/bg/BgSection";
import FeatureCard from "@/app/(home)/_ui/FeatureCard";
import { MotionDiv } from "@/shared/components/MotionDiv";
import { Button } from "@/shared/ui-kit/button";
import { FEATURES_CARDS } from "@/app/(home)/_data/features-cards.data";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <section className=" relative overflow-hidden">
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
          <div className="pt-15 w-fit mx-auto">
              <Link href={'/feedback'}>
                <Button className="text-md" size={"lg"} variant={'secondary'}>Напишите свои пожелания!</Button>
              </Link>
          </div>
          
        </MotionDiv>
      </main>
    </>
  );
}
