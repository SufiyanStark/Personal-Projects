"use client";

import { ProductInfoPanel } from "@/components/products/ProductInfoPanel";
import { useProductExperience } from "@/context/ProductExperienceContext";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export function ProductInspection() {
  const { isInspecting, dragRotation, setDragRotation } = useProductExperience();
  const dragStart = useRef<{ x: number; y: number; rotationX: number; rotationY: number } | null>(null);

  useEffect(() => {
    if (!isInspecting) dragStart.current = null;
  }, [isInspecting]);

  return (
    <motion.div
      aria-hidden={!isInspecting}
      className={`fixed inset-0 z-30 flex items-stretch justify-end ${
        isInspecting ? "pointer-events-auto" : "pointer-events-none"
      }`}
      animate={{ opacity: isInspecting ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={(event) => {
        if (!isInspecting) return;
        const target = event.target as HTMLElement;
        if (target.closest("button") || target.closest("aside")) return;

        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = {
          x: event.clientX,
          y: event.clientY,
          rotationX: dragRotation.x,
          rotationY: dragRotation.y,
        };
      }}
      onPointerMove={(event) => {
        if (!dragStart.current) return;

        const deltaX = event.clientX - dragStart.current.x;
        const deltaY = event.clientY - dragStart.current.y;

        setDragRotation({
          x: Math.max(-0.07, Math.min(0.07, dragStart.current.rotationX + deltaY * 0.0012)),
          y: Math.max(-0.14, Math.min(0.14, dragStart.current.rotationY + deltaX * 0.0018)),
        });
      }}
      onPointerUp={() => {
        dragStart.current = null;
      }}
      onPointerCancel={() => {
        dragStart.current = null;
      }}
    >
      <div className="absolute inset-0 bg-[#050505]/18" />
      <div className="relative ml-auto flex h-full w-full items-end justify-end sm:items-center">
        <ProductInfoPanel />
      </div>
    </motion.div>
  );
}
