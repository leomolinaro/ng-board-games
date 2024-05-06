import { Injectable, inject } from "@angular/core";
import { EMPTY, Observable, expand, last, map, of, switchMap } from "rxjs";
import { WotrCompanionStore } from "../../wotr-elements/companion/wotr-companion.store";
import { WotrHuntTileId } from "../../wotr-elements/hunt/wotr-hunt.models";
import { WotrHuntStore } from "../../wotr-elements/hunt/wotr-hunt.store";
import { WotrStoryService } from "../../wotr-game/wotr-story.service";
import { WotrUnexpectedStory } from "../../wotr-game/wotr-unexpected-story";
import { WotrRulesService } from "../../wotr-rules/wotr-rules.service";
import { WotrAction } from "../../wotr-story.models";
import { WotrHuntRoll } from "../hunt/wotr-hunt-actions";
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
      "fellowship-corruption": (action, front)  => of (void 0),
      "fellowship-declare": (action, front)  => of (void 0),
      "fellowship-declare-not": (action, front)  => of (void 0),
      "fellowship-guide": (action, front) => of (void 0),
      "fellowship-hide": (action, front) => of (void 0),
      "fellowship-progress": (action, front, gameActions) => this.fellowshipProgressEffect$ (action, gameActions),
      "fellowship-reveal": (action, front) => of (void 0),
    };
  }

  fellowshipProgressEffect$ (action: WotrAction, gameActions: WotrGameActionsService/* , story: WotrStory */) {
    this.huntStore.addFellowshipDie ();
    return this.huntRoll$ (gameActions).pipe (
      switchMap (huntRoll => {
        const nSuccesses = this.rules.hunt.getNSuccesses (huntRoll, this.huntStore.state ());
        if (!nSuccesses) { return of (void 0); }
        return this.drawHuntTile$ (gameActions).pipe (
          switchMap (huntTileId => {
            const huntTile = this.huntStore.huntTile (huntTileId);
            console.log ("huntRoll", huntRoll);
            let damage = huntTile.eye ? nSuccesses : huntTile.quantity!; // TODO
            return this.absorbHuntDamage$ (gameActions).pipe (
              expand (absorbedDamage => {
                damage -= absorbedDamage;
                if (damage <= 0) { return EMPTY; }
                return this.absorbHuntDamage$ (gameActions);
              }),
              last ()
            );
          })
        );
      }),
    );
  }

  private huntRoll$ (gameActions: WotrGameActionsService): Observable<WotrHuntRoll> {
    return this.story.executeTask$ ("shadow", p => p.rollHuntDice$! ()).pipe (
      switchMap (story => {
        const action = story.actions[0];
        if (action?.type !== "hunt-roll") { throw new WotrUnexpectedStory (story); }
        return gameActions.applyStory$ (story, "shadow").pipe (map (() => action));
      })
    );
  }

  private drawHuntTile$ (gameActions: WotrGameActionsService): Observable<WotrHuntTileId> {
    return this.story.executeTask$ ("shadow", p => p.drawHuntTile$! ()).pipe (
      switchMap (story => {
        const action = story.actions[0];
        if (action?.type !== "hunt-tile-draw") { throw new WotrUnexpectedStory (story); }
        return gameActions.applyStory$ (story, "shadow").pipe (map (() => action.tile));
      })
    );
  }

  absorbHuntDamage$ (gameActions: WotrGameActionsService): Observable<number> {
    return this.story.executeTask$ ("free-peoples", p => p.absorbHuntDamage$! ()).pipe (
      switchMap (story => {
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
        return gameActions.applyStory$ (story, "free-peoples").pipe (map (() => absorbedDamage));
      })
    );
  }

}
