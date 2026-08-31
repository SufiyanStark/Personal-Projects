"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, Mesh } from "three";
import { getPhaseOneProgress } from "@/lib/experienceProgress";

const closedLeftX = -0.46;
const closedRightX = 0.46;
const openingDistance = 0.72;

function getDoorProgress(offset: number) {
  return MathUtils.clamp((offset - 0.62) / (0.75 - 0.62), 0, 1);
}

export function GlassDoors() {
  const scroll = useScroll();
  const leftDoor = useRef<Mesh>(null);
  const rightDoor = useRef<Mesh>(null);

  useFrame(() => {
    const progress = getDoorProgress(getPhaseOneProgress(scroll.offset));

    if (leftDoor.current) {
      leftDoor.current.position.x = closedLeftX - openingDistance * progress;
    }

    if (rightDoor.current) {
      rightDoor.current.position.x = closedRightX + openingDistance * progress;
    }
  });

  return (
    <group position={[0, 1.42, 0.08]}>
      <mesh ref={leftDoor} position={[closedLeftX, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 2.85, 0.045]} />
        <meshPhysicalMaterial
          color="#b7c4c4"
          ior={1.45}
          metalness={0}
          opacity={0.34}
          roughness={0.06}
          thickness={0.12}
          transmission={0.62}
          transparent
        />
      </mesh>
      <mesh ref={rightDoor} position={[closedRightX, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 2.85, 0.045]} />
        <meshPhysicalMaterial
          color="#b7c4c4"
          ior={1.45}
          metalness={0}
          opacity={0.34}
          roughness={0.06}
          thickness={0.12}
          transmission={0.62}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[0.035, 2.9, 0.05]} />
        <meshStandardMaterial color="#181818" metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[-0.96, 0, 0.04]}>
        <boxGeometry args={[0.035, 2.95, 0.08]} />
        <meshStandardMaterial color="#141414" metalness={0.8} roughness={0.24} />
      </mesh>
      <mesh position={[0.96, 0, 0.04]}>
        <boxGeometry args={[0.035, 2.95, 0.08]} />
        <meshStandardMaterial color="#141414" metalness={0.8} roughness={0.24} />
      </mesh>
    </group>
  );
}
