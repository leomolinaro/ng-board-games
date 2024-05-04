import { WotrAction } from "../wotr-story.models";
import { WotrCardId } from "./wotr-card.models";
import { WotrActionDie, WotrActionToken } from "./wotr-dice.models";
import { WotrFrontId } from "./wotr-front.models";
import { WotrPhase } from "./wotr-phase.models";

export interface WotrLogSetup { type: "setup" }
export interface WotrLogEndGame { type: "endGame" }
export interface WotrLogRound { type: "round"; roundNumber: number }
export interface WotrLogAction { type: "action"; front: WotrFrontId; action: WotrAction; die?: WotrActionDie; token?: WotrActionToken; card?: WotrCardId }
export interface WotrLogActionPass { type: "action-pass"; front: WotrFrontId }
export interface WotrLogTokensSkip { type: "tokens-skip"; front: WotrFrontId }
export interface WotrLogPhase { type: "phase"; phase: WotrPhase }
// export interface WotrLogPopulationMarkerSet { type: "population-marker-set"; populationMarker: number | null }
// export interface WotrLogInfantryPlacement { type: "infantry-placement"; landId: WotrLandRegionId; quantity: number }
// export interface WotrLogInfantryReinforcement { type: "infantry-reinforcement"; regionId: WotrRegionId; quantity: number }
// export interface WotrLogArmyMovement { type: "army-movement"; units: WotrRegionUnit[];   toRegionId: WotrRegionId }

export type WotrLog =
| WotrLogSetup
| WotrLogEndGame
| WotrLogRound
| WotrLogAction
| WotrLogTokensSkip
| WotrLogActionPass
| WotrLogPhase;
// | WotrLogPopulationMarkerSet
// | WotrLogInfantryPlacement
// | WotrLogInfantryReinforcement
// | WotrLogArmyMovement;