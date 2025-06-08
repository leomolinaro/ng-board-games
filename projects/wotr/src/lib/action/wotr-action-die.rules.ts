import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { oppositeFront, WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrActionDie, WotrActionToken, WotrFreePeopleActionDie, WotrShadowActionDie } from "./wotr-action.models";

@Injectable()
export class WotrActionDieRules {
  private frontStore = inject(WotrFrontStore);
  private charaters = inject(WotrCharacterStore);

  private FREE_PEOPLES_ACTION_DICE: WotrFreePeopleActionDie[] = [
    "character",
    "muster",
    "event",
    "muster-army",
    "will-of-the-west"
  ];

  private SHADOW_ACTION_DICE: WotrShadowActionDie[] = ["character", "army", "event", "muster", "muster-army", "eye"];

  rollableActionDice(frontId: WotrFrontId): number {
    switch (frontId) {
      case "free-peoples": {
        let nDice = 4;
        if (this.charaters.isInPlay("aragorn")) {
          nDice += 1;
        }
        if (this.charaters.isInPlay("gandalf-the-white")) {
          nDice += 1;
        }
        return nDice;
      }
      case "shadow": {
        let nDice = 7;
        if (this.charaters.isInPlay("aragorn")) {
          nDice += 1;
        }
        if (this.charaters.isInPlay("gandalf-the-white")) {
          nDice += 1;
        }
        return nDice;
      }
    }
  }

  rollActionDie(frontId: WotrFrontId): WotrActionDie {
    switch (frontId) {
      case "free-peoples":
        return randomUtil.getRandomDraws(1, this.FREE_PEOPLES_ACTION_DICE)[0];
      case "shadow":
        return randomUtil.getRandomDraws(1, this.SHADOW_ACTION_DICE)[0];
    }
  }

  canPassAction(frontId: WotrFrontId): boolean {
    // Can pass only if the opponent has more action dice left
    const opponent = oppositeFront(frontId);
    return this.frontStore.nActionDice(opponent) > this.frontStore.nActionDice(frontId);
  }

  playableTokens(frontId: WotrFrontId): WotrActionToken[] {
    throw new Error("Method not implemented.");
  }
}
