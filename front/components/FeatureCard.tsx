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
      className={`grid max-w-[1000px] gap-10 lg:gap-20 items-center justify-center grid-cols-1 ${
        isEven ? "md:grid-cols-[300px_auto]" : "md:grid-cols-[auto_300px]"
      }`}
    >
      <Image
        alt={imageAlt || ""}
        src={imageSrc}
        width={300}
        height={300}
        unoptimized
        className={`${isEven ? "md:order-0" : "md:order-1"} w-full h-auto`}
      />

      <div className="flex flex-col gap-5">
        <h2 className="font-medium text-3xl font-unbounded">{title}</h2>
        <p className="text-neutral-400">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
