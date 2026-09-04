import { MathUtils } from "three";

export const PHASE_ONE_END = 0.48;
export const CAMERA_SETTLE_END = 0.62;

export function getPhaseOneProgress(offset: number) {
  return MathUtils.clamp(offset / PHASE_ONE_END, 0, 1);
}

export function getPhaseTwoProgress(offset: number) {
  return MathUtils.clamp((offset - PHASE_ONE_END) / (CAMERA_SETTLE_END - PHASE_ONE_END), 0, 1);
}
