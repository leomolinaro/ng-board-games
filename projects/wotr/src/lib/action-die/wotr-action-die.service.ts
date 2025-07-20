import { Injectable, inject } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCardService } from "../card/wotr-card.service";
import { WotrCharacterStore } from "../character/wotr-character.store";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId, oppositeFront } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import {
  WotrDieStory,
  WotrPassStory,
  WotrSkipTokensStory,
  WotrTokenStory
} from "../game/wotr-story.models";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrActionDieAction } from "./wotr-action-die-actions";
import {
  WotrActionDie,
  WotrActionToken,
  WotrFreePeopleActionDie,
  WotrShadowActionDie
} from "./wotr-action-die.models";

@Injectable({ providedIn: "root" })
export class WotrActionDieService {
  private actionService = inject(WotrActionService);
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);
  private cardService = inject(WotrCardService);
  private nationService = inject(WotrNationService);
  private characters = inject(WotrCharacterStore);
  private regions = inject(WotrRegionStore);
  private huntStore = inject(WotrHuntStore);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
    this.actionService.registerStory("die", this.die);
    this.actionService.registerStory("die-pass", this.diePass);
    this.actionService.registerStory("token", this.token);
    this.actionService.registerStory("token-skip", this.tokenSkip);
  }

  private die: WotrStoryApplier<WotrDieStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionService.applyAction(action, front);
    }
    this.frontStore.removeActionDie(story.die, front);
  };

  private diePass: WotrStoryApplier<WotrPassStory> = async (story, front) => {
    this.logStore.logStory(story, front);
  };

  private token: WotrStoryApplier<WotrTokenStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionService.applyAction(action, front);
    }
    this.frontStore.removeActionToken(story.token, front);
  };

  private tokenSkip: WotrStoryApplier<WotrSkipTokensStory> = async (story, front) => {
    this.logStore.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrActionDieAction> {
    return {
      "action-roll": async (action, front) => {
        this.frontStore.setActionDice(action.dice, front);
      },
      "action-dice-discard": async (action, front) => {
        for (const die of action.dice) {
          this.frontStore.removeActionDie(die, action.front);
        }
      },
      "action-die-skip": async (action, front) => {
        // empty (the die will already be removed at the end of the action)
      }
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrActionDieAction> {
    return {
      "action-roll": (action, front, f) => [f.player(front), ` rolls ${this.dice(action.dice)}`],
      "action-dice-discard": (action, front, f) => [
        f.player(front),
        " discards ",
        f.player(action.front),
        ` ${this.dice(action.dice)}`
      ],
      "action-die-skip": (action, front, f) => [
        f.player(front),
        ` skips ${this.dice([action.die])}`
      ]
    };
  }

  private dice(dice: WotrActionDie[]) {
    return `${dice.join(", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }

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
        if (this.characters.isInPlay("aragorn")) {
          nDice += 1;
        }
        if (this.characters.isInPlay("gandalf-the-white")) {
          nDice += 1;
        }
        return nDice;
      }
      case "shadow": {
        let nDice = 7;
        if (this.characters.isInPlay("the-witch-king")) {
          nDice += 1;
        }
        if (this.characters.isInPlay("saruman")) {
          nDice += 1;
        }
        if (this.characters.isInPlay("the-mouth-of-sauron")) {
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
        return this.cardService.canDrawCard(frontId);
      case "political-advance":
        return this.nationService.canFrontAdvancePoliticalTrack(frontId);
      case "move-nazgul-minions":
        return this.regions.canMoveNazgul();
    }
  }
}
