import { inject, Injectable } from "@angular/core";
import { oppositeFront, WotrFrontId } from "../front/wotr-front-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrNationRules } from "../nation/wotr-nation-rules";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrActionToken } from "./wotr-action-die-models";

@Injectable({ providedIn: "root" })
export class WotrActionDieRules {
  private huntStore = inject(WotrHuntStore);
  private nationRules = inject(WotrNationRules);
  private regionStore = inject(WotrRegionStore);
  private q = inject(WotrGameQuery);

  rollableActionDice(frontId: WotrFrontId): number {
    switch (frontId) {
      case "free-peoples": {
        let nDice = 4;
        nDice += this.q.freePeoples.actionDiceBonus();
        return nDice;
      }
      case "shadow": {
        let nDice = 7;
        nDice += this.q.shadow.actionDiceBonus();
        nDice -= this.huntStore.nHuntDice();
        return nDice;
      }
    }
  }

  canPassAction(frontId: WotrFrontId): boolean {
    // Can pass only if the opponent has more action dice left
    const opponent = oppositeFront(frontId);
    return this.q.front(opponent).nActionDice() > this.q.front(frontId).nActionDice();
  }

  playableTokens(frontId: WotrFrontId): WotrActionToken[] {
    const tokens = this.q.front(frontId).actionTokens();
    return tokens.filter(token => this.isPlayableToken(token, frontId));
  }

  isPlayableToken(token: WotrActionToken, frontId: WotrFrontId): boolean {
    switch (token) {
      case "draw-card":
        return this.q.front(frontId).canDrawCard();
      case "political-advance":
        return this.nationRules.canFrontAdvancePoliticalTrack(frontId, "token");
      case "move-nazgul-minions":
        return this.regionStore.canMoveNazgul();
    }
  }
}
