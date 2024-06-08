import { Injectable, inject } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrStory } from "../game/wotr-story.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-card.models";

export interface WotrCardParams {
  front: WotrFrontId;
  story: WotrStory;
  // shadow: WotrCombatFront;
  // freePeoples: WotrCombatFront;
  // combatRound: WotrCombatRound;
  // card: WotrCard;
  // isAttacker: boolean;
}

@Injectable ()
export class WotrCardEffectsService {

  private storyService = inject (WotrStoryService);
  private huntStore = inject (WotrHuntStore);
  private huntFlow = inject (WotrHuntFlowService);

  private cardEffects: Partial<Record<WotrCardLabel, (params: WotrCardParams) => Promise<void>>> = {
    "Isildur's Bane": async params => {
      const action = this.storyService.findAction<WotrHuntTileDraw> (params.story, "hunt-tile-draw");
      this.huntFlow.resolveHuntTile (action.tile, {
        ignoreEyeTile: true,
        ignoreFreePeopleSpecialTile: true
      });
    },
    "The Breaking of the Fellowship": async params => {
      const action = this.storyService.findAction<WotrHuntTileDraw> (params.story, "hunt-tile-draw");
      const huntTile = this.huntStore.huntTile (action.tile);
      if (huntTile.eye || huntTile.type === "free-people-special") { return; }
      const damage = huntTile.quantity!; // TODO shelob die
      if (damage) {
        await this.storyService.separateCompanions ("free-peoples");
      }
    }
  };

  registerCardEffects () {
    const cardEffectsById: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>> = { };
    objectUtil.forEachProp (this.cardEffects, (label, cardEffect) => {
      cardEffectsById[labelToCardId (label as WotrCardLabel)] = cardEffect;
    });
    this.storyService.registerCardEffects (cardEffectsById);
  }

}
