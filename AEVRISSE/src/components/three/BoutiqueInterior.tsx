"use client";

import { InteriorLighting } from "@/components/three/InteriorLighting";
import { Text } from "@react-three/drei";

function WallPanel({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#211c18" roughness={0.48} metalness={0.12} />
    </mesh>
  );
}

export function BoutiqueInterior() {
  return (
    <group name="phase-2-boutique-interior">
      <InteriorLighting />
      <mesh position={[0, -0.025, -7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.6, 10.5]} />
        <meshStandardMaterial color="#2b241f" roughness={0.36} metalness={0.15} />
      </mesh>
      <mesh position={[0, 2.95, -7]} receiveShadow>
        <boxGeometry args={[7.6, 0.22, 10.2]} />
        <meshStandardMaterial color="#181513" roughness={0.58} metalness={0.08} />
      </mesh>
      <WallPanel position={[-3.9, 1.45, -6.7]} scale={[0.24, 2.9, 8.6]} />
      <WallPanel position={[3.9, 1.45, -6.7]} scale={[0.24, 2.9, 8.6]} />
      <WallPanel position={[0, 1.5, -10.85]} scale={[7.8, 3, 0.28]} />
      {[-2.25, 2.25].map((x) => (
        <mesh key={x} position={[x, 1.45, -5.08]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 2.9, 0.38]} />
          <meshStandardMaterial color="#342b24" roughness={0.34} metalness={0.34} />
        </mesh>
      ))}
      {[-2.7, 0, 2.7].map((x) => (
        <mesh key={x} position={[x, 2.82, -7.35]}>
          <cylinderGeometry args={[0.12, 0.18, 0.05, 28]} />
          <meshBasicMaterial color="#f3c983" />
        </mesh>
      ))}
      <mesh position={[-3.72, 1.55, -7.3]}>
        <boxGeometry args={[0.035, 2.1, 2.6]} />
        <meshPhysicalMaterial color="#566060" roughness={0.08} metalness={0.05} transmission={0.28} transparent opacity={0.22} />
      </mesh>
      <mesh position={[3.72, 1.55, -7.55]}>
        <boxGeometry args={[0.035, 2.1, 2.6]} />
        <meshPhysicalMaterial color="#566060" roughness={0.08} metalness={0.05} transmission={0.28} transparent opacity={0.22} />
      </mesh>
      <mesh position={[0, 1.45, -11.04]}>
        <boxGeometry args={[2.0, 2.0, 0.045]} />
        <meshStandardMaterial color="#211915" roughness={0.62} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.18, -10.98]}>
        <boxGeometry args={[1.2, 1.56, 0.05]} />
        <meshBasicMaterial color="#17110f" />
      </mesh>
      <Text anchorX="center" anchorY="middle" color="#d7bd8b" fontSize={0.12} letterSpacing={0.45} position={[0, 2.18, -10.68]}>
        COLLECTION 01
      </Text>
      <mesh position={[0, 2.18, -8.95]}>
        <boxGeometry args={[1.35, 0.025, 0.035]} />
        <meshBasicMaterial color="#b58d55" />
      </mesh>
      {[-1.65, 1.65].map((x) => (
        <mesh key={x} position={[x, 0.012, -6.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.82, 36]} />
          <meshBasicMaterial color="#5b4630" transparent opacity={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.012, -8.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 40]} />
        <meshBasicMaterial color="#725735" transparent opacity={0.24} />
      </mesh>
      <mesh position={[-1.62, 0.92, -6.75]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.7, 0.08]} />
        <meshStandardMaterial color="#1a1512" roughness={0.54} metalness={0.12} />
      </mesh>
      <mesh position={[1.62, 0.92, -6.75]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 1.7, 0.08]} />
        <meshStandardMaterial color="#25201b" roughness={0.54} metalness={0.12} />
      </mesh>
      <mesh position={[-1.62, 1.86, -6.7]}>
        <boxGeometry args={[0.76, 0.04, 0.04]} />
        <meshBasicMaterial color="#b58d55" />
      </mesh>
      <mesh position={[1.62, 1.86, -6.7]}>
        <boxGeometry args={[0.76, 0.04, 0.04]} />
        <meshBasicMaterial color="#b58d55" />
      </mesh>
    </group>
  );
}
