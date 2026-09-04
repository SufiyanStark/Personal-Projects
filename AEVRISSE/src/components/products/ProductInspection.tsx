"use client";

import { ProductInfoPanel } from "@/components/products/ProductInfoPanel";
import { useProductExperience } from "@/context/ProductExperienceContext";
import { type Product } from "@/data/products";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

function getInspectionTransform(product: Product) {
  const visualScale = product.visualScale ?? 1;
  const visualOffsetX = product.visualOffsetX ?? 0;
  const visualOffsetY = product.visualOffsetY ?? 0;
  const inspectionScale = 1.06 + (visualScale - 1) * 0.42;

  return `translate(${visualOffsetX}%, ${visualOffsetY}%) scale(${inspectionScale})`;
}

export function ProductInspection() {
  const { closeInspection, isInspecting, selectedProduct } = useProductExperience();
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (!isInspecting) return;

    scrollPosition.current = window.scrollY;
    const previous = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previous.overflow;
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      window.scrollTo(0, scrollPosition.current);
    };
  }, [isInspecting]);

  return (
    <AnimatePresence>
      {isInspecting && selectedProduct ? (
        <motion.div
          key="product-inspection"
          aria-hidden={!isInspecting}
          className="fixed inset-0 z-30 flex items-stretch overflow-y-auto overflow-x-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-[#030303]/88 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_42%,rgba(210,179,122,0.16),rgba(8,7,6,0)_34%),linear-gradient(90deg,rgba(8,7,6,0.18),rgba(8,7,6,0.62))]" />
          <button
            type="button"
            aria-label="Close product inspection"
            onClick={closeInspection}
            className="fixed right-[clamp(1.125rem,3vw,2.25rem)] top-[clamp(1.125rem,3vh,2rem)] z-40 text-sm uppercase tracking-[0.28em] text-[#efe7d7]/60 transition hover:text-[#efe7d7] focus:outline-none focus:ring-1 focus:ring-[#d2b37a]"
          >
            Close x
          </button>
          <div className="relative z-10 grid min-h-full w-full grid-rows-[minmax(26rem,58vh)_auto] lg:grid-cols-[minmax(0,0.68fr)_minmax(24rem,0.32fr)] lg:grid-rows-1">
            <motion.div
              className="relative flex min-h-[min(72vh,680px)] items-center justify-center px-[clamp(1.5rem,5vw,6rem)] py-[clamp(4rem,8vh,6rem)]"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 18 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pointer-events-none absolute left-1/2 top-[55%] h-[18%] w-[52%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-2xl" />
              <div className="relative h-[min(72vh,680px)] w-full max-w-[min(62vw,860px)]">
                <Image
                  key={selectedProduct.id}
                  alt={selectedProduct.name}
                  className="object-contain drop-shadow-[0_34px_38px_rgba(0,0,0,0.48)]"
                  fill
                  priority
                  sizes="(min-width:1024px) 66vw, 92vw"
                  src={selectedProduct.image}
                  style={{ transform: getInspectionTransform(selectedProduct) }}
                />
              </div>
            </motion.div>
            <motion.div
              className="relative flex min-h-0 items-start justify-end px-4 pb-6 pt-[clamp(4.5rem,9vh,6rem)] sm:px-6 lg:pb-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductInfoPanel />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
