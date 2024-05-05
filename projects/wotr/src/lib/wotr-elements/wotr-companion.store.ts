import { Injectable, Signal, computed } from "@angular/core";
import { WotrCompanion, WotrCompanionId } from "./wotr-companion.models";

export interface WotrCompanionState {
  ids: WotrCompanionId[];
  map: Record<WotrCompanionId, WotrCompanion>;
}

@Injectable ({
  providedIn: "root"
})
export class WotrCompanionStore {

  update!: (actionName: string, updater: (a: WotrCompanionState) => WotrCompanionState) => void;
  state!: Signal<WotrCompanionState>;

  companionById = computed (() => this.state ().map);
  companions = computed (() => { const s = this.state (); return s.ids.map (id => s.map[id]); });
  companion (companionId: WotrCompanionId): WotrCompanion { return this.state ().map[companionId]; }

  init (): WotrCompanionState {
    return {
      ids: [
        "gandalf-the-grey", "strider", "boromir", "legolas",
        "gimli", "meriadoc", "peregrin", "aragorn", "gandalf-the-white"
      ],
      map: {
        "gandalf-the-grey": this.initCompanion ("gandalf-the-grey", "Gandalf the Grey", 3, 1),
        strider: this.initCompanion ("strider", "Strider", 3, 1),
        boromir: this.initCompanion ("boromir", "Boromir", 2, 1),
        legolas: this.initCompanion ("legolas", "Legolas", 2, 1),
        gimli: this.initCompanion ("gimli", "Gimli", 2, 1),
        meriadoc: this.initCompanion ("meriadoc", "Meriadoc", 1, 1),
        peregrin: this.initCompanion ("peregrin", "Peregrin", 1, 1),
        aragorn: this.initCompanion ("aragorn", "Aragorn", 3, 2),
        "gandalf-the-white": this.initCompanion ("gandalf-the-white", "Gandalf the White", 3, 1)
      }
    };
  }

  private initCompanion (
    id: WotrCompanionId, name: string,
    level: number, leadership: number
  ): WotrCompanion {
    return { id, name, level, leadership, status: "available" };
  }

  getCompanion (id: WotrCompanionId, state: WotrCompanionState) { return state.map[id]; }
  getCompanions (state: WotrCompanionState) { return state.ids.map (id => state.map[id]); }

  private updateCompanion (actionName: string, companionId: WotrCompanionId, updater: (a: WotrCompanion) => WotrCompanion) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [companionId]: updater (s.map[companionId]) } }));
  }

  setEliminated (companionId: WotrCompanionId) {
    this.updateCompanion ("setEliminated", companionId, companion => ({
      ...companion,
      status: "eliminated"
    }));
  }

  setInFellowship (companionId: WotrCompanionId) {
    this.updateCompanion ("setInFellowship", companionId, companion => ({
      ...companion,
      status: "inFellowship"
    }));
  }

}
