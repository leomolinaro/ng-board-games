import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrArmy } from "./wotr-unit-models";

export type WotrLeadershipModifier = (army: WotrArmy) => number;

@Injectable({ providedIn: "root" })
export class WotrUnitModifiers {
  public readonly leadership = new WotrModifier<WotrLeadershipModifier>();

  getLeadership(army: WotrArmy): number {
    return this.leadership.get().reduce((total, modifier) => total + modifier(army), 0);
  }

  clear() {
    this.leadership.clear();
  }
}
