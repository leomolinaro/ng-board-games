import { Injectable } from "@angular/core";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrFellowshipAction } from "./wotr-fellowship-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrFellowshipActionsService {

  getActionAppliers (): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front) => { },
      "fellowship-declare": (action, front) => { },
      "fellowship-declare-not": (action, front) => { },
      "fellowship-guide": (action, front) => { },
      "fellowship-hide": (action, front) => { },
      "fellowship-progress": (action, front) => { },
      "fellowship-reveal": (action, front) => { },
    };
  }

}
