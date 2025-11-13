"use client";
import Typewriter from "typewriter-effect";

interface TypingAnimationProps {
  words: string[]
  textStyle: string
}

export default function TypingAnimation({ words, textStyle }: TypingAnimationProps) {
  return (
    <div className={`${textStyle} select-none pointer-events-none draggable-false font-unbounded z-100 text-[rgba(255,255,255,0.8)]! relative font-medium text-[74px] flex w-full h-full justify-start pl-[15%] items-center `}>
      <Typewriter
        options={{
          strings: words,
          autoStart: true,
          loop: true,
          deleteSpeed: 70,
          delay: 150,
          cursor: "",
          wrapperClassName: 'italic'
        }}
      />
    </div>
  );
}
