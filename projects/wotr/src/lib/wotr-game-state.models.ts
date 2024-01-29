import { BgUser } from "@leobg/commons";
import { WotrCharacterCardId, WotrStrategyCardId } from "./wotr-components/wotr-card.models";
import { WotrCompanionId } from "./wotr-components/wotr-companion.models";
import { WotrCompanionState } from "./wotr-components/wotr-companion.state";
import { WotrFrontId } from "./wotr-components/wotr-front.models";
import { WotrFrontState } from "./wotr-components/wotr-front.state";
import { WotrMinionState } from "./wotr-components/wotr-minion.state";
import { WotrNationId, WotrPoliticalStep } from "./wotr-components/wotr-nation.models";
import { WotrNationState } from "./wotr-components/wotr-nation.state";
import { WotrPhase } from "./wotr-components/wotr-phase.models";
import { WotrRegionId } from "./wotr-components/wotr-region.models";
import { WotrRegionState } from "./wotr-components/wotr-region.state";

export interface WotrGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: Record<WotrFrontId, WotrPlayer>;
    ids: WotrFrontId[];
  };
  frontState: WotrFrontState;
  regionState: WotrRegionState;
  nationState: WotrNationState;
  fellowhip: WotrFellowshipState;
  companionState: WotrCompanionState;
  minionState: WotrMinionState;
  logs: WotrLog[];
}

export interface WotrFellowshipState {
  status: "hidden" | "revealed";
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}

export interface AWotrPlayer {
  id: WotrFrontId;
  name: string;
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

export interface WotrLogSetup { type: "setup" }
export interface WotrLogEndGame { type: "endGame" }
export interface WotrLogRound { type: "round"; roundNumber: number }
// export interface WotrLogNationTurn { type: "nation-turn"; nationId: WotrNationId }
export interface WotrLogPhase { type: "phase"; phase: WotrPhase }
// export interface WotrLogPopulationMarkerSet { type: "population-marker-set"; populationMarker: number | null }
// export interface WotrLogInfantryPlacement { type: "infantry-placement"; landId: WotrLandRegionId; quantity: number }
// export interface WotrLogInfantryReinforcement { type: "infantry-reinforcement"; regionId: WotrRegionId; quantity: number }
// export interface WotrLogArmyMovement { type: "army-movement"; units: WotrRegionUnit[];   toRegionId: WotrRegionId }

export type WotrLog =
| WotrLogSetup
| WotrLogEndGame
| WotrLogRound
// | WotrLogNationTurn
| WotrLogPhase;
// | WotrLogPopulationMarkerSet
// | WotrLogInfantryPlacement
// | WotrLogInfantryReinforcement
// | WotrLogArmyMovement;

export interface WotrSetup {
  regions: WotrRegionSetup[];
  fellowship: WotrFellowshipSetup;
  nations: WotrNationSetup[];
  decks: WotrFrontDecksSetup[];
} // WotrSetup

export interface WotrFrontDecksSetup {
  front: WotrFrontId;
  characterDeck: WotrCharacterCardId[];
  strategyDeck: WotrStrategyCardId[];
}

export interface WotrRegionSetup {
  region: WotrRegionId;
  nation: WotrNationId;
  nRegulars: number;
  nElites: number;
  nLeaders: number;
  nNazgul: number;
}

export interface WotrNationSetup {
  nation: WotrNationId;
  active: boolean;
  politicalStep: WotrPoliticalStep;
}

export interface WotrFellowshipSetup {
  region: WotrRegionId;
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}
