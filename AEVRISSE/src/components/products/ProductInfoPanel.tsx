"use client";

import { AddToBagButton } from "@/components/products/AddToBagButton";
import { ColorSelector } from "@/components/products/ColorSelector";
import { SizeSelector } from "@/components/products/SizeSelector";
import { useProductExperience } from "@/context/ProductExperienceContext";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function ProductInfoPanel() {
  const {
    addSelectedToBag,
    closeInspection,
    selectedColor,
    selectedProduct,
    selectedSize,
    selectColor,
    selectSize,
    validationMessage,
  } = useProductExperience();

  if (!selectedProduct) return null;

  return (
    <aside className="pointer-events-auto w-full max-w-md border-l border-[#f5efe2]/12 bg-[#050505]/30 px-6 py-7 backdrop-blur-sm sm:px-8">
      <button
        type="button"
        aria-label="Close product inspection"
        onClick={closeInspection}
        className="mb-10 ml-auto block text-sm uppercase tracking-[0.28em] text-[#efe7d7]/60 transition hover:text-[#efe7d7] focus:outline-none focus:ring-1 focus:ring-[#d2b37a]"
      >
        Close x
      </button>
      <p className="text-[0.62rem] uppercase tracking-[0.34em] text-[#b8a57d]">
        {selectedProduct.collection} - {selectedProduct.category}
      </p>
      <h2 className="mt-4 text-4xl font-light leading-tight tracking-[0.06em] text-[#f6efe3]">
        {selectedProduct.name}
      </h2>
      <p className="mt-6 text-lg font-light tracking-[0.12em] text-[#efe7d7]">
        {formatPrice(selectedProduct.price)}
      </p>
      <p className="mt-7 max-w-sm text-sm leading-7 text-[#efe7d7]/66">{selectedProduct.description}</p>
      <div className="mt-9 space-y-8">
        <ColorSelector colors={selectedProduct.colors} selectedColor={selectedColor} onSelect={selectColor} />
        <SizeSelector sizes={selectedProduct.sizes} selectedSize={selectedSize} onSelect={selectSize} />
      </div>
      <div className="mt-9">
        <AddToBagButton onAdd={addSelectedToBag} />
        <p className="mt-4 h-4 text-center text-[0.62rem] uppercase tracking-[0.28em] text-[#d2b37a]">
          {validationMessage ?? ""}
        </p>
      </div>
    </aside>
  );
}
