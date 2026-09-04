"use client";

import { AevrisseScene } from "@/components/three/AevrisseScene";
import { useProductExperience } from "@/context/ProductExperienceContext";
import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";

type ExperienceCanvasProps = {
  onReady: () => void;
};

function ReadySignal({ onReady }: ExperienceCanvasProps) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}

export function ExperienceCanvas({ onReady }: ExperienceCanvasProps) {
  const { isInspecting } = useProductExperience();

  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop={isInspecting ? "never" : "always"}
      camera={{ position: [3, 1.65, 9], fov: 50, near: 0.05, far: 80 }}
      gl={{ antialias: true, alpha: false }}
      className="h-screen w-screen bg-[#050505]"
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 9, 27]} />
      <Suspense fallback={null}>
        <ScrollControls pages={15} damping={0.24} distance={1} enabled={!isInspecting}>
          <AevrisseScene />
        </ScrollControls>
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
