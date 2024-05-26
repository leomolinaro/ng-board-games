import { Injectable, Signal } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCompanionId } from "../companion/wotr-companion.models";
import { WotrFellowship } from "./wotr-fellowhip.models";

@Injectable ({
  providedIn: "root"
})
export class WotrFellowshipStore {

  update!: (actionName: string, updater: (a: WotrFellowship) => WotrFellowship) => void;
  state!: Signal<WotrFellowship>;

  isRevealed () { return this.state ().status === "revealed"; }
  guide () { return this.state ().guide; }

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
  reveal () { this.update ("reveal", state => ({ ...state, status: "revealed", progress: 0 })); }
  removeCompanion (companionId: WotrCompanionId) {
    this.update ("removeCompanion", state => ({
      ...state,
      companions: immutableUtil.listRemoveFirst (c => c === companionId, state.companions)
    }));
  }

}
