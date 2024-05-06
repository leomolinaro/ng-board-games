import { Injectable, inject } from "@angular/core";
import { of, switchMap } from "rxjs";
import { WotrFrontId, oppositeFront } from "../../wotr-elements/front/wotr-front.models";
import { WotrFrontStore } from "../../wotr-elements/front/wotr-front.store";
import { WotrStoryService } from "../../wotr-game/wotr-story.service";
import { WotrEffectGetterMap } from "../wotr-effect-getter";
import { WotrGameActionsService } from "../wotr-game-actions.service";
import { WotrArmyAction, WotrArmyAttack } from "./wotr-army-actions";

@Injectable ()
export class WotrArmyEffectsService {

  private frontStore = inject (WotrFrontStore);
  private story = inject (WotrStoryService);

  getEffectGetters (): WotrEffectGetterMap<WotrArmyAction> {
    return {
      "army-attack": (action, front, gameActions) => this.armyAttackEffect$ (action, front, gameActions),
      "army-movement": (action, front, gameActions) => of (void 0),
      "army-retreat-into-siege": (action, front, gameActions) => of (void 0),
      "unit-elimination": (action, front, gameActions) => of (void 0),
      "unit-recruitment": (action, front, gameActions) => of (void 0),
    };
  }

  private armyAttackEffect$ (action: WotrArmyAttack, front: WotrFrontId, gameActions: WotrGameActionsService) {
    // return of (void 0);
    const otherFront = oppositeFront (front);
    return this.story.executeTask$ (front, p => p.chooseCombatCard$! ()).pipe (
      switchMap (chooseCombatCard => gameActions.applyStory$ (chooseCombatCard, front)),
      switchMap (() => this.story.executeTask$ (otherFront, p => p.chooseCombatCard$! ())),
      switchMap (chooseOpponentCombatCard => gameActions.applyStory$ (chooseOpponentCombatCard, otherFront)),
    );


    // const cardId = labelToCardId ("Worn with Sorrow and Toil");
    // if (this.frontStore.hasTableCard (cardId, "shadow")) {
    //     switchMap (s => gameActions.applyCardStory$ (s, cardId, "shadow"))
    //   );
    // } else {
    //   return of (void 0);
    // }
  }

}
