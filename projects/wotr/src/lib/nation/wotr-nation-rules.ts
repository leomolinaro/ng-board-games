import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNation } from "./wotr-nation.models";
import { WotrNationStore } from "./wotr-nation.store";

@Injectable({ providedIn: "root" })
export class WotrNationRules {
  private nationStore = inject(WotrNationStore);

  canFrontAdvancePoliticalTrack(frontId: WotrFrontId): boolean {
    if (frontId === "free-peoples") {
      return this.nationStore
        .freePeoplesNations()
        .some(nation => this.canAdvancePoliticalTrack(nation));
    } else {
      return this.nationStore.shadowNations().some(nation => this.canAdvancePoliticalTrack(nation));
    }
  }
  canAdvancePoliticalTrack(nation: WotrNation): boolean {
    return (
      nation.politicalStep === 3 ||
      nation.politicalStep === 2 ||
      (nation.politicalStep === 1 && nation.active)
    );
  }
}
