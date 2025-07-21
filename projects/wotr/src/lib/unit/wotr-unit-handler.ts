import { Injectable, inject } from "@angular/core";
import { WotrCharacterElimination } from "../character/wotr-character-actions";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { filterActions } from "../game/wotr-story.models";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrNationStore } from "../nation/wotr-nation.store";
import { WotrPlayer } from "../player/wotr-player";
import { WotrRegion, WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import {
  WotrArmyMovement,
  WotrEliteUnitDisband,
  WotrEliteUnitDowngrade,
  WotrEliteUnitElimination,
  WotrEliteUnitRecruitment,
  WotrLeaderElimination,
  WotrLeaderRecruitment,
  WotrNazgulElimination,
  WotrNazgulMovement,
  WotrNazgulRecruitment,
  WotrRegularUnitDisband,
  WotrRegularUnitElimination,
  WotrRegularUnitRecruitment,
  WotrUnitAction
} from "./wotr-unit-actions";
import { WotrUnitUtils } from "./wotr-unit-utils";
import { WotrArmy } from "./wotr-unit.models";

export interface WotrRecruitmentConstraints {
  points: number;
  exludedRegions: Set<WotrRegionId>;
}

@Injectable({ providedIn: "root" })
export class WotrUnitHandler {
  private actionService = inject(WotrActionService);
  private nationStore = inject(WotrNationStore);
  private nationHandler = inject(WotrNationHandler);
  private regionStore = inject(WotrRegionStore);
  private unitUtils = inject(WotrUnitUtils);

  init() {
    this.actionService.registerActions(this.getActionAppliers() as any);
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrUnitAction> {
    return {
      "army-movements": async (action, front) => {
        for (const movement of action.movements) {
          this.moveArmy(movement, front);
        }
      },
      "nazgul-movement": async (action, front) => {
        this.moveNazgul(action);
      },
      "regular-unit-recruitment": async (action, front) => this.recruitRegularUnit(action),
      "regular-unit-elimination": async (action, front) => this.eliminateRegularUnit(action),
      "regular-unit-upgrade": async (action, front) => {
        this.recruitEliteUnit({
          type: "elite-unit-recruitment",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
        this.eliminateRegularUnit({
          type: "regular-unit-elimination",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
      },
      "regular-unit-disband": async (action, front) => this.disbandRegularUnit(action),
      "elite-unit-recruitment": async (action, front) => this.recruitEliteUnit(action),
      "elite-unit-elimination": async (action, front) => this.eliminateEliteUnit(action),
      "elite-unit-downgrade": async (action, front) => {
        this.eliminateEliteUnit({
          type: "elite-unit-elimination",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
        this.recruitRegularUnit({
          type: "regular-unit-recruitment",
          region: action.region,
          quantity: action.quantity,
          nation: action.nation
        });
      },
      "elite-unit-disband": async (action, front) => this.disbandEliteUnit(action),
      "leader-recruitment": async (action, front) => this.recruitLeader(action),
      "leader-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.removeLeadersFromRegion(action.quantity, action.nation, region);
        this.nationStore.addLeadersToCasualties(action.quantity, action.nation);
      },
      "nazgul-recruitment": async (action, front) => this.recruitNazgul(action),
      "nazgul-elimination": async (action, front) => {
        const region = this.regionStore.region(action.region);
        this.removeNazgulFromRegion(action.quantity, region);
        this.nationStore.addNazgulToReinforcements(action.quantity);
      }
    };
  }

  moveNazgul(action: WotrNazgulMovement) {
    const fromRegion = this.regionStore.region(action.fromRegion);
    this.removeNazgulFromRegion(action.nNazgul, fromRegion);
    const toRegion = this.regionStore.region(action.toRegion);
    this.addNazgulToRegion(action.nNazgul, toRegion);
  }

  moveArmy(movement: WotrArmyMovement, frontId: WotrFrontId) {
    this.regionStore.moveArmy(movement.fromRegion, movement.toRegion, movement.leftUnits);
    this.nationHandler.checkNationActivationByArmyMovement(movement.toRegion, frontId);
  }

  recruitNazgul(action: WotrNazgulRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeNazgulFromReinforcements(action.quantity);
    this.addNazgulToRegion(action.quantity, region);
  }

  recruitLeader(action: WotrLeaderRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeLeadersFromReinforcements(action.quantity, action.nation);
    this.addLeadersToRegion(action.quantity, action.nation, region);
  }

  recruitEliteUnit(action: WotrEliteUnitRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeElitesFromReinforcements(action.quantity, action.nation);
    this.addElitesToRegion(action.quantity, action.nation, region);
  }

  eliminateEliteUnit(action: WotrEliteUnitElimination) {
    const region = this.regionStore.region(action.region);
    const frontId = frontOfNation(action.nation);
    this.removeElitesFromRegion(action.quantity, action.nation, region);
    switch (frontId) {
      case "free-peoples":
        this.nationStore.addElitesToCasualties(action.quantity, action.nation);
        break;
      case "shadow":
        this.nationStore.addElitesToReinforcements(action.quantity, action.nation);
        break;
    }
  }

  disbandEliteUnit(action: WotrEliteUnitDisband) {
    const region = this.regionStore.region(action.region);
    this.removeElitesFromRegion(action.quantity, action.nation, region);
    this.nationStore.addElitesToReinforcements(action.quantity, action.nation);
  }

  recruitRegularUnit(action: WotrRegularUnitRecruitment) {
    const region = this.regionStore.region(action.region);
    this.nationStore.removeRegularsFromReinforcements(action.quantity, action.nation);
    this.addRegularsToRegion(action.quantity, action.nation, region);
  }

  eliminateRegularUnit(action: WotrRegularUnitElimination) {
    const region = this.regionStore.region(action.region);
    const frontId = frontOfNation(action.nation);
    this.removeRegularsFromRegion(action.quantity, action.nation, region);
    switch (frontId) {
      case "free-peoples":
        this.nationStore.addRegularsToCasualties(action.quantity, action.nation);
        break;
      case "shadow":
        this.nationStore.addRegularsToReinforcements(action.quantity, action.nation);
        break;
    }
  }

  disbandRegularUnit(action: WotrRegularUnitDisband) {
    const region = this.regionStore.region(action.region);
    this.removeRegularsFromRegion(action.quantity, action.nation, region);
    this.nationStore.addRegularsToReinforcements(action.quantity, action.nation);
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

  private removeLeadersFromRegion(quantity: number, nation: WotrNationId, region: WotrRegion) {
    if (region.underSiegeArmy?.front === frontOfNation(nation)) {
      this.regionStore.removeLeadersFromArmyUnderSiege(quantity, nation, region.id);
    } else {
      this.regionStore.removeLeadersFromArmy(quantity, nation, region.id);
    }
  }

  private addNazgulToRegion(quantity: number, region: WotrRegion) {
    if (region.underSiegeArmy?.front === "shadow") {
      this.regionStore.addNazgulToArmyUnderSiege(quantity, region.id);
    } else if (region.army?.front === "shadow") {
      this.regionStore.addNazgulToArmy(quantity, region.id);
    } else {
      this.regionStore.addNazgulToFreeUnits(quantity, region.id);
    }
  }

  private removeNazgulFromRegion(quantity: number, region: WotrRegion) {
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
      "army-movements": (action, front, f) => {
        const firstMovement = action.movements[0];
        const logs = [
          f.player(front),
          " moves one army from ",
          f.region(firstMovement.fromRegion),
          " to ",
          f.region(firstMovement.toRegion)
        ];
        for (let i = 1; i < action.movements.length; i++) {
          logs.splice(
            logs.length,
            0,
            " and one army from ",
            f.region(firstMovement.fromRegion),
            " to ",
            f.region(firstMovement.toRegion)
          );
        }
        return logs;
      },
      "regular-unit-elimination": (action, front, f) => [
        f.player(front),
        " removes regular units from ",
        f.region(action.region)
      ],
      "regular-unit-recruitment": (action, front, f) => [
        f.player(front),
        " recruits regular units in ",
        f.region(action.region)
      ],
      "regular-unit-upgrade": (action, front, f) => [
        f.player(front),
        " upgrades regular units in ",
        f.region(action.region)
      ],
      "regular-unit-disband": (action, front, f) => [
        f.player(front),
        " disbands regular units in ",
        f.region(action.region)
      ],
      "elite-unit-elimination": (action, front, f) => [
        f.player(front),
        " removes elite units from ",
        f.region(action.region)
      ],
      "elite-unit-recruitment": (action, front, f) => [
        f.player(front),
        " recruits elite units in ",
        f.region(action.region)
      ],
      "elite-unit-downgrade": (action, front, f) => [
        f.player(front),
        " downgrades elite units in ",
        f.region(action.region)
      ],
      "elite-unit-disband": (action, front, f) => [
        f.player(front),
        " disbands elite units in ",
        f.region(action.region)
      ],
      "leader-elimination": (action, front, f) => [
        f.player(front),
        " removes leaders from ",
        f.region(action.region)
      ],
      "leader-recruitment": (action, front, f) => [
        f.player(front),
        " recruits leaders in ",
        f.region(action.region)
      ],
      "nazgul-elimination": (action, front, f) => [
        f.player(front),
        " removes Nazgul from ",
        f.region(action.region)
      ],
      "nazgul-recruitment": (action, front, f) => [
        f.player(front),
        " recruits Nazgul in ",
        f.region(action.region)
      ],
      "nazgul-movement": (action, front, f) => [
        f.player(front),
        ` moves ${action.nNazgul} Nazgul from `,
        f.region(action.fromRegion),
        " to ",
        f.region(action.toRegion)
      ]
    };
  }

  async chooseCasualties(hitPoints: number, regionId: WotrRegionId, player: WotrPlayer) {
    const region = this.regionStore.region(regionId);
    const underSiege = region.underSiegeArmy?.front === player.frontId;
    const army = underSiege ? region.underSiegeArmy! : region.army!;
    return this.chooseFrontCasualties(player, hitPoints, army, regionId, underSiege);
  }

  async chooseFrontCasualties(
    player: WotrPlayer,
    nTotalHits: number | 0,
    army: WotrArmy,
    regionId: WotrRegionId,
    underSiege: boolean
  ) {
    if (!nTotalHits) return null;
    const nHits = this.unitUtils.nHits(army);
    if (nTotalHits < nHits) {
      const story = await player.chooseCasualties(nTotalHits);
      const actions = filterActions<
        WotrRegularUnitElimination | WotrEliteUnitElimination | WotrEliteUnitDowngrade
      >(story, "regular-unit-elimination", "elite-unit-elimination", "elite-unit-downgrade");
      return actions;
    } else {
      const story = await player.eliminateArmy();
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
