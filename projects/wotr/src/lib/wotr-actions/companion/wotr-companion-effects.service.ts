import { Injectable, inject } from "@angular/core";
import { of, switchMap } from "rxjs";
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
      "companion-elimination": (action, gameActions) => this.companionEliminationEffect$ (action, gameActions),
      "companion-movement": (action, gameActions) => of (void 0),
      "companion-play": (action, gameActions) => of (void 0),
      "companion-random": (action, gameActions) => of (void 0),
      "companion-separation": (action, gameActions) => of (void 0),
    };
  }

  private companionEliminationEffect$ (action: WotrCompanionElimination, gameActions: WotrGameActionsService) {
    const cardId = labelToCardId ("Worn with Sorrow and Toil");
    if (this.frontStore.hasTableCard (cardId, "shadow")) {
      return this.story.executeTask$ ("shadow", p => p.activateTableCard$! (cardId)).pipe (
        switchMap (s => gameActions.applyCardStory$ (s, cardId, "shadow"))
      );
    } else {
      return of (void 0);
    }
  }

}
