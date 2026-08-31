"use client";

import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AmbientLight, Color, DirectionalLight, MathUtils, PointLight, SpotLight } from "three";
import { getPhaseOneProgress, getPhaseTwoProgress } from "@/lib/experienceProgress";

const cool = new Color("#7f93a0");
const warm = new Color("#e7bc80");

export function Lighting() {
  const scroll = useScroll();
  const ambient = useRef<AmbientLight>(null);
  const exteriorKey = useRef<DirectionalLight>(null);
  const interiorGlow = useRef<PointLight>(null);
  const leftSpot = useRef<SpotLight>(null);
  const rightSpot = useRef<SpotLight>(null);

  useFrame(() => {
    const phaseOneProgress = getPhaseOneProgress(scroll.offset);
    const phaseTwoProgress = getPhaseTwoProgress(scroll.offset);
    const interiorProgress = MathUtils.smoothstep(phaseOneProgress, 0.68, 0.92);
    const boutiqueProgress = MathUtils.smoothstep(phaseTwoProgress, 0.08, 0.75);

    if (ambient.current) {
      ambient.current.intensity = MathUtils.lerp(0.5, 0.92, Math.max(interiorProgress, boutiqueProgress * 0.85));
      ambient.current.color.copy(cool).lerp(warm, interiorProgress * 0.68);
    }

    if (exteriorKey.current) {
      exteriorKey.current.intensity = MathUtils.lerp(1.1, 0.62, interiorProgress);
    }

    if (interiorGlow.current) {
      interiorGlow.current.intensity = MathUtils.lerp(1.1, 4.9, Math.max(interiorProgress, boutiqueProgress));
    }

    if (leftSpot.current) leftSpot.current.intensity = MathUtils.lerp(2.2, 1.25, interiorProgress);
    if (rightSpot.current) rightSpot.current.intensity = MathUtils.lerp(2, 1.2, interiorProgress);
  });

  return (
    <>
      <ambientLight ref={ambient} color="#7f93a0" intensity={0.5} />
      <directionalLight
        ref={exteriorKey}
        castShadow
        color="#9db0bd"
        intensity={1.1}
        position={[-4, 6, 7]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight ref={interiorGlow} color="#e7b56f" distance={9} intensity={1.1} position={[0, 2.25, -2.15]} />
      <spotLight ref={leftSpot} castShadow color="#f1c98d" intensity={2.2} angle={0.35} penumbra={0.65} position={[-3.1, 3.5, 1.4]} target-position={[-3.25, 0.6, 0.1]} />
      <spotLight ref={rightSpot} castShadow color="#f1c98d" intensity={2} angle={0.34} penumbra={0.7} position={[3.1, 3.4, 1.4]} target-position={[3.35, 0.55, 0.1]} />
      <spotLight color="#f5c37c" intensity={3.2} angle={0.55} penumbra={0.58} position={[0, 3.1, -1.25]} target-position={[0, 0.65, -3.25]} />
    </>
  );
}
