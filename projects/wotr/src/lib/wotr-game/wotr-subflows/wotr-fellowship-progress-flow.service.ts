import { concatJoin } from "@leobg/commons/utils";
import { EMPTY, Observable, expand, last, map, of, switchMap, tap } from "rxjs";
import { WotrGameActionsService } from "../../wotr-actions/wotr-game-actions.service";
import { WotrHuntRoll } from "../../wotr-actions/wotr-hunt-actions";
import { labelToCardId } from "../../wotr-elements/wotr-card.models";
import { WotrCompanionStore } from "../../wotr-elements/wotr-companion.store";
import { WotrFrontStore } from "../../wotr-elements/wotr-front.store";
import { WotrHuntTileId } from "../../wotr-elements/wotr-hunt.models";
import { WotrHuntStore } from "../../wotr-elements/wotr-hunt.store";
import { WotrLogStore } from "../../wotr-elements/wotr-log.store";
import { WotrRulesService } from "../../wotr-rules/wotr-rules.service";
import { WotrAction, WotrStory } from "../../wotr-story.models";
import { WotrStoryService } from "../wotr-story.service";
import { WotrUnexpectedStory } from "../wotr-unexpected-story";

export class WotrFellowshipProgressFlow {

  constructor (
    private huntStore: (WotrHuntStore),
    private companionStore: (WotrCompanionStore),
    private frontStore: (WotrFrontStore),
    private logStore: (WotrLogStore),
    private gameActions: (WotrGameActionsService),
    private rules: (WotrRulesService),
    private story: (WotrStoryService)
  ) { }

  execute$ (action: WotrAction, story: WotrStory) {
    this.huntStore.addFellowshipDie ();
    return this.huntRoll$ ().pipe (
      switchMap (huntRoll => {
        const nSuccesses = this.rules.hunt.getNSuccesses (huntRoll, this.huntStore.state ());
        if (!nSuccesses) { return of (void 0); }
        return this.drawHuntTile$ ().pipe (
          switchMap (huntTileId => {
            const huntTile = this.huntStore.huntTile (huntTileId);
            console.log ("huntRoll", huntRoll);
            let damage = huntTile.eye ? nSuccesses : huntTile.quantity!; // TODO
            return this.absorbHuntDamage$ ().pipe (
              expand (absorbedDamage => {
                damage -= absorbedDamage;
                if (damage <= 0) { return EMPTY; }
                return this.absorbHuntDamage$ ();
              }),
              last ()
            );
          })
        );
      }),
    );
  }

  private huntRoll$ (): Observable<WotrHuntRoll> {
    return this.story.executeTask$ ("shadow", p => p.rollHuntDice$! ()).pipe (
      map (story => {
        const action = story.actions[0];
        if (action?.type !== "hunt-roll") { throw new WotrUnexpectedStory (story); }
        this.logStore.logAction (action, "shadow");
        this.gameActions.applyAction (action, "shadow");
        return action;
      })
    );
  }

  private drawHuntTile$ (): Observable<WotrHuntTileId> {
    return this.story.executeTask$ ("shadow", p => p.drawHuntTile$! ()).pipe (
      map (story => {
        const action = story.actions[0];
        if (action?.type !== "hunt-tile-draw") { throw new WotrUnexpectedStory (story); }
        this.logStore.logAction (action, "shadow");
        this.gameActions.applyAction (action, "shadow");
        return action.tile;
      })
    );
  }

  private absorbHuntDamage$ (): Observable<number> {
    return this.story.executeTask$ ("free-peoples", p => p.absorbHuntDamage$! ()).pipe (
      switchMap (story => {
        let absorbedDamage = 0;
        story.actions.forEach (action => {
          this.logStore.logAction (action, "free-peoples");
          this.gameActions.applyAction (action, "free-peoples");
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
        return this.actionResolutionSubFlows$ (story).pipe (map (() => absorbedDamage));
      })
    );
  }

  private actionResolutionSubFlows$ (story: WotrStory): Observable<unknown> {
    return concatJoin (story.actions.map (action => this.actionResolutionSubFlow$ (action, story)));
  }

  private actionResolutionSubFlow$ (action: WotrAction, story: WotrStory): Observable<unknown> {
    switch (action.type) {
      case "companion-elimination": {
        const cardId = labelToCardId ("Worn with Sorrow and Toil");
        if (this.frontStore.hasTableCard (cardId, "shadow")) {
          return this.story.executeTask$ ("shadow", p => p.activateTableCard$! (cardId)).pipe (
            tap (s => {
              s.actions.forEach (a => {
                this.logStore.logCardAction (a, cardId, "shadow");
                this.gameActions.applyAction (a, "shadow");
              });
            })
          );
        } else {
          return of (void 0);
        }
      }
    }
    switch (story.card) {
      case labelToCardId ("Worn with Sorrow and Toil"): {
        switch (action.type) {
          case "card-random-discard": return  this.absorbHuntDamage$ ();
          default: return of (void 0);
        }
      }
      default: return of (void 0);
      //   switch (action.type) {
      //     case "companion-random": return this.absorbHuntDamage$ ();
      //     default: return of (void 0);
      //   }
      // }
    }
  }

}
