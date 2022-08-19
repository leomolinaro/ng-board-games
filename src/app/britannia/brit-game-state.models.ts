import { BgUser } from "@bg-services";
import { BritArea, BritAreaId, BritColor, BritNation, BritNationId, BritPhase, BritRound, BritUnit, BritUnitId } from "./brit-components.models";

export interface BritGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: Record<string, BritPlayer>,
    ids: string[]
  };
  areas: Record<BritAreaId, BritArea>;
  nations: Record<BritNationId, BritNation>;
  units: Record<BritUnitId, BritUnit>;
  rounds: BritRound[],
  logs: BritLog[];
} // BritGameState

export type BritPlayerId = string;

export interface ABritPlayer {
  id: BritPlayerId;
  name: string;
  nations: BritNationId[];
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
export interface BritLogRound { type: "round"; roundNumber: number; }
export interface BritLogNationTurn { type: "nation-turn"; nationId: BritNationId; }
export interface BritLogPhase { type: "phase"; phase: BritPhase; }

export type BritLog = BritLogSetup | BritLogRound | BritLogNationTurn | BritLogPhase /*| BritLogRecuitment | BritLogConstruction
  | BritLogNewCity | BritLogNobleTitle | BritLogExpedition | BritLogMovement */;

export interface BritSetup {
  areas: Record<BritAreaId, [BritNationId, number] | BritNationId | null>;
  populationMarkers: BritNationId[];
  activeNations: BritNationId[];
} // BritSetup
