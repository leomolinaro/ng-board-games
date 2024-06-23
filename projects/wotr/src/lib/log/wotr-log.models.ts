import { WotrCardId } from "../card/wotr-card.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameAction, WotrStory } from "../game/wotr-story.models";
import { WotrPhase } from "../player/wotr-phase.models";

export interface WotrLogSetup { type: "setup" }
export interface WotrLogEndGame { type: "endGame" }
export interface WotrLogRound { type: "round"; roundNumber: number }
export interface WotrLogAction {
  type: "action";
  front: WotrFrontId;
  action: WotrGameAction;
  story: WotrStory;
  during?: "battle" | "hunt";
}
export interface WotrLogEffect {
  type: "effect";
  effect: WotrGameAction;
  during?: "battle" | "hunt";
}
export interface WotrLogStory {
  type: "story";
  front: WotrFrontId;
  story: WotrStory;
  during?: "battle" | "hunt";
}
export interface WotrLogPhase { type: "phase"; phase: WotrPhase }
export interface WotrLogBattleResolution { type: "battle-resolution" }
export interface WotrLogHuntResolution { type: "hunt-resolution" }
export interface WotrLogRevealInMordor { type: "reveal-in-mordor" }
export interface WotrLogMoveInMordor { type: "move-in-mordor" }
export interface WotrLogCombatCard { type: "combat-card"; card: WotrCardId; front: WotrFrontId; during: "battle" }

export type WotrLog =
| WotrLogSetup
| WotrLogEndGame
| WotrLogRound
| WotrLogAction
| WotrLogEffect
| WotrLogStory
| WotrLogPhase
| WotrLogBattleResolution
| WotrLogHuntResolution
| WotrLogCombatCard
| WotrLogRevealInMordor
| WotrLogMoveInMordor;
