"use client";

import { useProductExperience } from "@/context/ProductExperienceContext";

export function BagIndicator() {
  const { cartCount, isInspecting } = useProductExperience();

  return (
    <div
      className={`pointer-events-none fixed right-6 top-6 z-20 text-[0.65rem] uppercase tracking-[0.32em] text-[#efe7d7]/70 transition-opacity duration-500 sm:right-9 sm:top-8 ${
        isInspecting || cartCount > 0 ? "opacity-100" : "opacity-45"
      }`}
    >
      Bag {String(cartCount).padStart(2, "0")}
    </div>
  );
}
