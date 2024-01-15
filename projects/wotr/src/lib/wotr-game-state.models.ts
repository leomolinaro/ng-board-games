import { BgUser } from "@leobg/commons";
import {
  WotrArmyUnitType,
  WotrCompanionId,
  WotrFront,
  WotrMinionId,
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
}

export interface WotrRegionArmyUnit {
  nationId: WotrNationId;
  type: WotrArmyUnitType;
  quantity: number;
}

export interface WotrRegionLeaderUnit {
  nationId: WotrNationId;
  type: "leader";
  quantity: number;
}

export interface WotrRegionState {
  armyUnits: WotrRegionArmyUnit[];
  leaders: WotrRegionLeaderUnit[];
  nNazgul: number;
  companions: WotrCompanionId[];
  minions: WotrMinionId[];
  fellowship: boolean;
}

export interface WotrNationState {
  reinforcements: {
    regular: number;
    elite: number;
    leader: number;
    nazgul: number;
  };
  eliminated: {
    regular: number;
    elite: number;
    leader: number;
  };
  active: boolean;
  politicalTrack: 3 | 2 | 1 | "at-war";
}

export type WotrPlayerId = string;

export interface AWotrPlayer {
  id: WotrPlayerId;
  name: string;
  front: WotrFront;
  score: number;
}

export interface WotrAiPlayer extends AWotrPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
}

export interface WotrRealPlayer extends AWotrPlayer {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
}

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

export interface WotrSetup {
  regions: WotrRegionSetup[];
  fellowshipRegion: WotrRegionId;
} // WotrSetup

export interface WotrRegionSetup {
  region: WotrRegionId;
  nation: WotrNationId;
  nRegulars: number;
  nElites: number;
  nLeaders: number;
  nNazgul: number;
}
