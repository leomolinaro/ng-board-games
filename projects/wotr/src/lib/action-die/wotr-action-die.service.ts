import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrDieStory, WotrPassStory } from "../game/wotr-story.models";
import { playerLog } from "../log/wotr-log.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrActionDieAction, WotrActionRoll } from "./wotr-action-die-actions";
import { WotrActionDie } from "./wotr-action-die.models";

@Injectable ()
export class WotrActionDieService {
  
  private actionService = inject (WotrActionService);
  private frontStore = inject (WotrFrontStore);
  private logStore = inject (WotrLogStore);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
    this.actionService.registerStory ("die", this.die);
    this.actionService.registerStory ("die-pass", this.diePass);
    this.actionService.registerStory ("action-roll", this.actionRoll);
  }

  private die: WotrStoryApplier<WotrDieStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction (action, story, front);
      await this.actionService.applyAction (action, front);
    }
    this.frontStore.removeActionDie (story.die, front);
  };

  private diePass: WotrStoryApplier<WotrPassStory> = async (story, front) => { this.logStore.logStory (story, front); };

  private actionRoll: WotrStoryApplier<WotrActionRoll> = async (story, front) => {
    this.logStore.logV2 (playerLog (front), ` rolls ${this.dice (story.dice)}`);
    this.frontStore.setActionDice (story.dice, front);
  };

  getActionAppliers (): WotrActionApplierMap<WotrActionDieAction> {
    return {
      "action-dice-discard": async (action, front) => {
        for (const die of action.dice) {
          this.frontStore.removeActionDie (die, action.front);
        }
      },
      // "action-die-skip": async (action, front) => { /*empty*/ }
    };
  }

  private getActionLoggers (): WotrActionLoggerMap<WotrActionDieAction> {
    return {
      "action-dice-discard": (action, front, f) => [f.player (front), " discards ", f.player (action.front), ` ${this.dice (action.dice)}`],
      // "action-die-skip": (action, front, f) => [f.player (front), ` skips ${this.dice ([action.die])}`],
    };
  }

  private dice (dice: WotrActionDie[]) {
    return `${dice.join (", ")} ${dice.length === 1 ? "die" : "dice"}`;
  }

}
