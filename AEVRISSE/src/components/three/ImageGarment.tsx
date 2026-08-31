"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Group, LinearFilter, MathUtils, Mesh, SRGBColorSpace } from "three";

type ImageGarmentProps = {
  name?: string;
  src: string;
  imageWidth: number;
  imageHeight: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
  opacity?: number;
  animationOffset?: number;
  scale?: number;
  transparent?: boolean;
  alphaTest?: number;
  interactive?: boolean;
  productId?: string;
  billboardMode?: "none" | "subtle";
  onSelectProduct?: (productId: string) => void;
  onHover?: () => void;
  onLeave?: () => void;
};

export function ImageGarment({
  name,
  src,
  imageWidth,
  imageHeight,
  position,
  rotation = [0, 0, 0],
  height = 1.1,
  opacity = 1,
  animationOffset = 0,
  scale = 1,
  transparent = false,
  alphaTest = 0.02,
  interactive = false,
  productId,
  billboardMode = "none",
  onSelectProduct,
  onHover,
  onLeave,
}: ImageGarmentProps) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const texture = useTexture(src);
  const width = height * (imageWidth / imageHeight);

  const garmentTexture = useMemo(() => {
    const nextTexture = texture.clone();
    nextTexture.colorSpace = SRGBColorSpace;
    nextTexture.anisotropy = 8;
    nextTexture.magFilter = LinearFilter;
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [texture]);

  useEffect(() => () => garmentTexture.dispose(), [garmentTexture]);

  useFrame(({ clock, camera }) => {
    if (!group.current) return;

    const time = clock.elapsedTime + animationOffset;
    const cameraInfluence = billboardMode === "subtle" ? (camera.position.x - group.current.position.x) * 0.01 : 0;
    group.current.position.x = MathUtils.lerp(group.current.position.x, position[0], 0.12);
    group.current.position.y = MathUtils.lerp(group.current.position.y, position[1] + Math.sin(time * 0.62) * 0.012, 0.12);
    group.current.position.z = MathUtils.lerp(group.current.position.z, position[2], 0.12);
    const nextScale = MathUtils.lerp(group.current.scale.x, scale, 0.12);
    group.current.scale.setScalar(nextScale);
    group.current.rotation.x = rotation[0] + Math.sin(time * 0.45) * 0.01;
    group.current.rotation.y = rotation[1] + cameraInfluence + Math.sin(time * 0.55) * 0.018;
    group.current.rotation.z = rotation[2] + Math.sin(time * 0.48) * 0.006;
  });

  return (
    <group
      ref={group}
      name={name}
      position={position}
      rotation={rotation}
      onClick={(event) => {
        if (!interactive || !productId) return;
        event.stopPropagation();
        onSelectProduct?.(productId);
      }}
      onPointerEnter={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover?.();
      }}
      onPointerLeave={() => {
        if (!interactive) return;
        document.body.style.cursor = "auto";
        onLeave?.();
      }}
    >
      <mesh ref={mesh} castShadow={false} receiveShadow={false}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          alphaTest={transparent ? alphaTest : 0}
          color="#ffffff"
          depthWrite={!transparent}
          map={garmentTexture}
          opacity={opacity}
          side={DoubleSide}
          transparent={transparent || opacity < 1}
          toneMapped
        />
      </mesh>
    </group>
  );
}

[
  "hoodie-01",
  "hoodie-02",
  "hoodie-03",
  "hoodie-04",
  "tshirt-01",
  "tshirt-02",
  "tshirt-03",
  "tshirt-04",
  "shirt-01",
  "shirt-02",
  "shirt-03",
  "shirt-04",
  "jacket-01",
  "jacket-02",
  "jacket-03",
  "jacket-04",
  "trousers-01",
  "trousers-02",
  "trousers-03",
  "trousers-04",
  "coat-01",
  "coat-02",
  "coat-03",
  "coat-04",
].forEach((id) => useTexture.preload(`/models/clothing/clean/${id}.png`));
