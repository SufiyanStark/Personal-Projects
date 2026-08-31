"use client";

export function InteriorPreview() {
  return (
    <group position={[0, 0, -2.4]}>
      <mesh receiveShadow position={[0, -0.02, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.4, 7.8]} />
        <meshStandardMaterial color="#241d18" metalness={0.16} roughness={0.42} />
      </mesh>
      <mesh receiveShadow position={[0, 2.85, -0.8]}>
        <boxGeometry args={[5.2, 0.24, 4.8]} />
        <meshStandardMaterial color="#181411" metalness={0.18} roughness={0.5} />
      </mesh>
      {[-2.15, 2.15].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 1.35, -0.35]}>
          <boxGeometry args={[0.26, 2.72, 0.3]} />
          <meshStandardMaterial color="#201b17" metalness={0.34} roughness={0.38} />
        </mesh>
      ))}
      {[-1.4, 0, 1.4].map((x) => (
        <mesh key={x} position={[x, 2.69, -1.2]}>
          <cylinderGeometry args={[0.08, 0.13, 0.045, 24]} />
          <meshBasicMaterial color="#ffd28d" />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[-1.28, 0.28, -2.1]}>
        <boxGeometry args={[1.1, 0.54, 0.7]} />
        <meshStandardMaterial color="#3a3028" metalness={0.28} roughness={0.32} />
      </mesh>
      <mesh castShadow receiveShadow position={[1.18, 0.38, -2.45]}>
        <cylinderGeometry args={[0.5, 0.58, 0.76, 36]} />
        <meshStandardMaterial color="#342b24" metalness={0.3} roughness={0.34} />
      </mesh>
    </group>
  );
}
