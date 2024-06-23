import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationService } from "../nation/wotr-nation.service";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrUnitAction } from "./wotr-unit-actions";

@Injectable ()
export class WotrUnitService {
  
  private actionService = inject (WotrActionService);
  private nationStore = inject (WotrNationStore);
  private nationService = inject (WotrNationService);
  private regionStore = inject (WotrRegionStore);

  init () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  getActionAppliers (): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movement": async (action, front) => {
        this.regionStore.moveArmy (action.fromRegion, action.toRegion, action.leftUnits);
        this.nationService.checkNationActivationByArmyMovement (action.toRegion, front);
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
      this.regionStore.addRegularsToArmyUnderSiege (quantity, nation, region.id);
    } else {
      this.regionStore.addRegularsToArmy (quantity, nation, region.id);
    }
  }

  private removeRegularsFromRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.removeRegularsFromArmyUnderSiege (quantity, nation, region.id);
    } else {
      this.regionStore.removeRegularsFromArmy (quantity, nation, region.id);
    }
  }

  private addElitesToRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.addElitesToArmyUnderSiege (quantity, nation, region.id);
    } else {
      this.regionStore.addElitesToArmy (quantity, nation, region.id);
    }
  }

  private removeElitesFromRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.removeElitesFromArmyUnderSiege (quantity, nation, region.id);
    } else {
      this.regionStore.removeElitesFromArmy (quantity, nation, region.id);
    }
  }

  private addLeadersToRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.addLeadersToArmyUnderSiege (quantity, nation, region.id);
    } else {
      this.regionStore.addLeadersToArmy (quantity, nation, region.id);
    }
  }

  private removeLeadersFromRegion (quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation (nation)) {
      this.regionStore.removeLeadersFromArmyUnderSiege (quantity, nation, region.id);
    } else {
      this.regionStore.removeLeadersFromArmy (quantity, nation, region.id);
    }
  }

  private addNazgulToRegion (quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.addNazgulToArmyUnderSiege (quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.addNazgulToArmy (quantity, region.id);
    } else {
      this.regionStore.addNazgulToFreeUnits (quantity, region.id);
    }
  }

  private removeNazgulFromRegion (quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.removeNazgulFromArmyUnderSiege (quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.removeNazgulFromArmy (quantity, region.id);
    } else {
      this.regionStore.removeNazgulFromFreeUnits (quantity, region.id);
    }
  }

  getActionLoggers (): WotrActionLoggerMap<WotrUnitAction> {
    return {
      "army-movement": (action, front, f) => [f.player (front), " army moves from ", f.region (action.fromRegion), " to ", f.region (action.toRegion)],
      "regular-unit-elimination": (action, front, f) => [f.player (front), " removes regular units from ", f.region (action.region)],
      "regular-unit-recruitment": (action, front, f) => [f.player (front), " recruits regular units in ", f.region (action.region)],
      "elite-unit-elimination": (action, front, f) => [f.player (front), " removes elite units from ", f.region (action.region)],
      "elite-unit-recruitment": (action, front, f) => [f.player (front), " recruits elite units in ", f.region (action.region)],
      "leader-elimination": (action, front, f) => [f.player (front), " removes leaders from ", f.region (action.region)],
      "leader-recruitment": (action, front, f) => [f.player (front), " recruits leaders in ", f.region (action.region)],
      "nazgul-elimination": (action, front, f) => [f.player (front), " removes nazgul from ", f.region (action.region)],
      "nazgul-recruitment": (action, front, f) => [f.player (front), " recruits nazgul in ", f.region (action.region)],
      "nazgul-movement": (action, front, f) => [f.player (front), ` moves ${action.nNazgul} Nazgul from `, f.region (action.fromRegion), " to ", f.region (action.toRegion)],
    };
  }

}
