"use client";

import { useProductExperience } from "@/context/ProductExperienceContext";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/v2/ProductStage";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function CartDrawer() {
  const { cartItems, cartSubtotal, closeCart, isCartOpen } = useProductExperience();
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (!isCartOpen) return;

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
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close cart" onClick={closeCart} className="absolute inset-0 bg-[#050505]/62" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[30rem] flex-col border-l border-[#efe7d7]/14 bg-[#080706]/96 p-7 text-[#f6efe3]">
        <div className="flex items-center justify-between border-b border-[#efe7d7]/12 pb-6"><h2 className="text-sm uppercase tracking-[0.32em]">YOUR BAG</h2><button type="button" onClick={closeCart}>CLOSE</button></div>
        <div className="min-h-0 flex-1 overflow-y-auto py-6">
          {cartItems.length === 0 ? <p className="mt-16 text-center text-sm text-[#efe7d7]/54">Your bag is waiting.</p> : cartItems.map((item) => {
            const product = getProduct(item.productId);
            return <div key={`${item.productId}-${item.size}-${item.color}`} className="grid grid-cols-[6rem_1fr] gap-5 border-b border-[#efe7d7]/10 py-5"><div className="relative h-32 bg-[#efe7d7]/5">{product ? <Image alt={item.name} className="object-contain p-2" fill sizes="6rem" src={product.image} /> : null}</div><div><p className="text-sm">{item.name}</p><p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#efe7d7]/52">Size: {item.size}</p><p className="mt-4 text-sm text-[#c7a76e]">{formatPrice(item.price * item.quantity)}</p></div></div>;
          })}
        </div>
        <div className="border-t border-[#efe7d7]/12 pt-6"><div className="flex justify-between text-sm uppercase tracking-[0.18em]"><span>SUBTOTAL</span><span>{formatPrice(cartSubtotal)}</span></div><button type="button" onClick={closeCart} className="mt-6 w-full border border-[#efe7d7]/18 py-4">CONTINUE SHOPPING</button><button type="button" className="mt-3 w-full border border-[#c7a76e]/60 py-4">CHECKOUT DEMO</button></div>
      </aside>
    </div>
  );
}
