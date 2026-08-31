"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";

type GarmentPlaceholderProps = {
  id: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  accentColor?: string;
  motionEnabled?: boolean;
  variant?: "coat" | "hoodie" | "shirt" | "jacket" | "trousers";
  motionOffset?: number;
};

const garmentMaterial = { roughness: 0.78, metalness: 0.03 };
const seamMaterial = { roughness: 0.48, metalness: 0.3 };

export function GarmentPlaceholder({
  id,
  position,
  rotation = [0, 0, 0],
  color = "#111111",
  accentColor = "#b99762",
  motionEnabled = true,
  variant = "coat",
  motionOffset = 0,
}: GarmentPlaceholderProps) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;

    if (!motionEnabled) {
      group.current.position.set(position[0], position[1], position[2]);
      group.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      return;
    }

    const time = clock.elapsedTime + motionOffset;
    group.current.rotation.z = rotation[2] + Math.sin(time * 0.75) * 0.018;
    group.current.rotation.y = rotation[1] + Math.sin(time * 0.45) * 0.028;
    group.current.position.y = position[1] + Math.sin(time * 0.62) * 0.018;
  });

  return (
    <group ref={group} name={id} position={position} rotation={rotation}>
      {variant === "hoodie" ? (
        <>
          <mesh position={[0, 0.1, -0.015]} castShadow>
            <boxGeometry args={[0.72, 0.82, 0.1]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, 0.57, -0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.22, 0.055, 12, 28, MathUtils.degToRad(300)]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, 0.14, 0.055]}>
            <boxGeometry args={[0.34, 0.32, 0.018]} />
            <meshStandardMaterial color="#1a1512" roughness={0.66} metalness={0.08} />
          </mesh>
          <mesh position={[-0.48, 0.02, 0]} rotation={[0, 0, -0.18]} castShadow>
            <boxGeometry args={[0.16, 0.76, 0.085]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0.48, 0.02, 0]} rotation={[0, 0, 0.18]} castShadow>
            <boxGeometry args={[0.16, 0.76, 0.085]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
        </>
      ) : null}
      {variant === "shirt" ? (
        <>
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[0.7, 0.13, 0.075]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.6, 0.72, 0.075]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[-0.43, 0.03, 0]} rotation={[0, 0, -0.46]} castShadow>
            <boxGeometry args={[0.16, 0.4, 0.07]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0.43, 0.03, 0]} rotation={[0, 0, 0.46]} castShadow>
            <boxGeometry args={[0.16, 0.4, 0.07]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, 0.14, 0.045]}>
            <boxGeometry args={[0.08, 0.58, 0.018]} />
            <meshStandardMaterial color={accentColor} {...seamMaterial} />
          </mesh>
        </>
      ) : null}
      {variant === "jacket" ? (
        <>
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.82, 0.16, 0.1]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[0.68, 0.78, 0.1]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[-0.22, 0.02, 0.06]} rotation={[0, 0, -0.18]}>
            <boxGeometry args={[0.045, 0.62, 0.025]} />
            <meshStandardMaterial color={accentColor} {...seamMaterial} />
          </mesh>
          <mesh position={[0.22, 0.02, 0.06]} rotation={[0, 0, 0.18]}>
            <boxGeometry args={[0.045, 0.62, 0.025]} />
            <meshStandardMaterial color={accentColor} {...seamMaterial} />
          </mesh>
          <mesh position={[-0.53, -0.15, 0]} rotation={[0, 0, -0.1]} castShadow>
            <boxGeometry args={[0.16, 0.82, 0.085]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0.53, -0.15, 0]} rotation={[0, 0, 0.1]} castShadow>
            <boxGeometry args={[0.16, 0.82, 0.085]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
        </>
      ) : null}
      {variant === "trousers" ? (
        <>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.68, 0.13, 0.09]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[-0.18, -0.36, 0]} castShadow>
            <boxGeometry args={[0.25, 1.12, 0.08]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0.18, -0.36, 0]} castShadow>
            <boxGeometry args={[0.25, 1.12, 0.08]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, -0.32, 0.052]}>
            <boxGeometry args={[0.035, 1.02, 0.018]} />
            <meshStandardMaterial color={accentColor} {...seamMaterial} />
          </mesh>
        </>
      ) : null}
      {variant === "coat" ? (
        <>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.82, 0.16, 0.1]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, -0.32, 0]} castShadow>
            <boxGeometry args={[0.78, 1.18, 0.095]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[-0.54, -0.24, 0]} rotation={[0, 0, -0.08]} castShadow>
            <boxGeometry args={[0.16, 1.05, 0.085]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0.54, -0.24, 0]} rotation={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[0.16, 1.05, 0.085]} />
            <meshStandardMaterial color={color} {...garmentMaterial} />
          </mesh>
          <mesh position={[0, -0.04, 0.058]}>
            <boxGeometry args={[0.055, 1.03, 0.022]} />
            <meshStandardMaterial color={accentColor} {...seamMaterial} />
          </mesh>
        </>
      ) : null}
      <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.012, 8, 24, MathUtils.degToRad(285)]} />
        <meshStandardMaterial color="#7d6a48" roughness={0.32} metalness={0.68} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.42, 8]} />
        <meshStandardMaterial color="#8d7851" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}
