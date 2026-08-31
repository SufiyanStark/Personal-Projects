"use client";

import { Text } from "@react-three/drei";

function Panel({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh castShadow receiveShadow position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#121111" metalness={0.18} roughness={0.5} />
    </mesh>
  );
}

export function StoreExterior() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.04, 2.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 15]} />
        <meshStandardMaterial color="#111111" metalness={0.08} roughness={0.64} />
      </mesh>
      {[-5.7, -3.8, -1.9, 0, 1.9, 3.8, 5.7].map((x) => (
        <mesh key={x} position={[x, -0.035, 2.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.018, 15]} />
          <meshBasicMaterial color="#2c2926" />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.09, 5.15]}>
        <boxGeometry args={[14, 0.26, 0.55]} />
        <meshStandardMaterial color="#171514" metalness={0.18} roughness={0.48} />
      </mesh>

      <Panel position={[-4.55, 1.85, 0]} scale={[2.7, 3.7, 0.36]} />
      <Panel position={[4.55, 1.85, 0]} scale={[2.7, 3.7, 0.36]} />
      <Panel position={[0, 3.55, 0]} scale={[9.9, 1.1, 0.42]} />
      <Panel position={[-1.58, 1.48, 0]} scale={[0.38, 3.05, 0.46]} />
      <Panel position={[1.58, 1.48, 0]} scale={[0.38, 3.05, 0.46]} />
      <Panel position={[0, 3.03, 0.02]} scale={[2.9, 0.32, 0.52]} />

      <mesh position={[-3.25, 1.55, 0.12]}>
        <boxGeometry args={[2.15, 2.7, 0.055]} />
        <meshPhysicalMaterial color="#b7c8c8" metalness={0} opacity={0.28} roughness={0.08} thickness={0.08} transmission={0.5} transparent />
      </mesh>
      <mesh position={[3.25, 1.55, 0.12]}>
        <boxGeometry args={[2.15, 2.7, 0.055]} />
        <meshPhysicalMaterial color="#b7c8c8" metalness={0} opacity={0.28} roughness={0.08} thickness={0.08} transmission={0.5} transparent />
      </mesh>

      <mesh position={[0, 3.6, 0.28]}>
        <boxGeometry args={[3.7, 0.62, 0.1]} />
        <meshStandardMaterial color="#080808" metalness={0.68} roughness={0.28} />
      </mesh>
      <Text anchorX="center" anchorY="middle" color="#f6efe4" fontSize={0.34} letterSpacing={0.32} position={[0, 3.68, 0.36]}>
        AEVRISSE
      </Text>
      <Text anchorX="center" anchorY="middle" color="#bca986" fontSize={0.075} letterSpacing={0.42} position={[0, 3.28, 0.36]}>
        MAISON DE MODE
      </Text>

      <mesh receiveShadow position={[0, 2.98, -0.55]}>
        <boxGeometry args={[2.6, 0.22, 1.45]} />
        <meshStandardMaterial color="#191512" metalness={0.25} roughness={0.42} />
      </mesh>
      <mesh receiveShadow position={[0, 0.02, -0.63]}>
        <boxGeometry args={[2.72, 0.08, 1.65]} />
        <meshStandardMaterial color="#24201d" metalness={0.12} roughness={0.48} />
      </mesh>
    </group>
  );
}
