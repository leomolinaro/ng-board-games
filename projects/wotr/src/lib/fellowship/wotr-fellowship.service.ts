import { Injectable, inject } from "@angular/core";
import { separateCompanions } from "../character/wotr-character-actions";
import { WotrCharacterService } from "../character/wotr-character.service";
import { WotrCharacterStore } from "../character/wotr-character.store";
import {
  WotrAction,
  WotrActionApplierMap,
  WotrActionLoggerMap
} from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable({ providedIn: "root" })
export class WotrFellowshipService {
  private actionService = inject(WotrActionService);
  private nationService = inject(WotrNationService);
  private fellowhipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private huntStore = inject(WotrHuntStore);
  private huntFlow = inject(WotrHuntFlowService);
  private characterStore = inject(WotrCharacterStore);
  private characterService = inject(WotrCharacterService);
  private ui = inject(WotrGameUiStore);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-declare": async (story, front) => {
        this.regionStore.moveFellowshipToRegion(story.region);
        this.fellowhipStore.setProgress(0);
        this.nationService.checkNationActivationByFellowshipDeclaration(story.region);
      },
      "fellowship-declare-not": async (story, front) => {
        /*empty*/
      },
      "fellowship-corruption": async (action, front) => {
        this.fellowhipStore.changeCorruption(action.quantity);
      },
      "fellowship-guide": async (action, front) => {
        this.fellowhipStore.setGuide(action.companion);
      },
      "fellowship-hide": async (action, front) => {
        this.fellowhipStore.hide();
      },
      "fellowship-progress": async (action, front) => {
        if (this.fellowhipStore.isOnMordorTrack()) {
          await this.huntFlow.resolveHunt();
          this.huntStore.addFellowshipDie();
        } else {
          this.fellowhipStore.increaseProgress();
          await this.huntFlow.resolveHunt();
          this.huntStore.addFellowshipDie();
        }
      },
      "fellowship-reveal": async (action, front) => {
        this.regionStore.moveFellowshipToRegion(action.region);
        this.fellowhipStore.reveal();
      }
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front, f) => [
        f.player(front),
        ` ${action.quantity < 0 ? "heals" : "adds"} ${this.nCorruptionPoints(Math.abs(action.quantity))}`
      ],
      "fellowship-guide": (action, front, f) => [
        f.player(front),
        " chooses ",
        f.character(action.companion),
        " as the guide"
      ],
      "fellowship-declare": (action, front, f) => [
        f.player(front),
        " declares the fellowship in ",
        f.region(action.region)
      ],
      "fellowship-declare-not": (action, front, f) => [
        f.player(front),
        " does not declare the fellowship"
      ],
      "fellowship-hide": (action, front, f) => [f.player(front), " hides the fellowship"],
      "fellowship-progress": (action, front, f) => [f.player(front), " moves the fellowhip"],
      "fellowship-reveal": (action, front, f) => [
        f.player(front),
        " reveals the fellowship in ",
        f.region(action.region)
      ]
    };
  }

  private nCorruptionPoints(quantity: number) {
    return `${quantity} corruption point${quantity === 1 ? "" : "s"}`;
  }

  async separateCompanions(frontId: string): Promise<WotrAction[]> {
    const fellowshipCompanions = this.fellowhipStore.companions();
    const companions = await this.ui.askFellowshipCompanions("Select companions to separate", {
      companions: fellowshipCompanions
    });
    const level = companions.reduce((l, companionId) => {
      const companion = this.characterStore.character(companionId);
      if (l < companion.level) return companion.level;
      return l;
    }, 0);
    const fellowshipProgress = this.fellowhipStore.progress();
    const totalMovement = fellowshipProgress + level;
    const fellowshipRegion = this.regionStore.fellowshipRegion();
    const targetRegions = this.regionStore.reachableRegions(
      fellowshipRegion,
      totalMovement,
      region => this.characterService.companionCanLeaveRegion(region),
      region => this.characterService.companionCanEnterRegion(region)
    );
    const targetRegion = await this.ui.askRegion(
      "Select a region to move the separated companions",
      targetRegions
    );
    return [separateCompanions(targetRegion, ...companions)];
  }
}
