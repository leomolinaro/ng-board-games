import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrArmyUnitType, WotrNationId } from "../nation/wotr-nation-models";
import { WotrArmy } from "./wotr-unit-models";

export type WotrLeaderModifier = (unitType: WotrArmyUnitType, nationId: WotrNationId) => boolean;

@Injectable({ providedIn: "root" })
export class WotrUnitModifiers {
  public readonly leaderModifier = new WotrModifier<WotrLeaderModifier>();

  nLeaders(army: WotrArmy): number {
    let nLeaders = 0;
    army.regulars?.forEach(unit => {
      if (this.isLeader("regular", unit.nation)) nLeaders += unit.quantity;
    });
    army.elites?.forEach(unit => {
      if (this.isLeader("elite", unit.nation)) nLeaders += unit.quantity;
    });
    return nLeaders;
  }

  isLeader(unitType: WotrArmyUnitType, nationId: WotrNationId): boolean {
    return this.leaderModifier.get().some(modifier => modifier(unitType, nationId));
  }

  clear() {
    this.leaderModifier.clear();
  }
}
