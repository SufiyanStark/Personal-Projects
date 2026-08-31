"use client";

import { HeroGarment } from "@/components/three/HeroGarment";
import { InteractiveClothingRack } from "@/components/three/InteractiveClothingRack";
import { getProductsByCategory } from "@/data/products";

export function ClothingSection() {
  return (
    <group>
      <InteractiveClothingRack
        label="01 / HOODIES"
        category="hoodies"
        products={getProductsByCategory("hoodies")}
        position={[-2.9, 0.05, -5.75]}
        rotation={[0, 0.32, 0]}
        height={0.74}
      />
      <InteractiveClothingRack
        label="02 / T-SHIRTS"
        category="tshirts"
        products={getProductsByCategory("tshirts")}
        position={[2.9, 0.05, -5.95]}
        rotation={[0, -0.32, 0]}
        height={0.7}
      />
      <InteractiveClothingRack
        label="03 / SHIRTS"
        category="shirts"
        products={getProductsByCategory("shirts")}
        position={[-3.05, 0.05, -7.35]}
        rotation={[0, 0.22, 0]}
        height={0.74}
      />
      <InteractiveClothingRack
        label="04 / JACKETS"
        category="jackets"
        products={getProductsByCategory("jackets")}
        position={[3.05, 0.05, -7.48]}
        rotation={[0, -0.22, 0]}
        height={0.78}
      />
      <InteractiveClothingRack
        label="05 / TROUSERS"
        category="trousers"
        products={getProductsByCategory("trousers")}
        position={[-2.25, 0.05, -8.75]}
        rotation={[0, 0.12, 0]}
        height={0.82}
      />
      <InteractiveClothingRack
        label="06 / COATS"
        category="coats"
        products={getProductsByCategory("coats")}
        position={[2.25, 0.05, -8.9]}
        rotation={[0, -0.12, 0]}
        height={0.9}
      />
      <HeroGarment />
      <mesh position={[0, 2.74, -8.68]}>
        <boxGeometry args={[1.65, 0.032, 0.032]} />
        <meshBasicMaterial color="#f0c47c" />
      </mesh>
      <mesh position={[0, 1.44, -8.9]}>
        <boxGeometry args={[1.65, 2.3, 0.045]} />
        <meshStandardMaterial color="#31261f" roughness={0.52} metalness={0.14} />
      </mesh>
    </group>
  );
}
