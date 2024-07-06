import { Injectable, inject } from "@angular/core";
import { WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { playerLog } from "../log/wotr-log.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrHuntAction, WotrHuntAllocation, WotrHuntEffect, WotrHuntReRoll, WotrHuntRoll, WotrHuntTileAdd, WotrHuntTileDraw } from "./wotr-hunt-actions";
import { WotrHuntStore } from "./wotr-hunt.store";

@Injectable ()
export class WotrHuntService {
  
  private actionService = inject (WotrActionService);
  private huntStore = inject (WotrHuntStore);
  private fellowshipStore = inject (WotrFellowshipStore);
  private logStore = inject (WotrLogStore);

  init () {
    this.actionService.registerAction<WotrHuntTileAdd> ("hunt-tile-add", async (action, front) => {
      if (this.fellowshipStore.isOnMordorTrack ()) {
        this.huntStore.moveAvailableTileToPool (action.tile);
      } else {
        this.huntStore.moveAvailableTileToReady (action.tile);
      }
    });
    this.actionService.registerAction<WotrHuntTileDraw> ("hunt-tile-draw", async (action, front) => {
      this.huntStore.drawHuntTile (action.tile);
    });
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
    this.actionService.registerStory ("hunt-allocation", this.huntAllocation);
    this.actionService.registerStory ("hunt-roll", this.huntRoll);
    this.actionService.registerStory ("hunt-re-roll", this.huntReRoll);
    this.actionService.registerStory ("hunt-tile-draw", this.huntTileDraw);
    this.actionService.registerStory ("hunt-effect", this.huntEffect);
  }

  private huntAllocation: WotrStoryApplier<WotrHuntAllocation> = async (story, front) => {
    this.logStore.logV2 (playerLog (front), ` allocates ${this.nDice (story.quantity)} in the Hunt Box`);
    this.huntStore.addHuntDice (story.quantity);
  };

  private huntRoll: WotrStoryApplier<WotrHuntRoll> = async (story, front) => {
    this.logStore.logV2 (playerLog (front), ` rolls ${this.dice (story.dice)} for the hunt`);
  };

  private huntReRoll: WotrStoryApplier<WotrHuntReRoll> = async (story, front) => {
    this.logStore.logV2 (playerLog (front), ` re-rolls ${this.dice (story.dice)} for the hunt`);
  };

  private huntTileDraw: WotrStoryApplier<WotrHuntTileDraw> = async (story, front) => {
    const action: WotrHuntTileDraw = { type: "hunt-tile-draw", tile: story.tile };
    this.logStore.logAction (action, story, front, "hunt");
    await this.actionService.applyAction (action, front);
  };
  
  private huntEffect: WotrStoryApplier<WotrHuntEffect> = async (story, front) => {
    for (const action of story.actions) {
      this.logStore.logAction (action, story, front, "hunt");
      await this.actionService.applyAction (action, front);
    }
  };

  private getActionLoggers (): WotrActionLoggerMap<WotrHuntAction> {
    return {
      "hunt-tile-add": (action, front, f) => [f.player (front), " adds ", f.huntTile (action.tile), " hunt tile to the Mordor Track"],
      "hunt-tile-draw": (action, front, f) => [f.player (front), " draws ", f.huntTile (action.tile), " hunt tile"],
    };
  }

  private nDice (quantity: number) {
    return `${quantity} ${quantity === 1 ? "die" : "dice"}`;
  }

  private dice (dice: number[]) {
    return dice.join (", ");
  }

}
