"use client";

import { ImageGarment } from "@/components/three/ImageGarment";
import { useProductExperience } from "@/context/ProductExperienceContext";
import type { Product, ProductCategory } from "@/data/products";
import { Text } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group, MathUtils } from "three";

type InteractiveClothingRackProps = {
  label: string;
  category: ProductCategory;
  products: Product[];
  position: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function InteractiveClothingRack({
  label,
  category,
  products,
  position,
  rotation = [0, 0, 0],
  height = 0.82,
}: InteractiveClothingRackProps) {
  const { openInspection } = useProductExperience();
  const group = useRef<Group>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rackPointer, setRackPointer] = useState(0);
  const activeProduct = products[activeIndex];
  const focusedProduct = useMemo(
    () => products.find((product) => product.id === hoveredId) ?? activeProduct,
    [activeProduct, hoveredId, products],
  );

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, rotation[1] + rackPointer * 0.035, 0.08);
  });

  const handleRackPointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const localX = event.point.x - position[0];
    setRackPointer(MathUtils.clamp(localX / 2.2, -1, 1));
  };

  const shift = (direction: 1 | -1) => {
    setActiveIndex((index) => (index + direction + products.length) % products.length);
    setHoveredId(null);
  };

  return (
    <group
      ref={group}
      name={`${category}-interactive-rack`}
      position={position}
      rotation={rotation}
      onPointerMove={handleRackPointer}
      onPointerLeave={() => {
        setRackPointer(0);
        setHoveredId(null);
      }}
    >
      <mesh position={[0, 1.55, -0.04]}>
        <boxGeometry args={[2.55, 0.04, 0.04]} />
        <meshStandardMaterial color="#5a5044" roughness={0.22} metalness={0.74} />
      </mesh>
      <mesh position={[0, 1.61, -0.07]}>
        <boxGeometry args={[1.95, 0.018, 0.018]} />
        <meshBasicMaterial color="#d8ad70" />
      </mesh>
      {[-1.12, 1.12].map((x) => (
        <mesh key={x} position={[x, 0.8, -0.04]}>
          <boxGeometry args={[0.045, 1.55, 0.045]} />
          <meshStandardMaterial color="#4c453b" roughness={0.25} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.04, -0.06]} receiveShadow>
        <boxGeometry args={[2.7, 0.08, 0.48]} />
        <meshStandardMaterial color="#25211c" roughness={0.4} metalness={0.18} />
      </mesh>
      <Text anchorX="center" anchorY="middle" color="#d7bd8b" fontSize={0.085} letterSpacing={0.28} position={[0, 1.9, -0.02]}>
        {label}
      </Text>
      {products.map((product, index) => {
        const relative = ((index - activeIndex + products.length + 2) % products.length) - 2;
        const isHovered = hoveredId === product.id;
        const isActive = index === activeIndex;
        const emphasis = isHovered || (isActive && hoveredId === null);
        const neighborPush = hoveredId && !isHovered ? Math.sign(relative || index - activeIndex || 1) * 0.08 : 0;
        const x = relative * 0.44 + neighborPush + rackPointer * 0.035;
        const z = emphasis ? 0.16 : -0.05 - Math.abs(relative) * 0.04;
        const y = 0.9 + (emphasis ? 0.04 : 0);
        const productHeight = product.category === "trousers" ? height * 1.18 : product.category === "coats" ? height * 1.16 : height;

        return (
          <group key={product.id}>
            <mesh position={[x, 1.48, z - 0.03]} rotation={[0, 0, 0.08 * Math.sign(relative || 1)]}>
              <cylinderGeometry args={[0.007, 0.007, 0.18, 8]} />
              <meshStandardMaterial color="#9a8358" roughness={0.34} metalness={0.68} />
            </mesh>
            <ImageGarment
              name={`${category}-${product.id}`}
              src={product.image}
              imageWidth={product.imageWidth}
              imageHeight={product.imageHeight}
              position={[x, y, z]}
              rotation={[0, -rotation[1] * 0.25 + relative * 0.025, 0]}
              height={productHeight}
              scale={emphasis ? 1.07 : 0.9 - Math.min(Math.abs(relative), 2) * 0.08}
              transparent
              alphaTest={0.05}
              animationOffset={index * 0.8}
              billboardMode="subtle"
              interactive
              productId={product.id}
              onHover={() => setHoveredId(product.id)}
              onLeave={() => setHoveredId(null)}
              onSelectProduct={openInspection}
            />
          </group>
        );
      })}
      {focusedProduct ? (
        <group position={[0, 0.28, 0.35]}>
          <Text anchorX="center" anchorY="middle" color="#efe7d7" fontSize={0.065} letterSpacing={0.2} position={[0, 0.2, 0]}>
            AEVRISSE
          </Text>
          <Text anchorX="center" anchorY="middle" color="#f6efe3" fontSize={0.075} letterSpacing={0.16} position={[0, 0.08, 0]}>
            {focusedProduct.name.replace("AEVRISSE ", "").toUpperCase()}
          </Text>
          <Text anchorX="center" anchorY="middle" color="#d2b37a" fontSize={0.07} letterSpacing={0.12} position={[0, -0.04, 0]}>
            {formatPrice(focusedProduct.price)}
          </Text>
          <Text anchorX="center" anchorY="middle" color="#d2b37a" fontSize={0.055} letterSpacing={0.28} position={[0, -0.16, 0]}>
            VIEW
          </Text>
        </group>
      ) : null}
      <Text
        anchorX="center"
        anchorY="middle"
        color="#d7bd8b"
        fontSize={0.18}
        position={[-1.43, 0.88, 0.1]}
        onClick={(event) => {
          event.stopPropagation();
          shift(-1);
        }}
      >
        {"<"}
      </Text>
      <Text
        anchorX="center"
        anchorY="middle"
        color="#d7bd8b"
        fontSize={0.18}
        position={[1.43, 0.88, 0.1]}
        onClick={(event) => {
          event.stopPropagation();
          shift(1);
        }}
      >
        {">"}
      </Text>
    </group>
  );
}
