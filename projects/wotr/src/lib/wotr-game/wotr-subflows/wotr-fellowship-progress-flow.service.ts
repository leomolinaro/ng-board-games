import { Observable, map, of, switchMap } from "rxjs";
import { WotrGameActionsService } from "../../wotr-actions/wotr-game-actions.service";
import { WotrHuntRoll } from "../../wotr-actions/wotr-hunt-actions";
import { WotrHuntTile } from "../../wotr-elements/wotr-hunt.models";
import { WotrHuntStore } from "../../wotr-elements/wotr-hunt.store";
import { WotrLogStore } from "../../wotr-elements/wotr-log.store";
import { WotrRulesService } from "../../wotr-rules/wotr-rules.service";
import { WotrAction, WotrStory } from "../../wotr-story.models";
import { WotrStoryService } from "../wotr-story.service";

export class WotrFellowshipProgressFlow {

  constructor (
    private huntStore: (WotrHuntStore),
    private logStore: (WotrLogStore),
    private gameActions: (WotrGameActionsService),
    private rules: (WotrRulesService),
    private story: (WotrStoryService)
  ) { }

  execute$ (action: WotrAction, story: WotrStory) {
    return this.huntRoll$ ().pipe (
      switchMap (huntRoll => {
        const nSuccesses = this.rules.hunt.getNSuccesses (huntRoll, this.huntStore.state ());
        if (!nSuccesses) { return of (void 0); }
        return this.drawHuntTile$ ().pipe (
          switchMap (huntTile => this.absorbHuntDamage$ (huntTile))
        );
      }),
    );
  }

  private huntRoll$ (): Observable<WotrHuntRoll> {
    return this.story.executeTask$ ("shadow", p => p.rollHuntDice$! ()).pipe (
      map (story => {
        const action = story.actions[0];
        if (action?.type !== "hunt-roll") { throw new Error ("Unexpected story"); }
        this.logStore.logAction (action, "shadow");
        this.gameActions.applyAction (action, "shadow");
        return action;
      })
    );
  }

  private drawHuntTile$ (): Observable<WotrHuntTile> {
    return this.story.executeTask$ ("shadow", p => p.drawHuntTile$! ()).pipe (
      map (story => {
        const action = story.actions[0];
        if (action?.type !== "hunt-tile-draw") { throw new Error ("Unexpected story"); }
        this.logStore.logAction (action, "shadow");
        this.gameActions.applyAction (action, "shadow");
        return action.tile;
      })
    );
  }

  private absorbHuntDamage$ (huntTile: WotrHuntTile) {
    return this.story.executeTask$ ("free-peoples", p => p.absorbHuntDamage$! ()).pipe (
      map (story => {
        const action = story.actions[0];
        // if (action?.type !== "hunt-tile-draw") { throw new Error ("Unexpected story"); }
        this.logStore.logAction (action, "free-peoples");
        this.gameActions.applyAction (action, "free-peoples");
        // return action.tile;
      })
    );
  }

}
