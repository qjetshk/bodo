"use client";
import { WORDS } from "@/widgets/bg/words.data";
import { BgImage } from "./BgImage";
import TypingAnimation from "../../shared/components/TypeWriter";
import { motion } from "motion/react";

interface Props {
  style: string;
  textStyle: string;
}

export function BgSection({ style, textStyle }: Props) {
  return (
    <motion.section
      className={`relative w-full h-full overflow-hidden ${style}`}
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "none", transition: { duration: 2 } }}
    >
      <BgImage />
      <TypingAnimation words={WORDS} textStyle={textStyle} />
    </motion.section>
  );
}
