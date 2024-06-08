import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action-applier";
import { WotrCharacterStore } from "../companion/wotr-character.store";
import { WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrRegion, WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrUnitAction } from "./wotr-unit-actions";
import { WotrArmy } from "./wotr-unit.models";

@Injectable ()
export class WotrUnitActionsService {

  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private characterStore = inject (WotrCharacterStore);

  getActionAppliers (): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movement": async (action, front) => {
        const fromRegion = this.regionStore.region (action.fromRegion);
        const army = action.army || fromRegion.army!;
        this.moveArmy (army, action.fromRegion, action.toRegion);
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
        this.joinNazgulToArmy (action.region);
        this.joinCharactersToArmy (action.region);
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
        this.joinNazgulToArmy (action.region);
        this.joinCharactersToArmy (action.region);
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

  private joinNazgulToArmy (regionId: WotrRegionId) {
    const region = this.regionStore.region (regionId);
    if (region.army?.front === "shadow") {
      const nNazgul = region.freeUnits?.nNazgul;
      if (nNazgul) {
        this.regionStore.removeNazgulFromFreeUnits (nNazgul, regionId);
        this.regionStore.addNazgulToArmy (nNazgul, regionId);
      }
    }
  }

  private joinCharactersToArmy (regionId: WotrRegionId) {
    const region = this.regionStore.region (regionId);
    if (!region.army?.front) { return; }
    const characters = region.freeUnits?.characters;
    characters?.forEach (characterId => {
      const character = this.characterStore.character (characterId);
      if (character.front === region.army?.front) {
        this.regionStore.removeCharacterFromFreeUnits (characterId, regionId);
        this.regionStore.addCharacterToArmy (characterId, regionId);
      }
    });
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

  moveArmy (army: WotrArmy, fromRegion: WotrRegionId, toRegion: WotrRegionId) {
    if (army.regulars) {
      for (const unit of army.regulars) {
        this.regionStore.removeRegularsFromArmy (unit.quantity, unit.nation, fromRegion);
        this.regionStore.addRegularsToArmy (unit.quantity, unit.nation, toRegion);
      }
    }
    if (army.elites) {
      for (const unit of army.elites) {
        this.regionStore.removeElitesFromArmy (unit.quantity, unit.nation, fromRegion);
        this.regionStore.addElitesToArmy (unit.quantity, unit.nation, toRegion);
      }
    }
    if (army.leaders) {
      for (const leader of army.leaders) {
        this.regionStore.removeLeadersFromArmy (leader.quantity, leader.nation, fromRegion);
        this.regionStore.addLeadersToArmy (leader.quantity, leader.nation, toRegion);
      }
    }
    if (army.nNazgul) {
      this.regionStore.removeNazgulFromArmy (army.nNazgul, fromRegion);
      this.regionStore.addNazgulToArmy (army.nNazgul, toRegion);
    }
    if (army.characters) {
      for (const character of army.characters) {
        this.regionStore.removeCharacterFromArmy (character, fromRegion);
        this.regionStore.addCharacterToArmy (character, toRegion);
      }
    }
  }

}
