import { BgUser } from "@leobg/commons";
import { WotrCardId, WotrCharacterCardId, WotrStrategyCardId } from "./wotr-components/card.models";
import { WotrFront } from "./wotr-components/front.models";
import { WotrArmyUnitType, WotrCompanionId, WotrMinionId, WotrNationId, WotrPoliticalStep } from "./wotr-components/nation.models";
import { WotrPhase } from "./wotr-components/phase.models";
import { WotrRegionId } from "./wotr-components/region.models";

export interface WotrGameState {
  gameId: string;
  gameOwner: BgUser;
  players: Record<WotrFront, WotrPlayer>;
  fronts: Record<WotrFront, WotrFrontState>;
  regions: Record<WotrRegionId, WotrRegionState>;
  nations: Record<WotrNationId, WotrNationState>;
  fellowhip: WotrFellowshipState;
  companions: Record<WotrCompanionId, WotrCompanionState>;
  minions: Record<WotrMinionId, WotrMinionState>;
  logs: WotrLog[];
}

export interface WotrFrontState {
  handCards: WotrCardId[];
  tableCards: WotrCardId[];
  characterDeck: WotrCharacterCardId[];
  strategyDeck: WotrStrategyCardId[];
  characterDiscardPile: WotrCharacterCardId[];
  strategyDiscardPile: WotrStrategyCardId[];
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
  politicalStep: WotrPoliticalStep;
}

export interface WotrFellowshipState {
  status: "hidden" | "revealed";
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}

export interface WotrCompanionState {
  status: "inFellowship" | "available" | "inPlay" | "eliminated";
}

export interface WotrMinionState {
  status: "available" | "inPlay" | "eliminated";
}

export interface AWotrPlayer {
  id: WotrFront;
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
  front: WotrFront;
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
