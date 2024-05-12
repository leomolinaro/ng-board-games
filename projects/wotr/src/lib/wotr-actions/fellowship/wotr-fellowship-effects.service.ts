import { Injectable, inject } from "@angular/core";
import { WotrHuntStore } from "../../wotr-elements/hunt/wotr-hunt.store";
import { WotrHuntFlowService } from "../../wotr-game/wotr-hunt-flow.service";
import { WotrActionEffectMap } from "../wotr-effect-getter";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ()
export class WotrFellowshipEffectsService {

  private huntStore = inject (WotrHuntStore);
  private huntFlow = inject (WotrHuntFlowService);

  getActionEffects (): WotrActionEffectMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": async (action, front) => { },
      "fellowship-declare": async (action, front) => { },
      "fellowship-declare-not": async (action, front) => { },
      "fellowship-guide": async (action, front) => { },
      "fellowship-hide": async (action, front) => { },
      "fellowship-progress": async (action, front) => {
        this.huntStore.addFellowshipDie ();
        await this.huntFlow.resolveHunt ();
      },
      "fellowship-reveal": async (action, front) => { },
    };
  }

}
