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
      progress: 0,
      corruption: 0,
      guide: "gandalf-the-grey"
    };
  }

  setCompanions (companions: WotrCompanionId[]) { this.update ("setCompanions", state => ({ ...state, companions })); }
  setGuide (guide: WotrCompanionId) { this.update ("setGuide", state => ({ ...state, guide })); }
  setProgress (progress: number) { this.update ("setProgress", state => ({ ...state, progress })); }
  increaseProgress () { this.update ("increaseProgress", state => ({ ...state, progress: state.progress + 1 })); }
  changeCorruption (delta: number) { this.update ("changeCorruption", state => ({ ...state, corruption: state.corruption + delta })); }
  hide () { this.update ("hide", state => ({ ...state, status: "hidden" })); }
  reveal () { this.update ("reveal", state => ({ ...state, status: "revealed" })); }

}
