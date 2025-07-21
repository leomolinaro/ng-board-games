import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCardRules } from "../card/wotr-card-rules";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { oppositeFront, WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import {
  WotrActionDie,
  WotrActionToken,
  WotrFreePeopleActionDie,
  WotrShadowActionDie
} from "./wotr-action-die.models";
import { WotrNationRules } from "../nation/wotr-nation-rules";

@Injectable({ providedIn: "root" })
export class WotrActionDieRules {
  private frontStore = inject(WotrFrontStore);
  private characterStore = inject(WotrCharacterStore);
  private huntStore = inject(WotrHuntStore);
  private cardRules = inject(WotrCardRules);
  private nationRules = inject(WotrNationRules);
  private regionStore = inject(WotrRegionStore);

  private FREE_PEOPLES_ACTION_DICE: WotrFreePeopleActionDie[] = [
    "character",
    "muster",
    "event",
    "muster-army",
    "will-of-the-west"
  ];

  private SHADOW_ACTION_DICE: WotrShadowActionDie[] = [
    "character",
    "army",
    "event",
    "muster",
    "muster-army",
    "eye"
  ];

  rollableActionDice(frontId: WotrFrontId): number {
    switch (frontId) {
      case "free-peoples": {
        let nDice = 4;
        if (this.characterStore.isInPlay("aragorn")) {
          nDice += 1;
        }
        if (this.characterStore.isInPlay("gandalf-the-white")) {
          nDice += 1;
        }
        return nDice;
      }
      case "shadow": {
        let nDice = 7;
        if (this.characterStore.isInPlay("the-witch-king")) {
          nDice += 1;
        }
        if (this.characterStore.isInPlay("saruman")) {
          nDice += 1;
        }
        if (this.characterStore.isInPlay("the-mouth-of-sauron")) {
          nDice += 1;
        }
        const huntDice = this.huntStore.nHuntDice();
        return nDice - huntDice;
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

  canSkipTokens(frontId: WotrFrontId): boolean {
    return !this.frontStore.hasActionDice(frontId);
  }

  canPassAction(frontId: WotrFrontId): boolean {
    // Can pass only if the opponent has more action dice left
    const opponent = oppositeFront(frontId);
    return this.frontStore.nActionDice(opponent) > this.frontStore.nActionDice(frontId);
  }

  playableTokens(frontId: WotrFrontId): WotrActionToken[] {
    const tokens = this.frontStore.actionTokens(frontId);
    return tokens.filter(token => this.isPlayableToken(token, frontId));
  }
  isPlayableToken(token: WotrActionToken, frontId: WotrFrontId): boolean {
    switch (token) {
      case "draw-card":
        return this.cardRules.canDrawCard(frontId);
      case "political-advance":
        return this.nationRules.canFrontAdvancePoliticalTrack(frontId);
      case "move-nazgul-minions":
        return this.regionStore.canMoveNazgul();
    }
  }
}
