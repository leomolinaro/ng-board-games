import { Injectable, inject } from "@angular/core";
import { WotrCompanionStore } from "../../wotr-elements/companion/wotr-companion.store";
import { WotrHuntStore } from "../../wotr-elements/hunt/wotr-hunt.store";
import { WotrStoryService } from "../../wotr-game/wotr-story.service";
import { WotrUnexpectedStory } from "../../wotr-game/wotr-unexpected-story";
import { WotrRulesService } from "../../wotr-rules/wotr-rules.service";
import { WotrAction } from "../../wotr-story.models";
import { WotrEffectGetterMap } from "../wotr-effect-getter";
import { WotrGameActionsService } from "../wotr-game-actions.service";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ()
export class WotrFellowshipEffectsService {

  private huntStore = inject (WotrHuntStore);
  private companionStore = inject (WotrCompanionStore);
  private rules = inject (WotrRulesService);
  private story = inject (WotrStoryService);

  getEffectGetters (): WotrEffectGetterMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": async (action, front) => { },
      "fellowship-declare": async (action, front) => { },
      "fellowship-declare-not": async (action, front) => { },
      "fellowship-guide": async (action, front) => { },
      "fellowship-hide": async (action, front) => { },
      "fellowship-progress": async (action, front, gameActions) => this.fellowshipProgressEffect (action, gameActions),
      "fellowship-reveal": async (action, front) => { },
    };
  }

  private async fellowshipProgressEffect (action: WotrAction, gameActions: WotrGameActionsService/* , story: WotrStory */) {
    this.huntStore.addFellowshipDie ();
    const huntRoll = await this.huntRoll (gameActions);
    const nSuccesses = this.rules.hunt.getNSuccesses (huntRoll, this.huntStore.state ());
    if (!nSuccesses) { return; }
    const huntTileId = await this.drawHuntTile (gameActions);
    const huntTile = this.huntStore.huntTile (huntTileId);
    let damage = huntTile.eye ? nSuccesses : huntTile.quantity!; // TODO
    while (damage > 0) {
      const absorbedDamage = await this.absorbHuntDamage (gameActions);
      damage -= absorbedDamage;
    }
  }

  private async huntRoll (gameActions: WotrGameActionsService) {
    const story = await this.story.executeTask ("shadow", p => p.rollHuntDice! ());
    const action = story.actions[0];
    if (action?.type !== "hunt-roll") { throw new WotrUnexpectedStory (story); }
    await gameActions.applyStory (story, "shadow");
    return action;
  }

  private async drawHuntTile (gameActions: WotrGameActionsService) {
    const story = await this.story.executeTask ("shadow", p => p.drawHuntTile! ());
    const action = story.actions[0];
    if (action?.type !== "hunt-tile-draw") { throw new WotrUnexpectedStory (story); }
    await gameActions.applyStory (story, "shadow");
    return action.tile;
  }

  private async absorbHuntDamage (gameActions: WotrGameActionsService) {
    const story = await this.story.executeTask ("free-peoples", p => p.absorbHuntDamage! ());
    let absorbedDamage = 0;
    story.actions.forEach (action => {
      switch (action.type) {
        case "fellowship-corruption": absorbedDamage += action.quantity; break;
        case "companion-elimination": {
          for (const companionId of action.companions) {
            absorbedDamage += this.companionStore.companion (companionId).level;
          }
          break;
        }
      }
    });
    await gameActions.applyStory (story, "free-peoples");
    return absorbedDamage;
  }

}
