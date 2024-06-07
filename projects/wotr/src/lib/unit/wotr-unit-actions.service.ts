import { Injectable, inject } from "@angular/core";
import { WotrBattleFlowService } from "../battle/wotr-battle-flow.service";
import { WotrBattleStore } from "../battle/wotr-battle.store";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrArmyUnitType, WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrUnitAction, WotrUnits } from "./wotr-unit-actions";

@Injectable ()
export class WotrUnitActionsService {

  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private battleStore = inject (WotrBattleStore);

  private battleFlow = inject (WotrBattleFlowService);

  getActionAppliers (): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movement": async (action, front) => {
        const fromRegion = this.regionStore.region (action.fromRegion);
        const army = action.army || fromRegion.units;
        this.moveArmy (army, action.fromRegion, action.toRegion);
        const region = this.regionStore.region (action.toRegion);
        if (region.nationId) {
          const nationOfRegion = this.nationStore.nation (region.nationId);
          if (!nationOfRegion.active && nationOfRegion.front !== front) {
            this.nationStore.setActive (true, region.nationId);
          }
        }
      },
      "army-unit-elimination": async (action, front) => {
        const unitUtil = this.unitUtil (action.unitType);
        const frontId = frontOfNation (action.nation);
        unitUtil.removeFromRegion (action.quantity, action.nation, action.region);
        switch (frontId) {
          case "free-peoples": unitUtil.addToCasualties (action.quantity, action.nation); break;
          case "shadow": unitUtil.addToReinforcements (action.quantity, action.nation); break;
        }
      },
      "army-unit-recruitment": async (action, front) => {
        const unitUtil = this.unitUtil (action.unitType);
        const frontId = frontOfNation (action.nation);
        unitUtil.removeFromReinforcements (action.quantity, action.nation);
        unitUtil.addToRegion (action.quantity, frontId, action.nation, action.region);
      },
      "leader-elimination": async (action, front) => {
        this.regionStore.removeLeadersFromRegion (action.nation, action.quantity, action.region);
        this.nationStore.addLeadersToCasualties (action.quantity, action.nation);
      },
      "leader-recruitment": async (action, front) => {
        this.nationStore.removeLeadersFromReinforcements (action.quantity, action.nation);
        this.regionStore.addLeadersToRegion (action.nation, action.quantity, action.region);
      },
      "nazgul-elimination": async (action, front) => {
        this.regionStore.removeNazgulFromRegion (action.quantity, action.region);
        this.nationStore.addNazgulToReinforcements (action.quantity);
      },
      "nazgul-recruitment": async (action, front) => {
        this.nationStore.removeNazgulFromReinforcements (action.quantity);
        this.regionStore.addNazgulToRegion (action.quantity, action.region);
      },
    };
  }

  moveArmy (army: WotrUnits, fromRegion: WotrRegionId, toRegion: WotrRegionId) {
    if (army.characters) {
      for (const character of army.characters) {
        this.regionStore.removeCharacterFromRegion (character, fromRegion);
        this.regionStore.addCharacterToRegion (character, toRegion);
      }
    }
    if (army.leaders) {
      for (const leader of army.leaders) {
        this.regionStore.removeLeadersFromRegion (leader.nation, leader.quantity, fromRegion);
        this.regionStore.addLeadersToRegion (leader.nation, leader.quantity, toRegion);
      }
    }
    if (army.nNazgul) {
      this.regionStore.removeNazgulFromRegion (army.nNazgul, fromRegion);
      this.regionStore.addNazgulToRegion (army.nNazgul, toRegion);
    }
    if (army.armyUnits) {
      for (const unit of army.armyUnits) {
        const unitUtil = this.unitUtil (unit.type);
        const frontId = frontOfNation (unit.nation);
        unitUtil.removeFromRegion (unit.quantity, unit.nation, fromRegion);
        unitUtil.addToRegion (unit.quantity, frontId, unit.nation, toRegion);
      }
    }
  }

  private unitUtil (unitType: WotrArmyUnitType) {
    switch (unitType) {
      case "regular": return this.regularUnitUtil;
      case "elite": return this.eliteUnitUtil;
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

}

interface UnitUtil {
  addToReinforcements (quantity: number, nationId: WotrNationId): void;
  removeFromReinforcements (quantity: number, nationId: WotrNationId): void;
  addToCasualties (quantity: number, nationId: WotrNationId): void;
  removeFromCasualties (quantity: number, nationId: WotrNationId): void;
  removeFromRegion (quantity: number, nationId: WotrNationId, regionId: WotrRegionId): void;
  addToRegion (quantity: number, frontId: WotrFrontId, nationId: WotrNationId, regionId: WotrRegionId): void;
}
