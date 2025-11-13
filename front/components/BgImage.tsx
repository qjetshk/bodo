"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function BgImage() {
  const [src, setSrc] = useState("/BG.webp");

  useEffect(() => {
    const isSafari =
      typeof navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) setSrc("/BG.gif");
  }, []);

  return (
    <Image
      src={src}
      alt="Background"
      fill
      className="object-cover bg-cover select-none pointer-events-none draggable-false blur-[10px]"
      loading="eager"
      quality={5}
      priority
      unoptimized={false}
    />
  );
}
