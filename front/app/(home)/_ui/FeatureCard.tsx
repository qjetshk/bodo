import React from "react";
import Image from "next/image";

interface Props {
  title: string;
  desc: string;
  imageSrc: string;
  imageAlt?: string;
  index: number;
}

const FeatureCard = ({ title, desc, imageSrc, imageAlt, index }: Props) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`grid max-w-[1000px] gap-10 lg:gap-20 items-center justify-center grid-cols-1 ${isEven ? "md:grid-cols-[400px_auto]" : "md:grid-cols-[auto_400px]"
        }`}
    >
      <div className={`relative md:w-[300px] lg:w-[400px] mx-auto w-[70vw] md:mx-0 aspect-square overflow-hidden ${isEven ? "md:order-0" : "md:order-1"} `}>
        <video
          src={imageSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`${isEven ? "md:order-0" : "md:order-1"} 
      absolute inset-0 
      w-full h-full 
      object-cover 
      select-none 
      pointer-events-none`}
        />
      </div>


      <div className="flex flex-col gap-5">
        <h2 className="font-medium text-3xl font-unbounded">{title}</h2>
        <p className="text-neutral-400">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
