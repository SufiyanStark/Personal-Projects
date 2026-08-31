"use client";

import { ExperienceCanvas } from "@/experience/ExperienceCanvas";
import { ProductExperienceProvider } from "@/context/ProductExperienceContext";
import { AddedToBagNotice } from "@/ui/AddedToBagNotice";
import { BagIndicator } from "@/ui/BagIndicator";
import { EntranceOverlay } from "@/ui/EntranceOverlay";
import { LoadingScreen } from "@/ui/LoadingScreen";
import { ProductInspection } from "@/components/products/ProductInspection";
import { useEffect, useState } from "react";

export function ScrollExperience() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <ProductExperienceProvider>
      <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#050505] text-[#f5f0e8]">
        <ExperienceCanvas onReady={() => setIsLoading(false)} />
        <EntranceOverlay />
        <BagIndicator />
        <ProductInspection />
        <AddedToBagNotice />
        <LoadingScreen visible={isLoading} />
      </main>
    </ProductExperienceProvider>
  );
}
