import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrCharacterStore } from "../companion/wotr-character.store";
import { WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtil } from "./wotr-army-util.service";
import { WotrUnitAction } from "./wotr-unit-actions";

@Injectable ()
export class WotrUnitActionsService {

  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private characterStore = inject (WotrCharacterStore);
  private armyUtil = inject (WotrArmyUtil);

  getActionAppliers (): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movement": async (action, front) => {
        this.regionStore.moveArmy (action.fromRegion, action.toRegion, action.leftUnits);
        const region = this.regionStore.region (action.toRegion);
        if (region.nationId) {
          const nationOfRegion = this.nationStore.nation (region.nationId);
          if (!nationOfRegion.active && nationOfRegion.front !== front) {
            this.nationStore.setActive (true, region.nationId);
          }
        }
      },
      "nazgul-movement": async (action, front) => {
        const fromRegion = this.regionStore.region (action.fromRegion);
        this.removeNazgulFromRegion (action.nNazgul, fromRegion);
        const toRegion = this.regionStore.region (action.toRegion);
        this.addNazgulToRegion (action.nNazgul, toRegion);
      },
      "regular-unit-recruitment": async (action, front) => {
        const region = this.regionStore.region (action.region);
        this.nationStore.removeRegularsFromReinforcements (action.quantity, action.nation);
        this.addRegularsToRegion (action.quantity, action.nation, region);
      },
      "regular-unit-elimination": async (action, front) => {
        const region = this.regionStore.region (action.region);
        const frontId = frontOfNation (action.nation);
        this.removeRegularsFromRegion (action.quantity, action.nation, region);
        switch (frontId) {
          case "free-peoples": this.nationStore.addRegularsToCasualties (action.quantity, action.nation); break;
          case "shadow": this.nationStore.addRegularsToReinforcements (action.quantity, action.nation); break;
        }
      },
      "elite-unit-recruitment": async (action, front) => {
        const region = this.regionStore.region (action.region);
        this.nationStore.removeElitesFromReinforcements (action.quantity, action.nation);
        this.addElitesToRegion (action.quantity, action.nation, region);
      },
      "elite-unit-elimination": async (action, front) => {
        const region = this.regionStore.region (action.region);
        const frontId = frontOfNation (action.nation);
        this.removeElitesFromRegion (action.quantity, action.nation, region);
        switch (frontId) {
          case "free-peoples": this.nationStore.addElitesToCasualties (action.quantity, action.nation); break;
          case "shadow": this.nationStore.addElitesToReinforcements (action.quantity, action.nation); break;
        }
      },
      "leader-recruitment": async (action, front) => {
        const region = this.regionStore.region (action.region);
        this.nationStore.removeLeadersFromReinforcements (action.quantity, action.nation);
        this.addLeadersToRegion (action.quantity, action.nation, region);
      },
      "leader-elimination": async (action, front) => {
        const region = this.regionStore.region (action.region);
        this.removeLeadersFromRegion (action.quantity, action.nation, region);
        this.nationStore.addLeadersToCasualties (action.quantity, action.nation);
      },
      "nazgul-recruitment": async (action, front) => {
        const region = this.regionStore.region (action.region);
        this.nationStore.removeNazgulFromReinforcements (action.quantity);
        this.addNazgulToRegion (action.quantity, region);
      },
      "nazgul-elimination": async (action, front) => {
        const region = this.regionStore.region (action.region);
        this.removeNazgulFromRegion (action.quantity, region);
        this.nationStore.addNazgulToReinforcements (action.quantity);
      },
    };
  }

  private addRegularsToRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.addRegularsToArmy (quantity, nation, [region.id, "underSiege"]);
    } else {
      this.regionStore.addRegularsToArmy (quantity, nation, region.id);
    }
  }

  private removeRegularsFromRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.removeRegularsFromArmy (quantity, nation, [region.id, "underSiege"]);
    } else {
      this.regionStore.removeRegularsFromArmy (quantity, nation, region.id);
    }
  }

  private addElitesToRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.addElitesToArmy (quantity, nation, [region.id, "underSiege"]);
    } else {
      this.regionStore.addElitesToArmy (quantity, nation, region.id);
    }
  }

  private removeElitesFromRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.removeElitesFromArmy (quantity, nation, [region.id, "underSiege"]);
    } else {
      this.regionStore.removeElitesFromArmy (quantity, nation, region.id);
    }
  }

  private addLeadersToRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.addLeadersToArmy (quantity, nation, [region.id, "underSiege"]);
    } else {
      this.regionStore.addLeadersToArmy (quantity, nation, region.id);
    }
  }

  private removeLeadersFromRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.removeLeadersFromArmy (quantity, nation, [region.id, "underSiege"]);
    } else {
      this.regionStore.removeLeadersFromArmy (quantity, nation, region.id);
    }
  }

  private addNazgulToRegion (quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.addNazgulToArmy (quantity, [region.id, "underSiege"]);
    } else if (region.army?.front === "shadow") {
      this.regionStore.addNazgulToArmy (quantity, region.id);
    } else {
      this.regionStore.addNazgulToFreeUnits (quantity, region.id);
    }
  }

  private removeNazgulFromRegion (quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.removeNazgulFromArmy (quantity, [region.id, "underSiege"]);
    } else if (region.army?.front === "shadow") {
      this.regionStore.removeNazgulFromArmy (quantity, region.id);
    } else {
      this.regionStore.removeNazgulFromFreeUnits (quantity, region.id);
    }
  }

}
