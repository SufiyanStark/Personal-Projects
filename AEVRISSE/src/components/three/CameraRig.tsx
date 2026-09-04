"use client";

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, MathUtils, Vector3 } from "three";
import { CAMERA_SETTLE_END, getPhaseOneProgress, getPhaseTwoProgress, PHASE_ONE_END } from "@/lib/experienceProgress";

const cameraPoints = [
  new Vector3(3.2, 1.55, 9.2),
  new Vector3(2.45, 1.6, 7.35),
  new Vector3(1.55, 1.66, 5.55),
  new Vector3(0.82, 1.68, 3.9),
  new Vector3(0.32, 1.65, 2.35),
  new Vector3(0.08, 1.62, 1.25),
  new Vector3(0.04, 1.6, 0.44),
  new Vector3(0.02, 1.59, -0.72),
  new Vector3(0, 1.58, -2.15),
  new Vector3(-0.05, 1.58, -3.35),
];

const lookPoints = [
  new Vector3(0.2, 1.45, 0.1),
  new Vector3(0.05, 1.65, -0.35),
  new Vector3(0, 1.55, -1.25),
  new Vector3(0, 1.42, -3.9),
];

const interiorCameraPoints = [
  new Vector3(-0.05, 1.58, -3.35),
  new Vector3(-0.18, 1.58, -4.15),
  new Vector3(-0.38, 1.58, -4.55),
  new Vector3(0.08, 1.57, -4.74),
  new Vector3(0.2, 1.57, -4.88),
  new Vector3(0.06, 1.58, -5.05),
  new Vector3(-0.18, 1.6, -5.35),
  new Vector3(0.16, 1.57, -5.72),
  new Vector3(0.34, 1.58, -6.35),
  new Vector3(-0.28, 1.6, -7.08),
  new Vector3(-0.08, 1.57, -7.84),
  new Vector3(0.22, 1.56, -8.58),
  new Vector3(0, 1.55, -9.25),
];

const interiorLookPoints = [
  new Vector3(0, 1.42, -3.9),
  new Vector3(-1.8, 1.22, -6.25),
  new Vector3(1.8, 1.22, -6.6),
  new Vector3(0, 1.34, -8.72),
  new Vector3(-0.55, 1.28, -9.1),
  new Vector3(0.64, 1.3, -9.45),
  new Vector3(0.2, 1.26, -10.08),
  new Vector3(-0.42, 1.28, -10.65),
  new Vector3(0, 1.3, -11.35),
];

const finalCameraPosition = interiorCameraPoints[interiorCameraPoints.length - 1];
const finalLookTarget = interiorLookPoints[interiorLookPoints.length - 1];
const CAMERA_SETTLE_EPSILON = 0.0008;

export function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();
  const currentPosition = useRef(new Vector3(3.2, 1.55, 9.2));
  const currentLook = useRef(new Vector3(0.2, 1.45, 0.1));
  const nextPosition = useRef(new Vector3());
  const nextLook = useRef(new Vector3());
  const isSettled = useRef(false);
  const path = useMemo(() => new CatmullRomCurve3(cameraPoints, false, "catmullrom", 0.38), []);
  const lookPath = useMemo(() => new CatmullRomCurve3(lookPoints, false, "catmullrom", 0.25), []);
  const interiorPath = useMemo(() => new CatmullRomCurve3(interiorCameraPoints, false, "catmullrom", 0.28), []);
  const interiorLookPath = useMemo(() => new CatmullRomCurve3(interiorLookPoints, false, "catmullrom", 0.25), []);

  useFrame((_, delta) => {
    const progress = MathUtils.clamp(scroll.offset, 0, 1);
    const phaseOneProgress = getPhaseOneProgress(progress);
    const phaseTwoProgress = getPhaseTwoProgress(progress);
    const lookProgress = MathUtils.clamp(phaseOneProgress * 0.94 + 0.04, 0, 1);
    const damping = 1 - Math.exp(-delta * 4.8);

    if (progress < CAMERA_SETTLE_END) {
      isSettled.current = false;
    } else if (isSettled.current) {
      return;
    }

    if (progress <= PHASE_ONE_END) {
      path.getPointAt(phaseOneProgress, nextPosition.current);
      lookPath.getPointAt(lookProgress, nextLook.current);
    } else if (progress >= CAMERA_SETTLE_END) {
      nextPosition.current.copy(finalCameraPosition);
      nextLook.current.copy(finalLookTarget);
    } else {
      const easedInterior = MathUtils.smoothstep(phaseTwoProgress, 0, 1);
      interiorPath.getPointAt(easedInterior, nextPosition.current);
      interiorLookPath.getPointAt(easedInterior, nextLook.current);
    }

    currentPosition.current.lerp(nextPosition.current, damping);
    currentLook.current.lerp(nextLook.current, damping);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLook.current);

    if (
      progress >= CAMERA_SETTLE_END &&
      currentPosition.current.distanceToSquared(finalCameraPosition) < CAMERA_SETTLE_EPSILON &&
      currentLook.current.distanceToSquared(finalLookTarget) < CAMERA_SETTLE_EPSILON
    ) {
      currentPosition.current.copy(finalCameraPosition);
      currentLook.current.copy(finalLookTarget);
      camera.position.copy(finalCameraPosition);
      camera.lookAt(finalLookTarget);
      isSettled.current = true;
    }
  });

  return null;
}
