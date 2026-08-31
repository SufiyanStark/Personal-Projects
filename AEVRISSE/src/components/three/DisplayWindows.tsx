"use client";

export function DisplayWindows() {
  return (
    <group>
      <group position={[-3.25, 0.03, 0.34]}>
        <mesh castShadow receiveShadow position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.62, 0.72, 0.32, 36]} />
          <meshStandardMaterial color="#201d1a" metalness={0.28} roughness={0.36} />
        </mesh>
        <mesh castShadow position={[0, 1.04, 0]}>
          <capsuleGeometry args={[0.24, 0.9, 8, 16]} />
          <meshStandardMaterial color="#0b0b0b" metalness={0.1} roughness={0.38} />
        </mesh>
        <mesh castShadow position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.18, 24, 16]} />
          <meshStandardMaterial color="#11100f" metalness={0.08} roughness={0.34} />
        </mesh>
        <mesh castShadow position={[0, 1.12, 0.05]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.9, 0.06, 0.05]} />
          <meshStandardMaterial color="#27231f" metalness={0.45} roughness={0.25} />
        </mesh>
        <mesh position={[0, 2.52, -0.02]}>
          <boxGeometry args={[1.65, 0.05, 0.05]} />
          <meshBasicMaterial color="#d8ad70" />
        </mesh>
      </group>

      <group position={[3.25, 0.03, 0.34]}>
        <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.54, 0.62, 0.4, 36]} />
          <meshStandardMaterial color="#1d1a18" metalness={0.32} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.77, 0]}>
          <boxGeometry args={[1.15, 0.42, 0.62]} />
          <meshPhysicalMaterial color="#b7c7c7" opacity={0.26} roughness={0.06} thickness={0.08} transmission={0.55} transparent />
        </mesh>
        <mesh position={[0, 0.9, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.035, 16, 48]} />
          <meshStandardMaterial color="#b79b68" metalness={0.82} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.9, 0.03]}>
          <cylinderGeometry args={[0.14, 0.14, 0.045, 32]} />
          <meshStandardMaterial color="#080808" metalness={0.55} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.5, -0.02]}>
          <boxGeometry args={[1.35, 0.05, 0.05]} />
          <meshBasicMaterial color="#d8ad70" />
        </mesh>
      </group>
    </group>
  );
}
