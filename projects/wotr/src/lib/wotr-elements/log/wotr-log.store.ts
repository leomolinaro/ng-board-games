import { Injectable, Signal } from "@angular/core";
import { WotrAction } from "../../wotr-story.models";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrActionDie, WotrActionToken } from "../wotr-dice.models";
import { WotrPhase } from "../wotr-phase.models";
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

  logSetup () { this.addLog ("Log setup", { type: "setup" }); }
  logRound (roundNumber: number) { this.addLog ("Log round", { type: "round", roundNumber }); }
  logPhase (phase: WotrPhase) { this.addLog ("Log phase", { type: "phase", phase: phase }); }
  logBattleResolution () { this.addLog ("Log battle resolution", { type: "battle-resolution" }); }
  logHuntResolution () { this.addLog ("Log hunt resolution", { type: "hunt-resolution" }); }
  logAction (action: WotrAction, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front }); }
  logBattleAction (action: WotrAction, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front, during: "battle" }); }
  logHuntAction (action: WotrAction, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front, during: "hunt" }); }
  logCardAction (action: WotrAction, cardId: WotrCardId, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, card: cardId, front }); }
  logCombatCardAction (action: WotrAction, cardId: WotrCardId, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "combat-action", action, combatCard: cardId, front, during: "battle" }); }
  logDieAction (action: WotrAction, die: WotrActionDie, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front, die }); }
  logDieCardAction (action: WotrAction, die: WotrActionDie, card: WotrCardId, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front, die, card }); }
  logTokenAction (action: WotrAction, token: WotrActionToken, front: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front, token }); }
  logEndGame () { this.addLog ("Log end game", { type: "endGame" }); }
  logCombatCard (card: WotrCardId, front: WotrFrontId) { this.addLog ("Log combat card", { type: "combat-card", card, front, during: "battle" }); }
  logActionPass (frontId: WotrFrontId) { this.addLog ("Log action pass", { type: "action-pass", front: frontId }); }
  logSkipTokens (frontId: WotrFrontId) { this.addLog ("Log skip tokens", { type: "tokens-skip", front: frontId }); }
  logSkipCombatCard (card: WotrCardId, front: WotrFrontId) { this.addLog ("Log skip combat card", { type: "combat-card-skip", card, front, during: "battle" }); }

}
