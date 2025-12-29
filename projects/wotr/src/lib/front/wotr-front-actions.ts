import { WotrElvenRing } from "./wotr-front-models";

export interface WotrElvenRingUse {
  type: "elven-ring-use";
  elvenRing: WotrElvenRing;
}
export function useElvenRing(elvenRing: WotrElvenRing): WotrElvenRingUse {
  return { type: "elven-ring-use", elvenRing };
}
export type WotrFrontAction = WotrElvenRingUse;
