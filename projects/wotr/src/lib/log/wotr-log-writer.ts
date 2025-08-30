import { inject, Injectable } from "@angular/core";
import { WotrBattleStore } from "../battle/wotr-battle-store";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrPhase } from "../game-turn/wotr-phase-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrLog, WotrLogFragment } from "./wotr-log-models";
import { WotrLogStore } from "./wotr-log-store";

@Injectable({ providedIn: "root" })
export class WotrLogWriter {
  private logStore = inject(WotrLogStore);
  private battleStore = inject(WotrBattleStore);
  private huntStore = inject(WotrHuntStore);

  private addLog(actionName: string, log: WotrLog) {
    return this.logStore.update(actionName, s => [...s, log]);
  }

  logSetup() {
    this.addLog("logSetup", { type: "setup" });
  }

  logRound(roundNumber: number) {
    this.addLog("logRound", { type: "round", roundNumber });
  }

  logPhase(phase: WotrPhase) {
    this.addLog("logPhase", { type: "phase", phase: phase });
  }

  logBattleResolution() {
    this.addLog("logBattleResolution", { type: "battle-resolution" });
  }

  logHuntResolution() {
    this.addLog("logHuntResolution", { type: "hunt-resolution" });
  }

  logRevealInMordor() {
    this.addLog("logRevealInMordor", { type: "reveal-in-mordor" });
  }

  logMoveInMordor() {
    this.addLog("logMoveInMordor", { type: "move-in-mordor" });
  }

  logCombatCard(card: WotrCardId, front: WotrFrontId) {
    this.addLog("logCombatCard", { type: "combat-card", card, front, during: "battle" });
  }

  logAction(action: WotrAction, story: WotrStory, front: WotrFrontId) {
    this.addLog(`logAction [${action.type}]`, {
      type: "action",
      action,
      story,
      front,
      during: this.during()
    });
  }

  logEffect(effect: WotrAction) {
    this.addLog(`logEffect [${effect.type}]`, { type: "effect", effect, during: this.during() });
  }

  logStory(story: WotrStory, front: WotrFrontId) {
    this.addLog("logStory", { type: "story", story, front, during: this.during() });
  }

  logV2(...fragments: (string | WotrLogFragment)[]) {
    this.addLog("logV2", { type: "v2", fragments });
  }

  logEndGame() {
    this.addLog("logEndGame", { type: "endGame" });
  }

  private during() {
    let during: "battle" | "hunt" | undefined;
    if (this.battleStore.battleInProgress()) during = "battle";
    if (this.huntStore.inProgress()) during = "hunt";
    return during;
  }

  // logAction(action: WotrAction, story: WotrGameStory, front: WotrFrontId) {
  //   let during: "battle" | "hunt" | undefined;
  //   if (this.battleStore.battleInProgress()) during = "battle";
  //   this.logStore.logAction(action, story, front, during);
  // }
}
