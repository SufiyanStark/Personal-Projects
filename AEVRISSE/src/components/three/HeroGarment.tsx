"use client";

import { ImageGarment } from "@/components/three/ImageGarment";
import { useProductExperience } from "@/context/ProductExperienceContext";
import { getProduct } from "@/data/products";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, MathUtils, Vector3 } from "three";

const showroomPosition = new Vector3(0, 0, -8.8);
const inspectionPosition = new Vector3(-0.2, -0.22, -7.85);
const showroomScale = new Vector3(1, 1, 1);
const inspectionScale = new Vector3(1.08, 1.08, 1.08);

export function HeroGarment() {
  const {
    dragRotation,
    isInspecting,
    openInspection,
    selectedProductId,
  } = useProductExperience();
  const displayedProduct = getProduct(isInspecting && selectedProductId ? selectedProductId : "jacket-01");
  const group = useRef<Group>(null);
  const garment = useRef<Group>(null);
  const isHeroInspecting = isInspecting && selectedProductId !== null;
  const constrainedDragX = MathUtils.clamp(dragRotation.x, -0.07, 0.07);
  const constrainedDragY = MathUtils.clamp(dragRotation.y, -0.14, 0.14);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;

    const damping = 1 - Math.exp(-delta * 4.7);
    const time = clock.elapsedTime;
    const targetPosition = isHeroInspecting ? inspectionPosition : showroomPosition;
    const targetScale = isHeroInspecting ? inspectionScale : showroomScale;

    group.current.position.lerp(targetPosition, damping);
    group.current.scale.lerp(targetScale, damping);

    if (garment.current) {
      const idleY = isHeroInspecting ? Math.sin(time * 0.24) * 0.025 : Math.sin(time * 0.38) * 0.075;
      const idleLift = isHeroInspecting ? Math.sin(time * 0.5) * 0.015 : Math.sin(time * 0.55) * 0.035;
      garment.current.rotation.x = MathUtils.lerp(garment.current.rotation.x, isHeroInspecting ? constrainedDragX : 0, damping);
      garment.current.rotation.y = MathUtils.lerp(
        garment.current.rotation.y,
        isHeroInspecting ? constrainedDragY + idleY : idleY,
        damping,
      );
      garment.current.position.y = MathUtils.lerp(garment.current.position.y, 1.35 + idleLift, damping);
    }
  });

  return (
    <group
      ref={group}
      name="hero-garment-form-01"
      position={[0, 0, -8.8]}
      onClick={(event) => {
        event.stopPropagation();
        if (isHeroInspecting) return;
        openInspection("jacket-01");
      }}
      onPointerEnter={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh position={[0, 0.14, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 1.06, 0.26, 44]} />
        <meshStandardMaterial color="#211a15" roughness={0.34} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.72, 0.84, 0.04, 44]} />
        <meshBasicMaterial color="#8e6e42" />
      </mesh>
      <mesh position={[0, 1.42, -0.08]}>
        <boxGeometry args={[2.05, 2.08, 0.035]} />
        <meshBasicMaterial color={isHeroInspecting ? "#403226" : "#32261f"} />
      </mesh>
      <group ref={garment}>
        <mesh position={[0, -0.02, -0.025]}>
          <planeGeometry args={[2.32, 1.42]} />
          <meshBasicMaterial color="#0b0908" transparent opacity={0.68} />
        </mesh>
        <ImageGarment
          name="hero-jacket-image"
          src={displayedProduct?.image ?? "/models/clothing/clean/jacket-01.png"}
          imageWidth={displayedProduct?.imageWidth ?? 2048}
          imageHeight={displayedProduct?.imageHeight ?? 2048}
          position={[0, -0.02, 0.03]}
          height={isHeroInspecting ? 1.42 : 1.32}
          transparent
          animationOffset={0.8}
          billboardMode="subtle"
        />
      </group>
      <mesh position={[0, 1.34, 0.18]}>
        <boxGeometry args={[1.55, 2.45, 0.45]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
