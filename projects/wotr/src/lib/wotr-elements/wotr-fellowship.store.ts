import { Injectable } from "@angular/core";
import { WotrCompanionId } from "./wotr-companion.models";
import { WotrFellowship } from "./wotr-fellowhip.models";

@Injectable ({
  providedIn: "root"
})
export class WotrFellowshipStore {

  update!: (actionName: string, updater: (a: WotrFellowship) => WotrFellowship) => void;

  init (): WotrFellowship {
    return {
      status: "hidden",
      companions: [],
      guide: "gandalf-the-grey"
    };
  }

  setCompanions (companions: WotrCompanionId[]) {
    this.update ("setCompanions", state => ({ ...state, companions }));
  }

  setGuide (guide: WotrCompanionId) {
    this.update ("setGuide", state => ({ ...state, guide }));
  }

}
