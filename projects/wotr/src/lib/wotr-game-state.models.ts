import { BgUser } from "@leobg/commons";
import {
  WotrFront,
  WotrNationId,
  WotrRegionId
} from "./wotr-components.models";

export interface WotrGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: Record<string, WotrPlayer>;
    ids: string[];
  };
  regions: Record<WotrRegionId, WotrRegionState>;
  nations: Record<WotrNationId, WotrNationState>;
  logs: WotrLog[];
} // WotrGameState

interface AWotrRegionUnit {
  nationId: WotrNationId;
  regionId: WotrRegionId;
  nMovements: number;
} // AWotrRegionUnit

export interface WotrRegionRegular extends AWotrRegionUnit {
  nationId: WotrNationId;
  type: "regular";
  quantity: number;
} // WotrRegionRegular

export interface WotrRegionElite extends AWotrRegionUnit {
  nationId: WotrNationId;
  type: "elite";
  quantity: number;
} // WotrRegionElite

export interface WotrRegionLeader extends AWotrRegionUnit {
  nationId: WotrNationId;
  type: "leader";
  quantity: number;
} // WotrRegionLeader

export interface WotrRegionNazgul extends AWotrRegionUnit {
  nationId: WotrNationId;
  type: "nazgul";
  quantity: number;
} // WotrRegionNazgul

export type WotrRegionUnit =
  | WotrRegionRegular
  | WotrRegionElite
  | WotrRegionLeader
  | WotrRegionNazgul;

export interface WotrRegionState {
  units: WotrRegionUnit[];
} // WotrRegionState

export interface WotrNationState {
  reinforcements: {
    regular: number;
    elite: number;
  };
  eliminated: {
    regular: number;
    elite: number;
  };
  active: boolean;
  politicalTrack: 3 | 2 | 1 | "at-war";
} // WotrNationState

export type WotrPlayerId = string;

export interface AWotrPlayer {
  id: WotrPlayerId;
  name: string;
  front: WotrFront;
  score: number;
} // AWotrPlayer

export interface WotrAiPlayer extends AWotrPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
} // WotrAiPlayer

export interface WotrRealPlayer extends AWotrPlayer {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
} // WotrRealPlayer

export type WotrPlayer = WotrAiPlayer | WotrRealPlayer;

// export interface WotrLogSetup { type: "setup" }
// export interface WotrLogRound { type: "round"; roundId: number }
// export interface WotrLogNationTurn { type: "nation-turn"; nationId: WotrNationId }
// export interface WotrLogPhase { type: "phase"; phase: WotrPhase }
// export interface WotrLogPopulationMarkerSet { type: "population-marker-set"; populationMarker: number | null }
// export interface WotrLogInfantryPlacement { type: "infantry-placement"; landId: WotrLandRegionId; quantity: number }
// export interface WotrLogInfantryReinforcement { type: "infantry-reinforcement"; regionId: WotrRegionId; quantity: number }
// export interface WotrLogArmyMovement { type: "army-movement"; units: WotrRegionUnit[];   toRegionId: WotrRegionId }

export type WotrLog = never;
// | WotrLogSetup
// | WotrLogRound
// | WotrLogNationTurn
// | WotrLogPhase
// | WotrLogPopulationMarkerSet
// | WotrLogInfantryPlacement
// | WotrLogInfantryReinforcement
// | WotrLogArmyMovement;

// export interface WotrSetup {
//   regions: Record<WotrRegionId, [WotrNationId, number] | WotrNationId | null>;
//   populationMarkers: WotrNationId[];
//   activeNations: WotrNationId[];
// } // WotrSetup
