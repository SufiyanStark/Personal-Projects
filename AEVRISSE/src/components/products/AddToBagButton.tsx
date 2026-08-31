"use client";

type AddToBagButtonProps = {
  onAdd: () => void;
};

export function AddToBagButton({ onAdd }: AddToBagButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full border border-[#d2b37a] px-5 py-4 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[#f6efe3] transition hover:bg-[#d2b37a] hover:text-[#080706] focus:outline-none focus:ring-1 focus:ring-[#f6efe3]"
    >
      Add To Bag
    </button>
  );
}
