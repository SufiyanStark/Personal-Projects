"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { getPhaseOneProgress, getPhaseTwoProgress } from "@/lib/experienceProgress";

export type AevrisseScrollProgressDetail = {
  progress: number;
  phaseOneProgress: number;
  phaseTwoProgress: number;
};

export function ScrollProgressBridge() {
  const scroll = useScroll();
  const previousDispatchedProgress = useRef(-1);
  const previousPhaseOneProgress = useRef(-1);

  useEffect(() => {
    scroll.el.classList.add("aevrisse-scroll-owner");
    return () => {
      scroll.el.classList.remove("aevrisse-scroll-owner");
    };
  }, [scroll.el]);

  useFrame(() => {
    const progress = scroll.offset;
    const phaseOneProgress = getPhaseOneProgress(progress);
    const phaseTwoProgress = getPhaseTwoProgress(progress);

    document.documentElement.style.setProperty("--aev-scroll-progress", progress.toFixed(4));
    document.documentElement.style.setProperty("--aev-phase-one-progress", phaseOneProgress.toFixed(4));
    document.documentElement.style.setProperty("--aev-phase-two-progress", phaseTwoProgress.toFixed(4));

    const shouldUpdateEntrance = Math.abs(phaseOneProgress - previousPhaseOneProgress.current) >= 0.01;
    const shouldUpdateEditorial = Math.abs(progress - previousDispatchedProgress.current) >= 0.004;
    if (!shouldUpdateEntrance && !shouldUpdateEditorial) return;

    previousDispatchedProgress.current = progress;
    previousPhaseOneProgress.current = phaseOneProgress;
    window.dispatchEvent(
      new CustomEvent<AevrisseScrollProgressDetail>("aevrisse-scroll-progress", {
        detail: {
          progress,
          phaseOneProgress,
          phaseTwoProgress,
        },
      }),
    );
  });

  return null;
}
