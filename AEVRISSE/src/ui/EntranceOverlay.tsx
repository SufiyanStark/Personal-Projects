"use client";

import { useEffect, useRef } from "react";
import { MathUtils } from "three";

export function EntranceOverlay() {
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const nextProgress = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--aev-phase-one-progress") || "0",
      );
      const progress = Number.isFinite(nextProgress) ? nextProgress : 0;
      const fade = 1 - MathUtils.smoothstep(progress, 0.2, 0.4);

      if (overlay.current) {
        overlay.current.style.opacity = String(fade);
        overlay.current.style.transform = `translateY(${MathUtils.lerp(-18, 0, fade)}px)`;
      }

      frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={overlay}
      className="pointer-events-none fixed inset-0 z-10 flex items-end justify-center px-6 pb-14 transition-opacity duration-200 sm:items-center sm:pb-0"
    >
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.52em] text-[#bda980] sm:text-sm">
          Cinematic Fashion
        </p>
        <h1 className="mt-5 text-5xl font-light tracking-[0.2em] text-[#f7efe3] sm:text-7xl lg:text-8xl">
          AEVRISSE
        </h1>
        <p className="mt-8 text-[0.65rem] font-medium uppercase tracking-[0.46em] text-[#d6c7aa]/85">
          Scroll to enter
        </p>
        <div className="mx-auto mt-5 h-12 w-px bg-[#d6c7aa]/60" />
      </div>
    </div>
  );
}
