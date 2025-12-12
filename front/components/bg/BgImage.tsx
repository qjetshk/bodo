"use client";
export function BgImage() {
  return (
      <video
        src={'/mp4/BG.mp4'}
        autoPlay
        loop
        muted
        playsInline
        className="
      absolute inset-0 
      w-full h-full
      object-cover 
      bg-cover 
      select-none 
      pointer-events-none 
      blur-[10px]
    "
      />
  );
}
