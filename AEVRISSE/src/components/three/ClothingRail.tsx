"use client";

import { ImageGarment } from "@/components/three/ImageGarment";

type ClothingRailProps = {
  id: string;
  position: [number, number, number];
  rotationY?: number;
  side?: "left" | "right";
};

export function ClothingRail({ id, position, rotationY = 0, side = "left" }: ClothingRailProps) {
  const sign = side === "left" ? -1 : 1;
  const garments =
    side === "left"
      ? [
          { id: "hoodie-1", src: "/models/clothing/clean/hoodie-01.png", x: -0.66, y: 1.14, height: 0.66, transparent: true, offset: 0.2 },
          { id: "hoodie-2", src: "/models/clothing/clean/hoodie-02.png", x: 0, y: 1.14, height: 0.68, transparent: true, offset: 1.3 },
          { id: "hoodie-3", src: "/models/clothing/clean/hoodie-03.png", x: 0.66, y: 1.14, height: 0.66, transparent: true, offset: 2.2 },
        ]
      : [
          { id: "hoodie-4", src: "/models/clothing/clean/hoodie-04.png", x: -0.54, y: 1.14, height: 0.68, transparent: true, offset: 0.6 },
          { id: "hoodie-main", src: "/models/clothing/clean/hoodie-04.png", x: 0.54, y: 1.08, height: 0.9, transparent: true, offset: 1.7 },
        ];

  return (
    <group name={id} position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.72, 0]}>
        <boxGeometry args={[2.55, 0.045, 0.045]} />
        <meshStandardMaterial color="#5a5044" roughness={0.22} metalness={0.74} />
      </mesh>
      <mesh position={[0, 1.78, -0.035]}>
        <boxGeometry args={[1.86, 0.018, 0.018]} />
        <meshBasicMaterial color="#d8ad70" />
      </mesh>
      {[-1.08, 1.08].map((x) => (
        <mesh key={x} position={[x, 0.88, 0]}>
          <boxGeometry args={[0.045, 1.72, 0.045]} />
          <meshStandardMaterial color="#4c453b" roughness={0.25} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[2.65, 0.08, 0.52]} />
        <meshStandardMaterial color="#25211c" roughness={0.4} metalness={0.18} />
      </mesh>
      {garments.map((garment, index) => (
        <group key={garment.id} position={[0, 0, index * 0.035]}>
          <mesh position={[garment.x, 1.62, 0.005]} rotation={[0, 0, 0.16 * sign]}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
            <meshStandardMaterial color="#9a8358" roughness={0.34} metalness={0.68} />
          </mesh>
          <ImageGarment
            name={`${id}-${garment.id}`}
            src={garment.src}
            imageWidth={garment.src.includes("hoodie-main") ? 1600 : 2816}
            imageHeight={garment.src.includes("hoodie-main") ? 1200 : 1536}
            position={[garment.x, garment.y, 0.055]}
            rotation={[0, (0.05 - index * 0.035) * sign, 0]}
            height={garment.height}
            transparent={garment.transparent}
            animationOffset={garment.offset}
            billboardMode="subtle"
          />
        </group>
      ))}
    </group>
  );
}
