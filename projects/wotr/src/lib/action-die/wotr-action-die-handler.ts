import { Injectable, inject } from "@angular/core";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontHandler } from "../front/wotr-front-handler";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrDieStory,
  WotrPassStory,
  WotrSkipTokensStory,
  WotrTokenStory
} from "../game/wotr-story-models";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrActionDieAction } from "./wotr-action-die-actions";
import { WotrActionDie } from "./wotr-action-die-models";
import { WotrActionDieModifiers } from "./wotr-action-die-modifiers";

@Injectable({ providedIn: "root" })
export class WotrActionDieHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logger = inject(WotrLogWriter);
  private frontHandler = inject(WotrFrontHandler);
  private actionDieModifiers = inject(WotrActionDieModifiers);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerStory("die", this.die);
    this.actionRegistry.registerStory("die-pass", this.diePass);
    this.actionRegistry.registerStory("token", this.token);
    this.actionRegistry.registerStory("token-skip", this.tokenSkip);
  }

  private die: WotrStoryApplier<WotrDieStory> = async (story, front) => {
    if (story.elvenRing) {
      this.frontHandler.convertDieWithElvenRing(story.elvenRing, front);
    }
    if (story.actions?.length) {
      for (const action of story.actions) {
        this.logger.logAction(action, story, front);
        await this.actionRegistry.applyAction(action, front);
      }
    } else {
      this.logger.logNoActions(story, front);
    }
    this.frontStore.removeActionDie(story.die, front);
    await this.actionDieModifiers.onAfterActionDieResolution(story, front);
  };

  private diePass: WotrStoryApplier<WotrPassStory> = async (story, front) => {
    if (story.elvenRing) {
      this.frontHandler.convertDieWithElvenRing(story.elvenRing, front);
    }
    this.logger.logStory(story, front);
  };

  private token: WotrStoryApplier<WotrTokenStory> = async (story, front) => {
    if (story.elvenRing) {
      this.frontHandler.convertDieWithElvenRing(story.elvenRing, front);
    }
    for (const action of story.actions) {
      this.logger.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
    this.frontStore.removeActionToken(story.token, front);
  };

  private tokenSkip: WotrStoryApplier<WotrSkipTokensStory> = async (story, front) => {
    if (story.elvenRing) {
      this.frontHandler.convertDieWithElvenRing(story.elvenRing, front);
    }
    this.logger.logStory(story, front);
  };

  getActionAppliers(): WotrActionApplierMap<WotrActionDieAction> {
    return {
      "action-roll": (action, front) => {
        this.frontStore.setActionDice(action.dice, front);
      },
      "action-dice-discard": async (action, front) => {
        for (const die of action.dice) {
          this.frontStore.removeActionDie(die, action.front);
        }
      },
      "action-die-skip": async (action, front) => {
        // empty (the die will already be removed at the end of the action)
      },
      "action-die-change": async (action, front) => {
        this.changeActionDie(action.die, action.toDie, front);
      }
    };
  }

  changeActionDie(die: WotrActionDie, toDie: WotrActionDie, front: WotrFrontId) {
    this.frontStore.changeActionDie(die, toDie, front);
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
      ],
      "action-die-change": (action, front, f) => [
        f.player(front),
        ` changes ${this.dice([action.die])} to ${this.dice([action.toDie])}`
      ]
    };
  }

  private dice(dice: WotrActionDie[]) {
    return `${dice.join(", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }
}
