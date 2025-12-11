import { WotrRegionId } from "../region/wotr-region-models";
import { WotrCharacterId } from "./wotr-character-models";

export type WotrCharacterAction =
  | WotrCharacterMovement
  | WotrCharacterPlay
  | WotrCharacterElimination
  | WotrGollumEnterFellowship;

export interface WotrCharacterMovement {
  type: "character-movement";
  characters: WotrCharacterId[];
  fromRegion: WotrRegionId;
  toRegion: WotrRegionId;
}
export function moveCharacters(
  fromRegion: WotrRegionId,
  toRegion: WotrRegionId,
  ...characters: WotrCharacterId[]
): WotrCharacterMovement {
  return { type: "character-movement", characters, fromRegion, toRegion };
}
export interface WotrCharacterPlay {
  type: "character-play";
  characters: WotrCharacterId[];
  region: WotrRegionId;
}
export function playCharacter(
  region: WotrRegionId,
  ...characters: WotrCharacterId[]
): WotrCharacterPlay {
  return { type: "character-play", region, characters };
}
export interface WotrCharacterElimination {
  type: "character-elimination";
  characters: WotrCharacterId[];
}
export function eliminateCharacter(...characters: WotrCharacterId[]): WotrCharacterElimination {
  return { type: "character-elimination", characters };
}

export interface WotrGollumEnterFellowship {
  type: "gollum-enter-fellowship";
}
export function gollumEnterFellowship(): WotrGollumEnterFellowship {
  return { type: "gollum-enter-fellowship" };
}
