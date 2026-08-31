"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { getPhaseOneProgress, getPhaseTwoProgress } from "@/lib/experienceProgress";

export function ScrollProgressBridge() {
  const scroll = useScroll();

  useFrame(() => {
    document.documentElement.style.setProperty("--aev-scroll-progress", scroll.offset.toFixed(4));
    document.documentElement.style.setProperty("--aev-phase-one-progress", getPhaseOneProgress(scroll.offset).toFixed(4));
    document.documentElement.style.setProperty("--aev-phase-two-progress", getPhaseTwoProgress(scroll.offset).toFixed(4));
  });

  return null;
}
