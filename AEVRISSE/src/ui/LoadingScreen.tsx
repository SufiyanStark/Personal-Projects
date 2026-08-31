"use client";

import { motion } from "motion/react";

type LoadingScreenProps = {
  visible: boolean;
};

export function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <motion.div
      aria-hidden={!visible}
      animate={{ opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed inset-0 z-20 grid place-items-center bg-[#050505]"
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-center">
        <p className="text-4xl font-light tracking-[0.24em] text-[#f7efe3] sm:text-6xl">AEVRISSE</p>
        <p className="mt-5 text-[0.65rem] uppercase tracking-[0.44em] text-[#bda980]">
          Entering the maison
        </p>
      </div>
    </motion.div>
  );
}
