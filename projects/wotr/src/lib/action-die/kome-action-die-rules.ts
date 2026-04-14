import { inject, Injectable } from "@angular/core";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrFrontId } from "../front/wotr-front-models";

@Injectable()
export class KomeActionDieRules {
  private q = inject(WotrGameQuery);

  canInitiateCorruptionAttempt(frontId: WotrFrontId): boolean {
    if (frontId !== "shadow") return false;
    // The Free Peoples has at least one unused Action die
    if (!this.q.freePeoples.nActionDice()) return false;
    // There is more than one Eye die in the Hunt Box
    if (this.q.nEyesInHuntBox() <= 1) return false;
    return true;
  }

  // rollableActionDice(frontId: WotrFrontId): number {
  //   switch (frontId) {
  //     case "free-peoples": {
  //       let nDice = 4;
  //       nDice += this.q.freePeoples.actionDiceBonus();
  //       return nDice;
  //     }
  //     case "shadow": {
  //       let nDice = 7;
  //       nDice += this.q.shadow.actionDiceBonus();
  //       nDice -= this.huntStore.nHuntDice();
  //       return nDice;
  //     }
  //   }
  // }

  // canPassAction(frontId: WotrFrontId): boolean {
  //   // Can pass only if the opponent has more action dice left
  //   const opponent = oppositeFront(frontId);
  //   return this.q.front(opponent).nActionDice() > this.q.front(frontId).nActionDice();
  // }

  // playableTokens(frontId: WotrFrontId): WotrActionToken[] {
  //   const tokens = this.q.front(frontId).actionTokens();
  //   return tokens.filter(token => this.isPlayableToken(token, frontId));
  // }

  // isPlayableToken(token: WotrActionToken, frontId: WotrFrontId): boolean {
  //   switch (token) {
  //     case "draw-card":
  //       return this.q.front(frontId).canDrawCard();
  //     case "political-advance":
  //       return this.nationRules.canFrontAdvancePoliticalTrack(frontId, "token");
  //     case "move-nazgul-minions":
  //       return this.regionStore.canMoveNazgul();
  //   }
  // }
}
