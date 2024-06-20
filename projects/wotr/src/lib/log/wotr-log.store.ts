import { Injectable, Signal } from "@angular/core";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrAction, WotrStory } from "../game/wotr-story.models";
import { WotrPhase } from "../player/wotr-phase.models";
import { WotrLog } from "./wotr-log.models";

export type WotrLogState = WotrLog[];

@Injectable ({
  providedIn: "root"
})
export class WotrLogStore {

  update!: (actionName: string, updater: (a: WotrLogState) => WotrLogState) => void;
  state!: Signal<WotrLogState>;

  init (): WotrLogState {
    return [];
  }
  
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

  logAction (action: WotrAction, story: WotrStory, front: WotrFrontId, during?: "battle" | "hunt") { this.addLog (`logAction [${action.type}]`, { type: "action", action, story, front, during }); }
  logEffect (effect: WotrAction, during?: "battle" | "hunt") { this.addLog (`logEffect [${effect.type}]`, { type: "effect", effect, during }); }
  logStory (story: WotrStory, front: WotrFrontId, during?: "battle" | "hunt") { this.addLog ("logStory", { type: "story", story, front, during }); }

  logEndGame () { this.addLog ("logEndGame", { type: "endGame" }); }
  
}
