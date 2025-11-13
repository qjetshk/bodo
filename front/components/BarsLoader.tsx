"use client";

export function BarsLoader() {
  return (
    <div className="flex items-end justify-center gap-[6px] h-12">
      <span className="w-2 bg-white rounded-full animate-bar [animation-delay:-0.4s]" />
      <span className="w-2 bg-white rounded-full animate-bar [animation-delay:-0.2s]" />
      <span className="w-2 bg-white rounded-full animate-bar" />
    </div>
  );
}
