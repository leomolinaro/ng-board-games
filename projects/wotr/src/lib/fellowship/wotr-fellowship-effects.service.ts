import { Injectable, inject } from "@angular/core";
import { WotrActionEffectMap } from "../commons/wotr-effect-getter";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
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
