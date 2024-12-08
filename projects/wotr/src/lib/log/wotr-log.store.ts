import { Injectable, Signal } from "@angular/core";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPhase } from "../game-turn/wotr-phase.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrLog, WotrLogFragment } from "./wotr-log.models";

export type WotrLogState = WotrLog[];

export function initialeState (): WotrLogState {
  return [];
}

@Injectable ()
export class WotrLogStore {

  update!: (actionName: string, updater: (a: WotrLogState) => WotrLogState) => void;
  state!: Signal<WotrLogState>;

  private addLog (actionName: string, log: WotrLog) {
    return this.update (actionName, s => ([...s, log]));
  }

  logSetup () { this.addLog ("logSetup", { type: "setup" }); }
  logRound (roundNumber: number) { this.addLog ("logRound", { type: "round", roundNumber }); }
  logPhase (phase: WotrPhase) { this.addLog ("logPhase", { type: "phase", phase: phase }); }
  logBattleResolution () { this.addLog ("logBattleResolution", { type: "battle-resolution" }); }
  logHuntResolution () { this.addLog ("logHuntResolution", { type: "hunt-resolution" }); }
  logRevealInMordor () { this.addLog ("logRevealInMordor", { type: "reveal-in-mordor" }); }
  logMoveInMordor () { this.addLog ("logMoveInMordor", { type: "move-in-mordor" }); }
  
  logCombatCard (card: WotrCardId, front: WotrFrontId) { this.addLog ("logCombatCard", { type: "combat-card", card, front, during: "battle" }); }

  logAction (action: WotrAction, story: WotrGameStory, front: WotrFrontId, during?: "battle" | "hunt") { this.addLog (`logAction [${action.type}]`, { type: "action", action, story, front, during }); }
  logEffect (effect: WotrAction, during?: "battle" | "hunt") { this.addLog (`logEffect [${effect.type}]`, { type: "effect", effect, during }); }
  logStory (story: WotrGameStory, front: WotrFrontId, during?: "battle" | "hunt") { this.addLog ("logStory", { type: "story", story, front, during }); }

  logV2 (...fragments: (string | WotrLogFragment)[]) { this.addLog ("logV2", { type: "v2", fragments }); }

  logEndGame () { this.addLog ("logEndGame", { type: "endGame" }); }

}
