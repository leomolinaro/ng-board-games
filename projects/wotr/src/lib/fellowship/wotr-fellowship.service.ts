import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap, WotrStoryApplier } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { playerLog, regionLog } from "../log/wotr-log.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrFellowshipAction, WotrFellowshipDeclare, WotrFellowshipDeclareNot } from "./wotr-fellowship-actions";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable ()
export class WotrFellowshipService {
  
  private actionService = inject (WotrActionService);
  private nationService = inject (WotrNationService);
  private fellowhipStore = inject (WotrFellowshipStore);
  private regionStore = inject (WotrRegionStore);
  private huntStore = inject (WotrHuntStore);
  private huntFlow = inject (WotrHuntFlowService);
  private logStore = inject (WotrLogStore);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
    this.actionService.registerActionLoggers (this.getActionLoggers () as any);
    this.actionService.registerStory ("fellowship-declare", this.fellowshipDeclare);
    this.actionService.registerStory ("fellowship-declare-not", this.fellowshipDeclareNot);
  }

  private fellowshipDeclare: WotrStoryApplier<WotrFellowshipDeclare> = async (story, front) => {
    this.logStore.logV2 (playerLog (front), " declares the fellowship in ", regionLog (story.region));
    this.regionStore.moveFellowshipToRegion (story.region);
    this.fellowhipStore.setProgress (0);
    this.nationService.checkNationActivationByFellowshipDeclaration (story.region);
  };

  private fellowshipDeclareNot: WotrStoryApplier<WotrFellowshipDeclareNot> = async (story, front) => {
    this.logStore.logV2 (playerLog (front), " does not declare the fellowship");
  };

  getActionAppliers (): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": async (action, front) => { this.fellowhipStore.changeCorruption (action.quantity); },
      "fellowship-guide": async (action, front) => { this.fellowhipStore.setGuide (action.companion); },
      "fellowship-hide": async (action, front) => { this.fellowhipStore.hide (); },
      "fellowship-progress": async (action, front) => {
        if (this.fellowhipStore.isOnMordorTrack ()) {
          await this.huntFlow.resolveHunt ();
          this.huntStore.addFellowshipDie ();
        } else {
          this.fellowhipStore.increaseProgress ();
          await this.huntFlow.resolveHunt ();
          this.huntStore.addFellowshipDie ();
        }
      },
      "fellowship-reveal": async (action, front) => {
        this.regionStore.moveFellowshipToRegion (action.region);
        this.fellowhipStore.reveal ();
      },
    };
  }

  private getActionLoggers (): WotrActionLoggerMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front, f) => [
        f.player (front),
        ` ${ action.quantity < 0 ? "heals" : "adds"} ${this.nCorruptionPoints (Math.abs (action.quantity))}`
      ],
      "fellowship-guide": (action, front, f) => [f.player (front), " chooses ", f.character (action.companion), " as the guide"],
      "fellowship-hide": (action, front, f) => [f.player (front), " hides the fellowship"],
      "fellowship-progress": (action, front, f) => [f.player (front), " moves the fellowhip"],
      "fellowship-reveal": (action, front, f) => [f.player (front), " reveals the fellowship in ", f.region (action.region)],
    };
  }

  private nCorruptionPoints (quantity: number) {
    return `${quantity} corruption point${quantity === 1 ? "" : "s"}`;
  }

}
