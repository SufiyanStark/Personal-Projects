"use client";

import type { Product } from "@/data/products";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" }).format(value);
}

export function ProductStage({
  cardClassName = "",
  displayMode = "default",
  imageClassName = "h-[clamp(260px,30vw,420px)]",
  imageScaleClassName = "",
  onInspect,
  product,
  stageClassName = "",
  transitionDelay = 0,
}: {
  cardClassName?: string;
  displayMode?: "default" | "editorial-card";
  imageClassName?: string;
  imageScaleClassName?: string;
  onInspect: (productId: string) => void;
  product: Product;
  stageClassName?: string;
  transitionDelay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isEditorialCard = displayMode === "editorial-card";
  const visualScale = product.visualScale ?? 1;
  const visualOffsetX = product.visualOffsetX ?? 0;
  const visualOffsetY = product.visualOffsetY ?? 0;
  const editorialTransform = `translate(${visualOffsetX}%, ${visualOffsetY}%) scale(${visualScale * (hovered ? 1.05 : 1)})`;
  const hoverMotion = isEditorialCard ? { y: -6, zIndex: 8 } : { y: -8, scale: 1.045, zIndex: 8 };

  return (
    <motion.button
      type="button"
      onClick={() => onInspect(product.id)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group ${
        isEditorialCard ? "flex flex-col justify-between" : "block"
      } w-full min-w-0 text-center transition-colors duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-1 focus:ring-[#d2b37a] ${cardClassName} ${stageClassName}`}
      style={{ transitionDelay: `${transitionDelay}ms` }}
      whileHover={hoverMotion}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`relative w-full overflow-visible ${imageClassName}`}>
        <Image
          alt={product.name}
          className={`object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.36)] transition duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-110 ${
            isEditorialCard ? "transform-gpu" : `group-hover:scale-[1.05] ${imageScaleClassName}`
          }`}
          fill
          loading="lazy"
          sizes={isEditorialCard ? "(min-width:1024px) 24vw, 45vw" : "(min-width:1024px) 18vw, 45vw"}
          src={product.image}
          style={isEditorialCard ? { transform: editorialTransform } : undefined}
        />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 border border-[#c7a76e]/50 bg-[#080706]/70 px-4 py-2 text-[0.6rem] uppercase tracking-[0.22em] opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus:opacity-100">
          VIEW PIECE
        </span>
      </div>
      <div className={isEditorialCard ? "mt-2 min-h-[4.25rem]" : "mt-3 min-h-[4.75rem]"}>
        <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#c7a76e]">AEVRISSE</p>
        <p className="mx-auto mt-1.5 max-w-[13rem] text-sm leading-5 text-[#efe7d7]/78">{product.name}</p>
        <p className="mt-1.5 text-sm text-[#c7a76e]">{formatPrice(product.price)}</p>
      </div>
    </motion.button>
  );
}
