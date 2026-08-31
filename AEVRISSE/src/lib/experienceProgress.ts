import { MathUtils } from "three";

export const PHASE_ONE_END = 5 / 9;

export function getPhaseOneProgress(offset: number) {
  return MathUtils.clamp(offset / PHASE_ONE_END, 0, 1);
}

export function getPhaseTwoProgress(offset: number) {
  return MathUtils.clamp((offset - PHASE_ONE_END) / (1 - PHASE_ONE_END), 0, 1);
}
