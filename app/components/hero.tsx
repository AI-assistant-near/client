"use client";

import React from "react";

export default function Hero({ children }: { children: React.ReactNode }) {
  return (
    <section 
      className="
        relative flex items-center justify-center
        min-h-screen w-full
        bg-[#1e1e24] text-white
        overflow-hidden
      "
    >
<div
  className="
    absolute
    top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    w-[80vw] h-[80vw]     
    max-w-[800px] max-h-[800px]
    rounded-full
    bg-[radial-gradient(ellipse_at_center,_rgba(155,92,255,0.8)_0%,_rgba(0,0,0,0)_60%)]
    blur-3xl
    opacity-70
    z-5
  "
/>
  <div className="z-10">
    {children}
  </div>
    </section>
  );
}
