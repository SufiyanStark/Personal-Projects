"use client";

import { getProduct, products, type Product } from "@/data/products";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

type ProductExperienceContextValue = {
  products: Product[];
  selectedProductId: string | null;
  selectedProduct: Product | null;
  isInspecting: boolean;
  selectedSize: string | null;
  selectedColor: string;
  cartItems: CartItem[];
  cartCount: number;
  notice: string | null;
  validationMessage: string | null;
  dragRotation: { x: number; y: number };
  openInspection: (productId: string) => void;
  closeInspection: () => void;
  selectSize: (size: string) => void;
  selectColor: (color: string) => void;
  setDragRotation: (rotation: { x: number; y: number }) => void;
  addSelectedToBag: () => boolean;
};

const ProductExperienceContext = createContext<ProductExperienceContextValue | null>(null);

export function ProductExperienceProvider({ children }: { children: ReactNode }) {
  const defaultProduct = products[0];
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(defaultProduct.colors[0].name);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });

  const selectedProduct = selectedProductId ? getProduct(selectedProductId) ?? null : null;
  const isInspecting = selectedProduct !== null;

  const openInspection = useCallback((productId: string) => {
    const product = getProduct(productId);
    if (!product) return;

    setSelectedProductId(productId);
    setSelectedColor(product.colors[0].name);
    setSelectedSize(null);
    setValidationMessage(null);
    setDragRotation({ x: 0, y: 0 });
  }, []);

  const closeInspection = useCallback(() => {
    setSelectedProductId(null);
    setValidationMessage(null);
    setDragRotation({ x: 0, y: 0 });
  }, []);

  const selectSize = useCallback((size: string) => {
    setSelectedSize(size);
    setValidationMessage(null);
  }, []);

  const selectColor = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const addSelectedToBag = useCallback(() => {
    const product = selectedProductId ? getProduct(selectedProductId) : null;

    if (!product) return false;

    if (!selectedSize) {
      setValidationMessage("SELECT A SIZE");
      return false;
    }

    setCartItems((items) => {
      const existingIndex = items.findIndex(
        (item) => item.productId === product.id && item.size === selectedSize && item.color === selectedColor,
      );

      if (existingIndex === -1) {
        return [
          ...items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            size: selectedSize,
            color: selectedColor,
          },
        ];
      }

      return items.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });

    setNotice("ADDED TO BAG");
    setValidationMessage(null);
    return true;
  }, [selectedColor, selectedProductId, selectedSize]);

  useEffect(() => {
    if (!notice) return;

    const id = window.setTimeout(() => setNotice(null), 1800);
    return () => window.clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    if (!isInspecting) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeInspection();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeInspection, isInspecting]);

  const value = useMemo<ProductExperienceContextValue>(
    () => ({
      products,
      selectedProductId,
      selectedProduct,
      isInspecting,
      selectedSize,
      selectedColor,
      cartItems,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      notice,
      validationMessage,
      dragRotation,
      openInspection,
      closeInspection,
      selectSize,
      selectColor,
      setDragRotation,
      addSelectedToBag,
    }),
    [
      addSelectedToBag,
      cartItems,
      closeInspection,
      dragRotation,
      isInspecting,
      notice,
      openInspection,
      selectedColor,
      selectedProduct,
      selectedProductId,
      selectedSize,
      selectColor,
      selectSize,
      validationMessage,
    ],
  );

  return <ProductExperienceContext.Provider value={value}>{children}</ProductExperienceContext.Provider>;
}

export function useProductExperience() {
  const context = useContext(ProductExperienceContext);

  if (!context) {
    throw new Error("useProductExperience must be used inside ProductExperienceProvider");
  }

  return context;
}
