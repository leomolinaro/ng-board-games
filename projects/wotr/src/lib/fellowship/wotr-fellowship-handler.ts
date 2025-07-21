import { inject, Injectable } from "@angular/core";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCompanionSeparation, WotrFellowshipAction } from "./wotr-fellowship-actions";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable({ providedIn: "root" })
export class WotrFellowshipHandler {
  private actionService = inject(WotrActionService);
  private nationHandler = inject(WotrNationHandler);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private huntStore = inject(WotrHuntStore);
  private huntFlow = inject(WotrHuntFlowService);
  private characterStore = inject(WotrCharacterStore);
  private characterHandler = inject(WotrCharacterHandler);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-declare": async (story, front) => {
        this.regionStore.moveFellowshipToRegion(story.region);
        this.fellowshipStore.setProgress(0);
        this.nationHandler.checkNationActivationByFellowshipDeclaration(story.region);
      },
      "fellowship-declare-not": async (story, front) => {
        /*empty*/
      },
      "fellowship-corruption": async (action, front) => {
        this.fellowshipStore.changeCorruption(action.quantity);
      },
      "fellowship-guide": async (action, front) => {
        this.fellowshipStore.setGuide(action.companion);
      },
      "fellowship-hide": async (action, front) => {
        this.fellowshipStore.hide();
      },
      "fellowship-progress": async (action, front) => {
        if (this.fellowshipStore.isOnMordorTrack()) {
          await this.huntFlow.resolveHunt();
          this.huntStore.addFellowshipDie();
        } else {
          this.fellowshipStore.increaseProgress();
          await this.huntFlow.resolveHunt();
          this.huntStore.addFellowshipDie();
        }
      },
      "fellowship-reveal": async (action, front) => {
        this.regionStore.moveFellowshipToRegion(action.region);
        this.fellowshipStore.reveal();
      },
      "companion-random": async (action, front) => {
        /*empty*/
      },
      "companion-separation": async (action, front) => this.separateCompanion(action)
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
      ],
      "companion-random": (action, front, f) => [
        f.player(front),
        " draws ",
        this.characters(action.companions),
        " randomly"
      ],
      "companion-separation": (action, front, f) => [
        f.player(front),
        " separates ",
        this.characters(action.companions),
        " from the fellowship"
      ]
    };
  }

  private characters(characters: WotrCharacterId[]) {
    return characters.map(c => this.characterStore.character(c).name).join(", ");
  }

  private nCorruptionPoints(quantity: number) {
    return `${quantity} corruption point${quantity === 1 ? "" : "s"}`;
  }

  separateCompanion(action: WotrCompanionSeparation) {
    const toRegion = this.regionStore.region(action.toRegion);
    for (const companionId of action.companions) {
      this.fellowshipStore.removeCompanion(companionId);
      this.characterStore.setInPlay(companionId);
      const character = this.characterStore.character(companionId);
      this.characterHandler.addCharacterToRegion(character, toRegion);
    }
    this.nationHandler.checkNationActivationByCharacters(action.toRegion, action.companions);
  }
}
