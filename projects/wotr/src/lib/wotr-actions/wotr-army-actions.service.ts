import { Injectable, inject } from "@angular/core";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrGenericUnitType, WotrNationId, frontOfNation } from "../wotr-elements/wotr-nation.models";
import { WotrNationStore } from "../wotr-elements/wotr-nation.store";
import { WotrRegionId } from "../wotr-elements/wotr-region.models";
import { WotrRegionStore } from "../wotr-elements/wotr-region.store";
import { WotrActionApplierMap } from "./wotr-action-applier";
import { WotrArmyAction } from "./wotr-army-actions";

@Injectable ({
  providedIn: "root",
})
export class WotrArmyActionsService {

  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);

  getActionAppliers (): WotrActionApplierMap<WotrArmyAction> {
    return {
      "army-attack": (action, front) => { },
      "army-movement": (action, front) => {
        // action.army.units[0].
      },
      "army-retreat-into-siege": (action, front) => { },
      "unit-elimination": (action, front) => {
        const unitUtil = this.unitUtil (action.unitType);
        const frontId = frontOfNation (action.nation);
        unitUtil.removeFromRegion (action.quantity, action.nation, action.region);
        switch (frontId) {
          case "free-peoples": unitUtil.addToCasualties (action.quantity, action.nation); break;
          case "shadow": unitUtil.addToReinforcements (action.quantity, action.nation); break;
        }
      },
      "unit-recruitment": (action, front) => {
        const unitUtil = this.unitUtil (action.unitType);
        const frontId = frontOfNation (action.nation);
        unitUtil.removeFromReinforcements (action.quantity, action.nation);
        unitUtil.addToRegion (action.quantity, frontId, action.nation, action.region);
      },
    };
  }

  private unitUtil (unitType: WotrGenericUnitType) {
    switch (unitType) {
      case "regular": return this.regularUnitUtil;
      case "elite": return this.eliteUnitUtil;
      case "leader": return this.leaderUnitUtil;
      case "nazgul": return this.nazgulUnitUtil;
    }
  }

  private regularUnitUtil: UnitUtil = {
    removeFromReinforcements: (quantity, nationId) => this.nationStore.removeRegularsFromReinforcements (quantity, nationId),
    addToReinforcements: (quantity, nationId) => this.nationStore.addRegularsToReinforcements (quantity, nationId),
    addToCasualties: (quantity, nationId) => this.nationStore.addRegularsToCasualties (quantity, nationId),
    removeFromCasualties: (quantity, nationId) => this.nationStore.removeRegularsFromCasualties (quantity, nationId),
    removeFromRegion: (quantity, nationId, regionId) => this.regionStore.removeRegularsFromRegion (nationId, quantity, regionId),
    addToRegion: (quantity, frontId, nationId, regionId) => this.regionStore.addRegularsToRegion (nationId, frontId, quantity, regionId),
  };

  private eliteUnitUtil: UnitUtil = {
    removeFromReinforcements: (quantity, nationId) => this.nationStore.removeElitesFromReinforcements (quantity, nationId),
    addToReinforcements: (quantity, nationId) => this.nationStore.addElitesToReinforcements (quantity, nationId),
    addToCasualties: (quantity, nationId) => this.nationStore.addElitesToCasualties (quantity, nationId),
    removeFromCasualties: (quantity, nationId) => this.nationStore.removeElitesFromCasualties (quantity, nationId),
    removeFromRegion: (quantity, nationId, regionId) => this.regionStore.removeElitesFromRegion (nationId, quantity, regionId),
    addToRegion: (quantity, frontId, nationId, regionId) => this.regionStore.addElitesToRegion (nationId, frontId, quantity, regionId),
  };

  private leaderUnitUtil: UnitUtil = {
    removeFromReinforcements: (quantity, nationId) => this.nationStore.removeLeadersFromReinforcements (quantity, nationId),
    addToReinforcements: (quantity, nationId) => this.nationStore.addLeadersToReinforcements (quantity, nationId),
    addToCasualties: (quantity, nationId) => this.nationStore.addLeadersToCasualties (quantity, nationId),
    removeFromCasualties: (quantity, nationId) => this.nationStore.removeLeadersFromCasualties (quantity, nationId),
    removeFromRegion: (quantity, nationId, regionId) => this.regionStore.removeLeadersFromRegion (nationId, quantity, regionId),
    addToRegion: (quantity, frontId, nationId, regionId) => this.regionStore.addLeadersToRegion (nationId, quantity, regionId),
  };

  private nazgulUnitUtil: UnitUtil = {
    removeFromReinforcements: (quantity, nationId) => this.nationStore.removeNazgulFromReinforcements (quantity),
    addToReinforcements: (quantity, nationId) => this.nationStore.addNazgulToReinforcements (quantity),
    addToCasualties: (quantity, nationId) => { },
    removeFromCasualties: (quantity, nationId) => { },
    removeFromRegion: (quantity, nationId, regionId) => this.regionStore.removeNazgulFromRegion (quantity, regionId),
    addToRegion: (quantity, frontId, nationId, regionId) => this.regionStore.addNazgulToRegion (quantity, regionId),
  };

}

interface UnitUtil {
  addToReinforcements (quantity: number, nationId: WotrNationId): void;
  removeFromReinforcements (quantity: number, nationId: WotrNationId): void;
  addToCasualties (quantity: number, nationId: WotrNationId): void;
  removeFromCasualties (quantity: number, nationId: WotrNationId): void;
  removeFromRegion (quantity: number, nationId: WotrNationId, regionId: WotrRegionId): void;
  addToRegion (quantity: number, frontId: WotrFrontId, nationId: WotrNationId, regionId: WotrRegionId): void;
}
