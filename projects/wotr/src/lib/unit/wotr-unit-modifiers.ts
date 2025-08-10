import { Injectable } from "@angular/core";
import { WotrArmy } from "./wotr-unit-models";

export type WotrLeadershipModifier = (army: WotrArmy) => number;

@Injectable({ providedIn: "root" })
export class WotrUnitModifiers {
  private leadershipModifiers: WotrLeadershipModifier[] = [];

  registerLeadershipModifier(modifier: WotrLeadershipModifier): void {
    this.leadershipModifiers.push(modifier);
  }

  unregisterLeadershipModifier(modifier: WotrLeadershipModifier): void {
    this.leadershipModifiers = this.leadershipModifiers.filter(m => m !== modifier);
  }

  getLeadershipModifier(army: WotrArmy): number {
    return this.leadershipModifiers.reduce((total, modifier) => total + modifier(army), 0);
  }

  clear() {
    this.leadershipModifiers = [];
  }
}
