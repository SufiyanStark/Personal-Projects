"use client";

import type { ProductColor } from "@/data/products";

type ColorSelectorProps = {
  colors: ProductColor[];
  selectedColor: string;
  onSelect: (color: string) => void;
};

export function ColorSelector({ colors, selectedColor, onSelect }: ColorSelectorProps) {
  return (
    <div>
      <p className="mb-3 text-[0.62rem] uppercase tracking-[0.34em] text-[#b8a57d]">Color</p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = color.name === selectedColor;

          return (
            <button
              key={color.name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(color.name)}
              className="group flex items-center gap-2 border border-[#f5efe2]/15 px-3 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#efe7d7] transition hover:border-[#d2b37a] focus:outline-none focus:ring-1 focus:ring-[#d2b37a]"
            >
              <span
                className="h-3 w-3 border border-[#f5efe2]/25"
                style={{ backgroundColor: color.value }}
              />
              <span className={isSelected ? "text-[#d2b37a]" : "text-[#efe7d7]/76"}>{color.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
