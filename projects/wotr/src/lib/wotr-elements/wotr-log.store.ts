import { Injectable, Signal } from "@angular/core";
import { WotrAction } from "../wotr-story.models";
import { WotrCardId } from "./wotr-card.models";
import { WotrActionDie, WotrActionToken } from "./wotr-dice.models";
import { WotrFrontId } from "./wotr-front.models";
import { WotrLog } from "./wotr-log.models";
import { WotrPhase } from "./wotr-phase.models";

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
  logAction (action: WotrAction, frontId: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front: frontId }); }
  logCardAction (action: WotrAction, cardId: WotrCardId, frontId: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, card: cardId, front: frontId }); }
  logDieAction (action: WotrAction, die: WotrActionDie, frontId: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front: frontId, die }); }
  logTokenAction (action: WotrAction, token: WotrActionToken, frontId: WotrFrontId) { this.addLog (`Log action [${action.type}]`, { type: "action", action, front: frontId, token }); }
  logEndGame () { this.addLog ("Log end game", { type: "endGame" }); }
  logActionPass (frontId: WotrFrontId) { this.addLog ("Log action pass", { type: "action-pass", front: frontId }); }
  logSkipTokens (frontId: WotrFrontId) { this.addLog ("Log skip tokens", { type: "tokens-skip", front: frontId }); }

}
