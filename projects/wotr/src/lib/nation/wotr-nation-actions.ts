import { WotrNationId } from "./wotr-nation-models";

export type WotrNationAction = WotrPoliticalAdvance | WotrPoliticalActivation;
export interface WotrPoliticalAdvance {
  type: "political-advance";
  nation: WotrNationId;
  quantity: number;
}
export function advanceNation(nation: WotrNationId, nSteps: number = 1): WotrPoliticalAdvance {
  return { type: "political-advance", nation, quantity: nSteps };
}
export interface WotrPoliticalActivation {
  type: "political-activation";
  nation: WotrNationId;
}
export function activateNation(nation: WotrNationId): WotrPoliticalActivation {
  return { type: "political-activation", nation };
}
