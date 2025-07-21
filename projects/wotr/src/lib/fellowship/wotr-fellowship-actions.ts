import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character-models";
import { WotrRegionId } from "../region/wotr-region-models";

export interface WotrFellowshipDeclare {
  type: "fellowship-declare";
  region: WotrRegionId;
}
export function declareFellowship(region: WotrRegionId): WotrFellowshipDeclare {
  return { type: "fellowship-declare", region };
}
export interface WotrFellowshipDeclareNot {
  type: "fellowship-declare-not";
}
export function notDeclareFellowship(): WotrFellowshipDeclareNot {
  return { type: "fellowship-declare-not" };
}
export interface WotrFellowshipProgress {
  type: "fellowship-progress";
}
export function moveFelloswhip(): WotrFellowshipProgress {
  return { type: "fellowship-progress" };
}
export interface WotrFellowshipCorruption {
  type: "fellowship-corruption";
  quantity: number;
}
export function corruptFellowship(quantity: number): WotrFellowshipCorruption {
  return { type: "fellowship-corruption", quantity };
}
export function healFellowship(quantity: number): WotrFellowshipCorruption {
  return { type: "fellowship-corruption", quantity: -quantity };
}
export interface WotrFellowshipHide {
  type: "fellowship-hide";
}
export function hideFellowship(): WotrFellowshipHide {
  return { type: "fellowship-hide" };
}
export interface WotrFellowshipReveal {
  type: "fellowship-reveal";
  region: WotrRegionId;
}
export function revealFellowship(region: WotrRegionId): WotrFellowshipReveal {
  return { type: "fellowship-reveal", region };
}
export interface WotrFellowshipGuide {
  type: "fellowship-guide";
  companion: WotrCompanionId;
}
export function changeGuide(companion: WotrCompanionId): WotrFellowshipGuide {
  return { type: "fellowship-guide", companion };
}
export interface WotrCompanionSeparation {
  type: "companion-separation";
  companions: WotrCharacterId[];
  toRegion: WotrRegionId;
}
export function separateCompanions(
  toRegion: WotrRegionId,
  ...companions: WotrCharacterId[]
): WotrCompanionSeparation {
  return { type: "companion-separation", companions, toRegion };
}
export interface WotrCompanionRandom {
  type: "companion-random";
  companions: WotrCharacterId[];
}
export function chooseRandomCompanion(...companions: WotrCharacterId[]): WotrCompanionRandom {
  return { type: "companion-random", companions };
}

export type WotrFellowshipAction =
  | WotrFellowshipProgress
  | WotrFellowshipCorruption
  | WotrFellowshipDeclare
  | WotrFellowshipDeclareNot
  | WotrFellowshipHide
  | WotrFellowshipReveal
  | WotrFellowshipGuide
  | WotrCompanionSeparation
  | WotrCompanionRandom;
