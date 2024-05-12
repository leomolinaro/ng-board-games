import { Injectable, inject } from "@angular/core";
import { labelToCardId } from "../../wotr-elements/card/wotr-card.models";
import { WotrFrontStore } from "../../wotr-elements/front/wotr-front.store";
import { WotrStoryService } from "../../wotr-game/wotr-story.service";
import { WotrActionEffectMap } from "../wotr-effect-getter";
import { WotrCompanionAction, WotrCompanionElimination } from "./wotr-companion-actions";

@Injectable ()
export class WotrCompanionEffectsService {

  private frontStore = inject (WotrFrontStore);
  private storyService = inject (WotrStoryService);

  getActionEffects (): WotrActionEffectMap<WotrCompanionAction> {
    return {
      "companion-elimination": async (action, front) => this.companionEliminationEffect (action),
      "companion-movement": async (action, front) => { },
      "companion-play": async (action, front) => { },
      "companion-random": async (action, front) => { },
      "companion-separation": async (action, front) => { },
    };
  }

  private async companionEliminationEffect (action: WotrCompanionElimination) {
    const cardId = labelToCardId ("Worn with Sorrow and Toil");
    if (this.frontStore.hasTableCard (cardId, "shadow")) {
      await this.storyService.activateTableCard (cardId, "shadow");
    }
  }

}
