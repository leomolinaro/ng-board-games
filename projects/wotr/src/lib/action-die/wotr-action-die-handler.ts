import { Injectable, inject } from "@angular/core";
import {
  WotrActionApplierMap,
  WotrActionLoggerMap,
  WotrStoryApplier
} from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontStore } from "../front/wotr-front-store";
import {
  WotrDieStory,
  WotrPassStory,
  WotrSkipTokensStory,
  WotrTokenStory
} from "../game/wotr-story-models";
import { WotrLogStore } from "../log/wotr-log-store";
import { WotrActionDieAction } from "./wotr-action-die-actions";
import { WotrActionDie } from "./wotr-action-die-models";

@Injectable({ providedIn: "root" })
export class WotrActionDieHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private frontStore = inject(WotrFrontStore);
  private logStore = inject(WotrLogStore);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerStory("die", this.die);
    this.actionRegistry.registerStory("die-pass", this.diePass);
    this.actionRegistry.registerStory("token", this.token);
    this.actionRegistry.registerStory("token-skip", this.tokenSkip);
  }

  private die: WotrStoryApplier<WotrDieStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
    this.frontStore.removeActionDie(story.die, front);
  };

  private diePass: WotrStoryApplier<WotrPassStory> = async (story, front) => {
    this.logStore.logStory(story, front);
  };

  private token: WotrStoryApplier<WotrTokenStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front);
      await this.actionRegistry.applyAction(action, front);
    }
    this.frontStore.removeActionToken(story.token, front);
  };

  private tokenSkip: WotrStoryApplier<WotrSkipTokensStory> = async (story, front) => {
    this.logStore.logStory(story, front);
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
}
