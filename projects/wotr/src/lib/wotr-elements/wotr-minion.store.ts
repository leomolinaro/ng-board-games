import { Injectable } from "@angular/core";
import { WotrMinion, WotrMinionId } from "./wotr-minion.models";

export interface WotrMinionState {
  ids: WotrMinionId[];
  map: Record<WotrMinionId, WotrMinion>;
}

@Injectable ({
  providedIn: "root"
})
export class WotrMinionStore {

  update!: (actionName: string, updater: (a: WotrMinionState) => WotrMinionState) => void;

  init (): WotrMinionState {
    return {
      ids: ["saruman", "the-mouth-of-sauron", "the-witch-king"],
      map: {
        saruman: this.initMinion ("saruman", "Saruman", 0, 1),
        "the-mouth-of-sauron": this.initMinion ("the-mouth-of-sauron", "The Mouth of Sauron", 3, 2),
        "the-witch-king": this.initMinion ("the-witch-king", "The Witch King", -1, 2),
      }
    };
  }

  private initMinion (
    id: WotrMinionId, name: string,
    level: number, leadership: number
  ): WotrMinion {
    return { id, name, level, leadership, status: "available" };
  }

  getMinion (id: WotrMinionId, state: WotrMinionState) { return state.map[id]; }
  getMinions (state: WotrMinionState) { return state.ids.map (id => state.map[id]); }

  private updateMinion (actionName: string, minionId: WotrMinionId, updater: (a: WotrMinion) => WotrMinion) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [minionId]: updater (s.map[minionId]) } }));
  }

}
