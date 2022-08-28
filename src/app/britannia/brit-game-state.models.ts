import { BgUser } from "@bg-services";
import { BritAreaId, BritColor, BritLandAreaId, BritLeaderId, BritNationId, BritPhase, BritPopulation } from "./brit-components.models";

export interface BritGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: Record<string, BritPlayer>,
    ids: string[]
  };
  areas: Record<BritAreaId, BritAreaState>;
  nations: Record<BritNationId, BritNationState>;
  logs: BritLog[];
} // BritGameState

export type BritAreaUnitId = string;

interface ABritAreaUnit {
  nationId: BritNationId;
  areaId: BritAreaId;
} // ABritAreaUnit

export interface BritAreaInfantry extends ABritAreaUnit {
  nationId: BritNationId;
  type: "infantry";
  quantity: number;
} // BritAreaInfantry

export interface BritAreaCavalry extends ABritAreaUnit {
  nationId: BritNationId;
  type: "cavalry";
  quantity: number;
} // BritAreaCavalry

export interface BritAreaRomanFort extends ABritAreaUnit {
  nationId: BritNationId;
  type: "roman-fort";
  quantity: number;
} // BritAreaRomanFort

export interface BritAreaSaxonBuhr extends ABritAreaUnit {
  nationId: BritNationId;
  type: "saxon-buhr";
  quantity: number;
} // BritAreaSaxonBuhr

export interface BritAreaLeader extends ABritAreaUnit {
  nationId: BritNationId;
  type: "leader";
  leaderId: BritLeaderId;
} // BritAreaLeader

export type BritAreaUnit = BritAreaInfantry | BritAreaCavalry | BritAreaRomanFort | BritAreaSaxonBuhr | BritAreaLeader;

export interface BritAreaState {
  units: BritAreaUnit[];
} // BritAreaState

export interface BritNationState {
  nInfantries: number;
  nCavalries: number;
  nBuildings: number;
  leaderIds: BritLeaderId[];
  population: BritPopulation | null;
  active: boolean;
} // BritNationState

export type BritPlayerId = string;

export interface ABritPlayer {
  id: BritPlayerId;
  name: string;
  nationIds: BritNationId[];
  color: BritColor;
  score: number;
} // ABritPlayer

export interface BritAiPlayer extends ABritPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
} // BritAiPlayer

export interface BritRealPlayer extends ABritPlayer {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
} // BritRealPlayer

export type BritPlayer = BritAiPlayer | BritRealPlayer;

// export interface BritLogMovement { type: "movement"; movement: BritMovement; player: string; }
// export interface BritLogExpedition { type: "expedition"; land: BritLandCoordinates; player: string; }
// export interface BritLogNobleTitle { type: "nobleTitle"; resources: BritResourceType[]; player: string; }
// export interface BritLogNewCity { type: "newCity"; land: BritLandCoordinates; player: string; }
// export interface BritLogConstruction { type: "construction"; construction: BritConstruction; player: string; }
// export interface BritLogRecuitment { type: "recruitment"; land: BritLandCoordinates; player: string; }
// export interface BritLogTurn { type: "turn"; player: string; }
// export interface BritLogSetupPlacement { type: "setupPlacement"; land: BritLandCoordinates; player: string; }
export interface BritLogSetup { type: "setup"; }
export interface BritLogRound { type: "round"; roundId: number; }
export interface BritLogNationTurn { type: "nation-turn"; nationId: BritNationId; }
export interface BritLogPhase { type: "phase"; phase: BritPhase; }
export interface BritLogPopulationMarkerSet { type: "population-marker-set"; populationMarker: number | null; }
export interface BritLogInfantryPlacement { type: "infantry-placement"; landId: BritLandAreaId; quantity: number; }
export interface BritLogInfantryReinforcement { type: "infantry-reinforcement"; areaId: BritAreaId; quantity: number; }

export type BritLog = BritLogSetup | BritLogRound | BritLogNationTurn | BritLogPhase | BritLogPopulationMarkerSet | BritLogInfantryPlacement | BritLogInfantryReinforcement;
 /*| BritLogRecuitment | BritLogConstruction
  | BritLogNewCity | BritLogNobleTitle | BritLogExpedition | BritLogMovement */;

export interface BritSetup {
  areas: Record<BritAreaId, [BritNationId, number] | BritNationId | null>;
  populationMarkers: BritNationId[];
  activeNations: BritNationId[];
} // BritSetup
