import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrHuntStory } from "../game/wotr-story.models";
import { playerLog } from "../log/wotr-log.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrHuntAction } from "./wotr-hunt-actions";
import { WotrHuntStore } from "./wotr-hunt.store";

@Injectable()
export class WotrHuntService {
  private actionService = inject(WotrActionService);
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private logStore = inject(WotrLogStore);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
    this.actionService.registerStory("hunt", this.huntStory);
  }

  getActionAppliers(): WotrActionApplierMap<WotrHuntAction> {
    return {
      "hunt-allocation": async (action, front) => this.huntStore.addHuntDice(action.quantity),
      "hunt-roll": async (action, front) => {
        /*empty*/
      },
      "hunt-re-roll": async (action, front) => {
        /*empty*/
      },
      "hunt-tile-draw": async (action, front) => this.huntStore.drawHuntTile(action.tile),
      "hunt-tile-add": async (action, front) => {
        if (this.fellowshipStore.isOnMordorTrack()) {
          this.huntStore.moveAvailableTileToPool(action.tile);
        } else {
          this.huntStore.moveAvailableTileToReady(action.tile);
        }
      }
    };
  }

  private huntStory: WotrStoryApplier<WotrHuntStory> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction(action, story, front, "hunt");
      await this.actionService.applyAction(action, front);
    }
  };

  private getActionLoggers(): WotrActionLoggerMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front, f) => [
        playerLog(front),
        ` allocates ${this.nDice(action.quantity)} in the Hunt Box`
      ],
      "hunt-re-roll": (action, front, f) => [playerLog(front), ` re-rolls ${this.dice(action.dice)} for the hunt`],
      "hunt-roll": (action, front, f) => [playerLog(front), ` rolls ${this.dice(action.dice)} for the hunt`],
      "hunt-tile-add": (action, front, f) => [
        f.player(front),
        " adds ",
        f.huntTile(action.tile),
        " hunt tile to the Mordor Track"
      ],
      "hunt-tile-draw": (action, front, f) => [f.player(front), " draws ", f.huntTile(action.tile), " hunt tile"]
    };
  }

  private nDice(quantity: number) {
    return `${quantity} ${quantity === 1 ? "die" : "dice"}`;
  }

  private dice(dice: number[]) {
    return dice.join(", ");
  }
}
