import { Injectable, inject } from "@angular/core";
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
      "army-attack": async (action, front, gameActions) => this.armyAttackEffect (action, front, gameActions),
      "army-movement": async (action, front, gameActions) => { },
      "army-retreat-into-siege": async (action, front, gameActions) => { },
      "unit-elimination": async (action, front, gameActions) => { },
      "unit-recruitment": async (action, front, gameActions) => { },
    };
  }

  private async armyAttackEffect (action: WotrArmyAttack, front: WotrFrontId, gameActions: WotrGameActionsService) {
    const otherFront = oppositeFront (front);
    const chooseCombatCard = await this.story.executeTask (front, p => p.chooseCombatCard! ());
    await gameActions.applyStory (chooseCombatCard, front);
    const chooseOpponentCombatCard = await this.story.executeTask (otherFront, p => p.chooseCombatCard! ());
    await gameActions.applyStory (chooseOpponentCombatCard, otherFront);
  }

}
