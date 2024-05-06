import { Injectable, inject } from "@angular/core";
import { labelToCardId } from "../../wotr-elements/card/wotr-card.models";
import { WotrFrontStore } from "../../wotr-elements/front/wotr-front.store";
import { WotrStoryService } from "../../wotr-game/wotr-story.service";
import { WotrEffectGetterMap } from "../wotr-effect-getter";
import { WotrGameActionsService } from "../wotr-game-actions.service";
import { WotrCompanionAction, WotrCompanionElimination } from "./wotr-companion-actions";

@Injectable ()
export class WotrCompanionEffectsService {

  private frontStore = inject (WotrFrontStore);
  private story = inject (WotrStoryService);

  getEffectGetters (): WotrEffectGetterMap<WotrCompanionAction> {
    return {
      "companion-elimination": async (action, front, gameActions) => this.companionEliminationEffect (action, gameActions),
      "companion-movement": async (action, front, gameActions) => { },
      "companion-play": async (action, front, gameActions) => { },
      "companion-random": async (action, front, gameActions) => { },
      "companion-separation": async (action, front, gameActions) => { },
    };
  }

  private async companionEliminationEffect (action: WotrCompanionElimination, gameActions: WotrGameActionsService) {
    const cardId = labelToCardId ("Worn with Sorrow and Toil");
    if (this.frontStore.hasTableCard (cardId, "shadow")) {
      const story = await this.story.executeTask ("shadow", p => p.activateTableCard! (cardId));
      await gameActions.applyCardStory (story, cardId, "shadow");
    }
  }

}
