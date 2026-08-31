"use client";

import { useProductExperience } from "@/context/ProductExperienceContext";
import { motion } from "motion/react";

export function AddedToBagNotice() {
  const { notice } = useProductExperience();

  return (
    <motion.div
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 top-8 z-40 -translate-x-1/2 border border-[#d2b37a]/40 bg-[#050505]/75 px-5 py-3 text-[0.68rem] uppercase tracking-[0.3em] text-[#f6efe3] backdrop-blur-sm"
      animate={{ opacity: notice ? 1 : 0, y: notice ? 0 : -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {notice ?? "ADDED TO BAG"}
    </motion.div>
  );
}
