import { Injectable, inject } from "@angular/core";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterElimination } from "../character/wotr-character-actions";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontId } from "../front/wotr-front-models";
import { filterActions } from "../game/wotr-story-models";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrGenericUnitType, WotrNationId, frontOfNation } from "../nation/wotr-nation-models";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrPlayer } from "../player/wotr-player";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  WotrArmyMovement,
  WotrEliteUnitDowngrade,
  WotrEliteUnitElimination,
  WotrLeaderElimination,
  WotrNazgulElimination,
  WotrNazgulMovement,
  WotrRegularUnitElimination,
  WotrUnitAction
} from "./wotr-unit-actions";
import { WotrArmy } from "./wotr-unit-models";
import { WotrUnitUtils } from "./wotr-unit-utils";

export interface WotrRecruitmentConstraints {
  points: number;
  exludedRegions: Set<WotrRegionId>;
}

@Injectable({ providedIn: "root" })
export class WotrUnitHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationStore = inject(WotrNationStore);
  private nationHandler = inject(WotrNationHandler);
  private regionStore = inject(WotrRegionStore);
  private unitUtils = inject(WotrUnitUtils);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movement": (action, front) => this.moveArmy(action, front),
      "nazgul-movement": (action, front) => this.moveNazgul(action),
      "regular-unit-recruitment": (action, front) =>
        this.recruitRegularUnit(action.quantity, action.nation, action.region),
      "regular-unit-elimination": (action, front) =>
        this.eliminateRegularUnit(action.quantity, action.nation, action.region),
      "regular-unit-upgrade": (action, front) => {
        this.recruitEliteUnit(action.quantity, action.nation, action.region);
        this.eliminateRegularUnit(action.quantity, action.nation, action.region);
      },
      "regular-unit-disband": (action, front) =>
        this.disbandRegularUnit(action.quantity, action.nation, action.region),
      "elite-unit-recruitment": (action, front) =>
        this.recruitEliteUnit(action.quantity, action.nation, action.region),
      "elite-unit-elimination": (action, front) =>
        this.eliminateEliteUnit(action.quantity, action.nation, action.region),
      "elite-unit-downgrade": (action, front) => {
        this.eliminateEliteUnit(action.quantity, action.nation, action.region);
        this.recruitRegularUnit(action.quantity, action.nation, action.region);
      },
      "elite-unit-disband": (action, front) =>
        this.disbandEliteUnit(action.quantity, action.nation, action.region),
      "leader-recruitment": (action, front) =>
        this.recruitLeader(action.quantity, action.nation, action.region),
      "leader-elimination": (action, front) =>
        this.eliminateLeader(action.quantity, action.nation, action.region),
      "nazgul-recruitment": (action, front) => this.recruitNazgul(action.quantity, action.region),
      "nazgul-elimination": (action, front) => this.eliminateNazgul(action.quantity, action.region)
    };
  }

  moveNazgul(action: WotrNazgulMovement) {
    this.removeNazgulFromRegion(action.nNazgul, action.fromRegion);
    this.addNazgulToRegion(action.nNazgul, action.toRegion);
  }

  moveArmy(movement: WotrArmyMovement, frontId: WotrFrontId) {
    this.regionStore.moveArmy(movement.fromRegion, movement.toRegion, movement.leftUnits);
    this.nationHandler.checkNationActivationByArmyMovement(movement.toRegion, frontId);
    const toRegion = this.regionStore.region(movement.toRegion);
    if (toRegion.settlement && toRegion.controlledBy !== frontId && !toRegion.underSiegeArmy) {
      this.regionStore.setControlledBy(frontId, movement.toRegion);
    }
  }

  recruitNazgul(quantity: number, regionId: WotrRegionId) {
    this.nationStore.removeNazgulFromReinforcements(quantity);
    this.addNazgulToRegion(quantity, regionId);
  }

  recruitLeader(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    this.nationStore.removeLeadersFromReinforcements(quantity, nationId);
    this.addLeadersToRegion(quantity, nationId, region);
  }

  recruitEliteUnit(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    this.nationStore.removeElitesFromReinforcements(quantity, nationId);
    this.addElitesToRegion(quantity, nationId, region);
  }

  eliminateEliteUnit(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    const frontId = frontOfNation(nationId);
    this.removeElitesFromRegion(quantity, nationId, region);
    switch (frontId) {
      case "free-peoples":
        this.nationStore.addElitesToCasualties(quantity, nationId);
        break;
      case "shadow":
        this.nationStore.addElitesToReinforcements(quantity, nationId);
        break;
    }
  }

  disbandEliteUnit(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    this.removeElitesFromRegion(quantity, nationId, region);
    this.nationStore.addElitesToReinforcements(quantity, nationId);
  }

  recruitRegularUnit(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    this.nationStore.removeRegularsFromReinforcements(quantity, nationId);
    this.addRegularsToRegion(quantity, nationId, region);
  }

  eliminateRegularUnit(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    const frontId = frontOfNation(nationId);
    this.removeRegularsFromRegion(quantity, nationId, region);
    switch (frontId) {
      case "free-peoples":
        this.nationStore.addRegularsToCasualties(quantity, nationId);
        break;
      case "shadow":
        this.nationStore.addRegularsToReinforcements(quantity, nationId);
        break;
    }
  }

  disbandRegularUnit(quantity: number, nationId: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    this.removeRegularsFromRegion(quantity, nationId, region);
    this.nationStore.addRegularsToReinforcements(quantity, nationId);
  }

  private addRegularsToRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.addRegularsToArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.addRegularsToArmy(quantity, nation, region.id);
    }
  }

  private removeRegularsFromRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeRegularsFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeRegularsFromArmy(quantity, nation, region.id);
    }
  }

  private addElitesToRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.addElitesToArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.addElitesToArmy(quantity, nation, region.id);
    }
  }

  private removeElitesFromRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeElitesFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeElitesFromArmy(quantity, nation, region.id);
    }
  }

  private addLeadersToRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.addLeadersToArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.addLeadersToArmy(quantity, nation, region.id);
    }
  }

  eliminateLeader(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    this.removeLeadersFromRegion(quantity, nation, regionId);
    this.nationStore.addLeadersToCasualties(quantity, nation);
  }

  eliminateNazgul(quantity: number, regionId: WotrRegionId) {
    this.removeNazgulFromRegion(quantity, regionId);
    this.nationStore.addNazgulToReinforcements(quantity);
  }

  private removeLeadersFromRegion(quantity: number, nation: WotrNationId, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeLeadersFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeLeadersFromArmy(quantity, nation, region.id);
    }
  }

  private addNazgulToRegion(quantity: number, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.addNazgulToArmyUnderSiege(quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.addNazgulToArmy(quantity, region.id);
    } else {
      this.regionStore.addNazgulToFreeUnits(quantity, region.id);
    }
  }

  private removeNazgulFromRegion(quantity: number, regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.removeNazgulFromArmyUnderSiege(quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.removeNazgulFromArmy(quantity, region.id);
    } else {
      this.regionStore.removeNazgulFromFreeUnits(quantity, region.id);
    }
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrUnitAction> {
    return {
      "army-movement": (action, front, f) => {
        const logs = [
          f.player(front),
          " moves one army from ",
          f.region(action.fromRegion),
          " to ",
          f.region(action.toRegion)
        ];
        return logs;
      },
      "regular-unit-elimination": (action, front, f) => [
        f.player(front),
        " removes regular units from ",
        f.region(action.region)
      ],
      "regular-unit-recruitment": (action, front, f) => [
        f.player(front),
        ` recruits ${this.logUnit(action.quantity, "regular")} in `,
        f.region(action.region)
      ],
      "regular-unit-upgrade": (action, front, f) => [
        f.player(front),
        ` upgrades ${this.logUnit(action.quantity, "regular")} in `,
        f.region(action.region)
      ],
      "regular-unit-disband": (action, front, f) => [
        f.player(front),
        ` disbands ${this.logUnit(action.quantity, "regular")} in `,
        f.region(action.region)
      ],
      "elite-unit-elimination": (action, front, f) => [
        f.player(front),
        ` removes ${this.logUnit(action.quantity, "elite")} from `,
        f.region(action.region)
      ],
      "elite-unit-recruitment": (action, front, f) => [
        f.player(front),
        ` recruits ${this.logUnit(action.quantity, "elite")} in `,
        f.region(action.region)
      ],
      "elite-unit-downgrade": (action, front, f) => [
        f.player(front),
        ` downgrades ${this.logUnit(action.quantity, "elite")} in `,
        f.region(action.region)
      ],
      "elite-unit-disband": (action, front, f) => [
        f.player(front),
        ` disbands ${this.logUnit(action.quantity, "elite")} in `,
        f.region(action.region)
      ],
      "leader-elimination": (action, front, f) => [
        f.player(front),
        ` removes ${this.logUnit(action.quantity, "leader")} from `,
        f.region(action.region)
      ],
      "leader-recruitment": (action, front, f) => [
        f.player(front),
        ` recruits ${this.logUnit(action.quantity, "leader")} in `,
        f.region(action.region)
      ],
      "nazgul-elimination": (action, front, f) => [
        f.player(front),
        ` removes ${this.logUnit(action.quantity, "nazgul")} from `,
        f.region(action.region)
      ],
      "nazgul-recruitment": (action, front, f) => [
        f.player(front),
        ` recruits ${this.logUnit(action.quantity, "nazgul")} in `,
        f.region(action.region)
      ],
      "nazgul-movement": (action, front, f) => [
        f.player(front),
        ` moves ${this.logUnit(action.nNazgul, "nazgul")} from `,
        f.region(action.fromRegion),
        " to ",
        f.region(action.toRegion)
      ]
    };
  }

  private logUnit(quantity: number, unitType: WotrGenericUnitType) {
    switch (unitType) {
      case "regular":
        return `${quantity} regular unit${quantity > 1 ? "s" : ""}`;
      case "elite":
        return `${quantity} elite unit${quantity > 1 ? "s" : ""}`;
      case "leader":
        return `${quantity} leader${quantity > 1 ? "s" : ""}`;
      case "nazgul":
        return `${quantity} Nazgul`;
      default:
        return "";
    }
  }

  async chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    player: WotrPlayer
  ) {
    const region = this.regionStore.region(regionId);
    const underSiege = region.underSiegeArmy?.front === player.frontId;
    const army = underSiege ? region.underSiegeArmy! : region.army!;
    return this.chooseArmyCasualties(hitPoints, army, regionId, cardId, player);
  }

  async chooseArmyCasualties(
    nTotalHits: number | 0,
    army: WotrArmy,
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    player: WotrPlayer
  ) {
    if (!nTotalHits) return null;
    const nHits = this.unitUtils.nHits(army);
    if (nTotalHits < nHits) {
      const story = await player.chooseCasualties(nTotalHits, regionId, cardId);
      const actions = filterActions<
        WotrRegularUnitElimination | WotrEliteUnitElimination | WotrEliteUnitDowngrade
      >(story, "regular-unit-elimination", "elite-unit-elimination", "elite-unit-downgrade");
      return actions;
    } else {
      const story = await player.eliminateArmy(regionId, cardId);
      const actions = filterActions<
        | WotrRegularUnitElimination
        | WotrEliteUnitElimination
        | WotrLeaderElimination
        | WotrNazgulElimination
        | WotrCharacterElimination
      >(
        story,
        "regular-unit-elimination",
        "elite-unit-elimination",
        "leader-elimination",
        "nazgul-elimination",
        "character-elimination"
      );
      return actions;
    }
  }
}
