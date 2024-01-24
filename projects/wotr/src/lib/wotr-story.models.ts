import { WotrCardId } from "./wotr-components/card.models";
import { WotrActionDie, WotrCombatDie } from "./wotr-components/dice.models";
import { WotrHuntTile } from "./wotr-components/hunt.models";
import { WotrCompanionId, WotrMinionId, WotrNationId, WotrUnitType } from "./wotr-components/nation.models";
import { WotrPhase } from "./wotr-components/phase.models";
import { WotrRegionId } from "./wotr-components/region.models";

export interface WotrStory {
  phase: WotrPhase;
  die?: WotrActionDie;
  card?: WotrCardId;
  actions: WotrStoryAction[];
}

export type WotrStoryAction = WotrDrawCards | WotrDiscardCards;

export interface WotrDrawCards { type: "draw-cards"; cards: WotrCardId[] }
export interface WotrDiscardCards { type: "discard-cards"; cards: WotrCardId[] }
export interface WotrFellowshipDeclaration { type: "fellowship-declaration"; region: WotrRegionId }
export interface WotrHuntAllocation { type: "hunt-allocation"; nDice: number }
export interface WotrActionDiceRoll { type: "action-dice-roll"; dice: WotrActionDie[] }
export interface WotrActionPass { type: "action-pass" }
export interface WotrFellowhipProgress { type: "fellowship-progress" }
export interface WotrHuntDiceRoll { type: "hunt-dice-roll"; dice: WotrCombatDie[] }
export interface WotrHuntTileDraw { type: "hunt-tile-draw"; tile: WotrHuntTile }
export interface WotrFellowhipHide { type: "fellowship-hide" }
export interface WotrCompanionSeparation { type: "companion-separation"; companions: WotrCompanionId[]; toRegion: WotrRegionId }
export interface WotrCompanionMovement { type: "companion-movement"; companions: WotrCompanionId[]; toRegion: WotrRegionId }
export interface WotrCompanionElimination { type: "companion-elimination"; companions: WotrCompanionId[] }
export interface WotrMinionMovement { type: "minion-movement"; minions: WotrMinionId[]; toRegion: WotrRegionId }
export interface WotrMinionElimination { type: "minion-elimination"; minions: WotrMinionId[] }
export interface WotrNazgulMovement { type: "nazgul-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; nNazgul: number }
export interface WotrArmyMovement { type: "army-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export interface WotrArmyAttack { type: "army-attack"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export interface WotrNationAdvance { type: "nation-advance"; nSteps: number }
export interface WotrNationActivation { type: "nation-activation" }
export interface WotrUnitRecruitment { type: "unit-recruitment"; unitType: WotrUnitType; nUnits: number; nation: WotrNationId }
export interface WotrUnitElimination { type: "unit-elimination"; unitType: WotrUnitType; nUnits: number; nation: WotrNationId }
export interface WotrCompanionPlay { type: "companion-play"; companion: WotrCompanionId }
export interface WotrMinionPlay { type: "minion-play"; minion: WotrMinionId }

export interface WotrArmy {
  minions?: WotrMinionId[];
  companions?: WotrCompanionId[];
  units?: {
    nUnits: number;
    type: WotrUnitType;
    nation: WotrNationId;
  }[];
}
