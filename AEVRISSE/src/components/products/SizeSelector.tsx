"use client";

type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <p className="mb-3 text-[0.62rem] uppercase tracking-[0.34em] text-[#b8a57d]">Size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = size === selectedSize;

          return (
            <button
              key={size}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(size)}
              className={`h-10 min-w-10 border px-3 text-sm uppercase tracking-[0.16em] transition focus:outline-none focus:ring-1 focus:ring-[#d2b37a] ${
                isSelected
                  ? "border-[#d2b37a] bg-[#d2b37a] text-[#080706]"
                  : "border-[#f5efe2]/15 text-[#efe7d7]/76 hover:border-[#d2b37a] hover:text-[#efe7d7]"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
