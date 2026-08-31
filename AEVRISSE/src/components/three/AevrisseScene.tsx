"use client";

import { CameraRig } from "@/components/three/CameraRig";
import { BoutiqueInterior } from "@/components/three/BoutiqueInterior";
import { DisplayWindows } from "@/components/three/DisplayWindows";
import { GlassDoors } from "@/components/three/GlassDoors";
import { InteriorPreview } from "@/components/three/InteriorPreview";
import { Lighting } from "@/components/three/Lighting";
import { ScrollProgressBridge } from "@/components/three/ScrollProgressBridge";
import { StoreExterior } from "@/components/three/StoreExterior";

export function AevrisseScene() {
  return (
    <>
      <CameraRig />
      <ScrollProgressBridge />
      <Lighting />
      <StoreExterior />
      <DisplayWindows />
      <GlassDoors />
      <InteriorPreview />
      <BoutiqueInterior />
    </>
  );
}
