import { Injectable, Signal } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character.models";
import { WotrFellowship, WotrMordorTrack } from "./wotr-fellowhip.models";

export function initialeState (): WotrFellowship {
  return {
    status: "hidden",
    companions: [],
    progress: 0,
    corruption: 0,
    guide: "gandalf-the-grey",
  };
}

@Injectable ({
  providedIn: "root"
})
export class WotrFellowshipStore {

  update!: (actionName: string, updater: (a: WotrFellowship) => WotrFellowship) => void;
  state!: Signal<WotrFellowship>;

  isRevealed () { return this.state ().status === "revealed"; }
  guide () { return this.state ().guide; }
  isOnMordorTrack () { return this.state ().mordorTrack != null; }

  setCompanions (companions: WotrCompanionId[]) { this.update ("setCompanions", state => ({ ...state, companions })); }
  setGuide (guide: WotrCompanionId) { this.update ("setGuide", state => ({ ...state, guide })); }
  setProgress (progress: number) { this.update ("setProgress", state => ({ ...state, progress })); }
  increaseProgress () { this.update ("increaseProgress", state => ({ ...state, progress: state.progress + 1 })); }
  changeCorruption (delta: number) { this.update ("changeCorruption", state => ({ ...state, corruption: state.corruption + delta })); }
  hide () { this.update ("hide", state => ({ ...state, status: "hidden" })); }
  reveal () { this.update ("reveal", state => ({ ...state, status: "revealed", progress: 0 })); }
  removeCompanion (companionId: WotrCharacterId) {
    this.update ("removeCompanion", state => ({
      ...state,
      companions: immutableUtil.listRemoveFirst (c => c === companionId, state.companions)
    }));
  }

  moveOnMordorTrack () {
    this.update ("moveOnMordorTrack", state => ({ ...state, mordorTrack: state.mordorTrack == null ? 0 : (state.mordorTrack + 1) as WotrMordorTrack }));
  }

}
