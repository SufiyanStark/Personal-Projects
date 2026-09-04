"use client";

import { ExperienceCanvas } from "@/experience/ExperienceCanvas";
import { ProductExperienceProvider } from "@/context/ProductExperienceContext";
import { AddedToBagNotice } from "@/ui/AddedToBagNotice";
import { BagIndicator } from "@/ui/BagIndicator";
import { EntranceOverlay } from "@/ui/EntranceOverlay";
import { LoadingScreen } from "@/ui/LoadingScreen";
import { ProductInspection } from "@/components/products/ProductInspection";
import { useProductExperience } from "@/context/ProductExperienceContext";
import type { AevrisseScrollProgressDetail } from "@/components/three/ScrollProgressBridge";
import { CartDrawer } from "@/v2/CartDrawer";
import { EditorialExperience } from "@/v2/EditorialExperience";
import type { WheelEvent } from "react";
import { useEffect, useRef, useState } from "react";

export function ScrollExperience() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <ProductExperienceProvider>
      <ExperienceShell isLoading={isLoading} setIsLoading={setIsLoading} />
    </ProductExperienceProvider>
  );
}

function ExperienceShell({ isLoading, setIsLoading }: { isLoading: boolean; setIsLoading: (value: boolean) => void }) {
  const { openInspection } = useProductExperience();
  const backdrop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = (event: Event) => {
      const detail = (event as CustomEvent<AevrisseScrollProgressDetail>).detail;
      if (backdrop.current) {
        backdrop.current.style.opacity = String(Math.min(0.42, Math.max(0, (detail.progress - 0.46) / 0.18)));
      }
    };
    window.addEventListener("aevrisse-scroll-progress", updateProgress);
    return () => window.removeEventListener("aevrisse-scroll-progress", updateProgress);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const forwardWheelToScrollControls = (event: WheelEvent<HTMLElement>) => {
    const scrollOwner = document.querySelector<HTMLDivElement>(".aevrisse-scroll-owner");
    if (!scrollOwner) return;

    scrollOwner.scrollTop += event.deltaY;
    scrollOwner.scrollLeft += event.deltaX;
  };

  return (
    <main className="min-h-screen bg-[#080706] text-[#f5f0e8]">
      <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-[#050505]">
        <ExperienceCanvas onReady={() => setIsLoading(false)} />
        <EntranceOverlay />
      </div>
      <div ref={backdrop} className="pointer-events-none fixed inset-0 z-[1] bg-[#080706]" style={{ opacity: 0 }} />
      <EditorialExperience onInspect={openInspection} onWheel={forwardWheelToScrollControls} />
      <BagIndicator />
      <ProductInspection />
      <CartDrawer />
      <AddedToBagNotice />
      <LoadingScreen visible={isLoading} />
    </main>
  );
}
