import { WotrRegionId } from "../region/wotr-region.models";
import { WotrCharacterId } from "./wotr-character.models";

export type WotrCharacterAction =
  WotrCharacterMovement | WotrCharacterPlay | WotrCharacterElimination |
  WotrCompanionSeparation | WotrCompanionRandom;
export interface WotrCharacterMovement { type: "character-movement"; characters: WotrCharacterId[]; fromRegion: WotrRegionId; toRegion: WotrRegionId }
export function moveCharacters (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...characters: WotrCharacterId[]): WotrCharacterMovement { return { type: "character-movement", characters, fromRegion, toRegion }; }
export interface WotrCharacterPlay { type: "character-play"; characters: WotrCharacterId[]; region: WotrRegionId }
export function playCharacter (region: WotrRegionId, ...characters: WotrCharacterId[]): WotrCharacterPlay { return { type: "character-play", region, characters }; }
export interface WotrCharacterElimination { type: "character-elimination"; characters: WotrCharacterId[] }
export function eliminateCharacter (...characters: WotrCharacterId[]): WotrCharacterElimination { return { type: "character-elimination", characters }; }
export interface WotrCompanionSeparation { type: "companion-separation"; companions: WotrCharacterId[]; toRegion: WotrRegionId }
export function separateCompanions (toRegion: WotrRegionId, ...companions: WotrCharacterId[]): WotrCompanionSeparation { return { type: "companion-separation", companions, toRegion }; }
export interface WotrCompanionRandom { type: "companion-random"; companions: WotrCharacterId[] }
export function chooseRandomCompanion (...companions: WotrCharacterId[]): WotrCompanionRandom { return { type: "companion-random", companions }; }
