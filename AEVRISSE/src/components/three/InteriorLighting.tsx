"use client";

export function InteriorLighting() {
  return (
    <>
      <hemisphereLight args={["#f0d5aa", "#2c241e", 0.42]} />
      <pointLight color="#e5b173" distance={7.5} intensity={2.4} position={[-2.35, 2.18, -6.15]} />
      <pointLight color="#e5b173" distance={7.5} intensity={2.2} position={[2.35, 2.15, -6.45]} />
      <spotLight color="#ffd99d" intensity={4.2} angle={0.5} penumbra={0.72} position={[-2.2, 2.7, -5.25]} target-position={[-2.2, 1.05, -6.2]} />
      <spotLight color="#ffd99d" intensity={3.9} angle={0.5} penumbra={0.72} position={[2.2, 2.7, -5.45]} target-position={[2.2, 1.05, -6.5]} />
      <spotLight color="#ffe0aa" intensity={8.1} angle={0.44} penumbra={0.68} position={[0, 3.1, -6.65]} target-position={[0, 1.15, -8.72]} />
      <pointLight color="#f4c17c" distance={6.6} intensity={5.2} position={[0, 1.78, -7.15]} />
      <pointLight color="#d8b37a" distance={4.8} intensity={2.4} position={[0.95, 1.55, -8.05]} />
      <pointLight color="#c99b64" distance={4.8} intensity={2.1} position={[-0.95, 1.65, -8.2]} />
    </>
  );
}
