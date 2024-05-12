import { WotrAction } from "../../wotr-story.models";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrActionDie, WotrActionToken } from "../wotr-dice.models";
import { WotrPhase } from "../wotr-phase.models";

export interface WotrLogSetup { type: "setup" }
export interface WotrLogEndGame { type: "endGame" }
export interface WotrLogRound { type: "round"; roundNumber: number }
export interface WotrLogAction {
  type: "action";
  front: WotrFrontId;
  action: WotrAction;
  die?: WotrActionDie; token?: WotrActionToken; card?: WotrCardId;
  during?: "battle" | "hunt";
}
export interface WotrLogCombatAction {
  type: "combat-action";
  front: WotrFrontId;
  action: WotrAction;
  combatCard: WotrCardId;
  during: "battle";
}
export interface WotrLogActionPass { type: "action-pass"; front: WotrFrontId }
export interface WotrLogTokensSkip { type: "tokens-skip"; front: WotrFrontId }
export interface WotrLogPhase { type: "phase"; phase: WotrPhase }
export interface WotrLogBattleResolution { type: "battle-resolution" }
export interface WotrLogHuntResolution { type: "hunt-resolution" }
export interface WotrLogCombatCard { type: "combat-card"; card: WotrCardId; front: WotrFrontId; during: "battle" }
export interface WotrLogCombatCardSkip { type: "combat-card-skip"; front: WotrFrontId; card: WotrCardId; during: "battle" }

export type WotrLog =
| WotrLogSetup
| WotrLogEndGame
| WotrLogRound
| WotrLogAction
| WotrLogTokensSkip
| WotrLogActionPass
| WotrLogPhase
| WotrLogBattleResolution
| WotrLogHuntResolution
| WotrLogCombatCard
| WotrLogCombatAction
| WotrLogCombatCardSkip;
