import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPhase } from "../game-turn/wotr-phase.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";

export interface WotrLogSetup { type: "setup" }
export interface WotrLogEndGame { type: "endGame" }
export interface WotrLogRound { type: "round"; roundNumber: number }
export interface WotrLogAction {
  type: "action";
  front: WotrFrontId;
  action: WotrAction;
  story: WotrGameStory;
  during?: "battle" | "hunt";
}
export interface WotrLogEffect {
  type: "effect";
  effect: WotrAction;
  during?: "battle" | "hunt";
}
export interface WotrLogStory {
  type: "story";
  front: WotrFrontId;
  story: WotrGameStory;
  during?: "battle" | "hunt";
}
export interface WotrLogV2 { type: "v2"; fragments: (string | WotrLogFragment)[] }

export interface WotrLogPhase { type: "phase"; phase: WotrPhase }
export interface WotrLogBattleResolution { type: "battle-resolution" }
export interface WotrLogHuntResolution { type: "hunt-resolution" }
export interface WotrLogRevealInMordor { type: "reveal-in-mordor" }
export interface WotrLogMoveInMordor { type: "move-in-mordor" }
export interface WotrLogCombatCard { type: "combat-card"; card: WotrCardId; front: WotrFrontId; during: "battle" }

export type WotrLog =
| WotrLogV2
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

export interface WotrLogStringFragment { type: "string"; label: string }
export interface WotrLogCardFragment { type: "card"; label: string }
export interface WotrLogPlayerFragment { type: "player"; front: WotrFrontId }
export function playerLog (front: WotrFrontId): WotrLogPlayerFragment { return { type: "player", front }; }
export interface WotrLogRegionFragment { type: "region"; region: WotrRegionId }
export function regionLog (region: WotrRegionId): WotrLogRegionFragment { return { type: "region", region }; }
export interface WotrLogNationFragment { type: "nation"; nation: WotrNationId }
export interface WotrLogDieFragment { type: "die"; die: WotrActionDie; front: WotrFrontId }
export interface WotrLogTokenFragment { type: "token"; token: WotrActionToken; front: WotrFrontId }
export interface WotrLogHuntTileFragment { type: "hunt-tile"; tile: WotrHuntTileId }

export type WotrLogFragment =
  | WotrLogStringFragment
  | WotrLogCardFragment
  | WotrLogPlayerFragment
  | WotrLogRegionFragment
  | WotrLogNationFragment
  | WotrLogDieFragment
  | WotrLogTokenFragment
  | WotrLogHuntTileFragment;
