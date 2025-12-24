import { inject, Injectable } from "@angular/core";
import { attack, forfeitLeadership } from "../battle/wotr-battle-actions";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrReactionStory } from "../game/wotr-story-models";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionQuery } from "../region/wotr-region-query";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  disbandEliteUnit,
  disbandRegularUnit,
  eliminateEliteUnit,
  eliminateLeader,
  eliminateNazgul,
  eliminateRegularUnit,
  moveArmy,
  recruitEliteUnit,
  recruitLeader,
  recruitNazgul,
  recruitRegularUnit,
  WotrArmyMovement,
  WotrNazgulMovement,
  WotrRegularUnitRecruitment
} from "./wotr-unit-actions";
import { WotrRecruitmentConstraints, WotrUnitHandler } from "./wotr-unit-handler";
import {
  character,
  elite,
  leader,
  nazgul,
  WotrArmy,
  WotrEliminateUnitsParams,
  WotrForfeitLeadershipParams,
  WotrRegionUnitMatch,
  WotrRegionUnits,
  WotrReinforcementUnit,
  WotrUnitComposer
} from "./wotr-unit-models";
import { WotrUnitModifiers } from "./wotr-unit-modifiers";
import { WotrUnitRules } from "./wotr-unit-rules";
import { WotrUnitUtils } from "./wotr-unit-utils";

@Injectable({ providedIn: "root" })
export class WotrUnitUi {
  private ui = inject(WotrGameUi);
  private unitRules = inject(WotrUnitRules);
  private unitUtils = inject(WotrUnitUtils);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private unitHandler = inject(WotrUnitHandler);
  private unitModifiers = inject(WotrUnitModifiers);
  private q = inject(WotrGameQuery);

  async moveNazgulMinions(frontId: WotrFrontId): Promise<WotrNazgulMovement[]> {
    throw new Error("Method not implemented.");
  }

  async moveArmies(numberOfMoves: number, frontId: WotrFrontId): Promise<WotrArmyMovement[]> {
    let continueMoving = true;
    let doneMoves = 0;
    const movements: WotrArmyMovement[] = [];
    while (continueMoving) {
      const movement = await this.moveArmy(frontId);
      movements.push(movement);
      continueMoving = false;
      doneMoves++;
      if (doneMoves < numberOfMoves) {
        continueMoving = await this.ui.askConfirm(
          "Continue moving armies?",
          "Move another",
          "Stop moving"
        );
      }
    }
    return movements;
  }

  async moveArmy(frontId: WotrFrontId): Promise<WotrArmyMovement> {
    const candidateRegions = this.unitRules.armyMovementStartingRegions(frontId);
    const movingArmy = await this.ui.askRegionUnits("Select units to move", {
      regionIds: candidateRegions,
      type: "moveArmy",
      requiredUnits: [],
      retroguard: null,
      required: true
    });
    return this.moveThisArmy(movingArmy, frontId);
  }

  async attack(frontId: WotrFrontId): Promise<WotrAction[]> {
    const attackingUnits = await this.askAttackingUnits(frontId, false);
    return this.attackWithArmy(attackingUnits, frontId);
  }

  async attackStronghold(regionId: WotrRegionId, frontId: WotrFrontId): Promise<WotrAction[]> {
    const attackingUnits = await this.ui.askRegionUnits("Select units to attack", {
      type: "attack",
      regionIds: [regionId],
      requiredUnits: [],
      frontId
    });
    const fromRegion = this.regionStore.region(attackingUnits.regionId);
    const retroguard = this.unitUtils.splitUnits(fromRegion.army, attackingUnits);
    return [attack(regionId, regionId, retroguard)];
  }

  private async askAttackingUnits(
    frontId: WotrFrontId,
    withLeaders: boolean
  ): Promise<WotrRegionUnits> {
    const candidateRegions = withLeaders
      ? this.unitRules.attackWithLeadersStartingRegions(frontId)
      : this.unitRules.attackStartingRegions(frontId);
    return this.ui.askRegionUnits("Select units to attack", {
      type: "attack",
      regionIds: candidateRegions.map(region => region.id),
      requiredUnits: withLeaders ? ["anyLeader"] : [],
      frontId
    });
  }

  private async attackWithArmy(
    attackingUnits: WotrRegionUnits,
    frontId: WotrFrontId
  ): Promise<WotrAction[]> {
    const fromRegion = this.regionStore.region(attackingUnits.regionId);
    const fromArmy =
      fromRegion.army?.front === frontId ? fromRegion.army : fromRegion.underSiegeArmy!;
    const retroguard = this.unitUtils.splitUnits(fromArmy, attackingUnits);
    const targetRegions = this.unitRules.attackTargetRegions(fromRegion, frontId);
    const toRegionId = await this.ui.askRegion(
      "Select region to attack",
      targetRegions.map(region => region.id)
    );
    return [attack(fromRegion.id, toRegionId, retroguard)];
  }

  async attackWithLeader(frontId: WotrFrontId): Promise<WotrAction[]> {
    const attackingUnits = await this.askAttackingUnits(frontId, true);
    return this.attackWithArmy(attackingUnits, frontId);
  }

  private async moveThisArmy(
    movingArmy: WotrRegionUnits,
    frontId: WotrFrontId
  ): Promise<WotrArmyMovement> {
    const toRegionId = await this.ui.askRegion(
      "Select region to move in",
      this.unitRules.armyMovementTargetRegions(movingArmy, frontId)
    );
    return this.moveThisArmyTo(movingArmy, frontId, toRegionId);
  }

  async moveThisArmyTo(
    movingArmy: WotrRegionUnits,
    frontId: WotrFrontId,
    toRegionId: WotrRegionId
  ): Promise<WotrArmyMovement> {
    const fromRegion = this.regionStore.region(movingArmy.regionId);
    const leftUnits = this.unitUtils.splitUnits(fromRegion.army, movingArmy);
    const movement = moveArmy(movingArmy.regionId, toRegionId, leftUnits);
    this.unitHandler.moveArmy(movement, frontId);
    await this.checkStackingLimit(toRegionId, frontId);
    return movement;
  }

  async moveArmyWithLeader(frontId: WotrFrontId): Promise<WotrArmyMovement> {
    const candidateRegions = this.unitRules.armyWithLeaderMovementStartingRegions(frontId);
    const movingArmy = await this.ui.askRegionUnits("Select units to move", {
      regionIds: candidateRegions,
      type: "moveArmy",
      requiredUnits: ["anyLeader"],
      retroguard: null,
      required: true
    });
    return this.moveThisArmy(movingArmy, frontId);
  }

  async moveArmyWithCharacter(characterId: WotrCharacterId): Promise<WotrArmyMovement> {
    const c = this.q.character(characterId);
    const fromRegionId = c.region()!.id;
    const movingArmy = await this.ui.askRegionUnits("Select units to move", {
      regionIds: [fromRegionId],
      type: "moveArmy",
      requiredUnits: [characterId],
      retroguard: null,
      required: true
    });
    return this.moveThisArmy(movingArmy, c.frontId());
  }

  async attackWithCharacter(characterId: WotrCharacterId): Promise<WotrAction[]> {
    const c = this.q.character(characterId);
    const fromRegionId = c.region()!.id;
    const attackingUnits = await this.ui.askRegionUnits("Select units to attack", {
      type: "attack",
      regionIds: [fromRegionId],
      requiredUnits: [characterId],
      frontId: c.frontId()
    });
    return this.attackWithArmy(attackingUnits, c.frontId());
  }

  private async checkStackingLimit(
    regionId: WotrRegionId,
    frontId: WotrFrontId
  ): Promise<WotrAction[]> {
    const region = this.regionStore.region(regionId);
    if (region.army?.front === frontId) {
      return this.checkArmyStackingLimit(region.army, regionId, 10, false);
    }
    if (region.underSiegeArmy?.front === frontId) {
      return this.checkArmyStackingLimit(region.underSiegeArmy, regionId, 5, true);
    }
    return [];
  }

  private async checkArmyStackingLimit(
    army: WotrArmy,
    regionId: WotrRegionId,
    stackingLimit: number,
    underSiege: boolean
  ): Promise<WotrAction[]> {
    const nArmyUnits = this.unitUtils.nArmyUnits(army);
    if (nArmyUnits <= stackingLimit) return [];
    const units = await this.ui.askRegionUnits("Choose a unit to disband", {
      regionIds: [regionId],
      type: "disband",
      nArmyUnits: nArmyUnits - stackingLimit,
      underSiege
    });
    const actions: WotrAction[] = [];
    units.regulars?.forEach(unit => {
      actions.push(disbandRegularUnit(regionId, unit.nation, unit.quantity));
      this.unitHandler.disbandRegularUnit(unit.quantity, unit.nation, regionId);
    });
    units.elites?.forEach(unit => {
      actions.push(disbandEliteUnit(regionId, unit.nation, unit.quantity));
      this.unitHandler.disbandEliteUnit(unit.quantity, unit.nation, regionId);
    });
    return actions;
  }

  async recruitUnits(frontId: WotrFrontId): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    let points = 0;
    const exludedRegions = new Set<WotrRegionId>();
    let canPass = false;
    while (points < 2) {
      const constraints: WotrRecruitmentConstraints = {
        points: 2 - points,
        exludedRegions: exludedRegions
      };
      const validUnits = this.unitRules.validFrontReinforcementUnits(frontId, constraints);
      if (!validUnits.length) return actions;
      const unit = await this.ui.askReinforcementUnit("Choose a unit to recruit", {
        units: validUnits,
        frontId: frontId,
        canPass
      });
      if (unit === false) return actions;
      points += unit.type === "elite" ? 2 : 1;
      const nation = this.nationStore.nation(unit.nation);
      const validRegions = this.regionStore
        .recruitmentRegions(nation)
        .filter(r => !exludedRegions.has(r.id));
      const regionId = await this.ui.askRegion(
        "Choose a region to recruit in",
        validRegions.map(r => r.id)
      );
      exludedRegions.add(regionId);
      actions.push(...(await this.recruitUnit(unit, regionId, frontId)));
      canPass = true;
    }
    return actions;
  }

  async recruitUnit(
    unit: WotrReinforcementUnit,
    regionId: WotrRegionId,
    frontId: WotrFrontId
  ): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    switch (unit.type) {
      case "regular": {
        const action = recruitRegularUnit(regionId, unit.nation, 1);
        this.unitHandler.recruitRegularUnit(action.quantity, action.nation, action.region);
        actions.push(action);
        break;
      }
      case "elite": {
        const action = recruitEliteUnit(regionId, unit.nation, 1);
        this.unitHandler.recruitEliteUnit(action.quantity, action.nation, action.region);
        actions.push(action);
        break;
      }
      case "leader": {
        const action = recruitLeader(regionId, unit.nation, 1);
        this.unitHandler.recruitLeader(action.quantity, action.nation, action.region);
        actions.push(action);
        break;
      }
      case "nazgul": {
        const action = recruitNazgul(regionId, 1);
        this.unitHandler.recruitNazgul(1, regionId);
        actions.push(action);
        break;
      }
    }
    actions.push(...(await this.checkStackingLimit(regionId, frontId)));
    return actions;
  }

  async recruitUnitsInDifferentRegions(
    nUnitsPerRegion: number,
    nationId: WotrNationId,
    type: "regulars" | "elites",
    nMaxRegions: number,
    availableRegionIds: WotrRegionId[]
  ): Promise<WotrRegularUnitRecruitment[]> {
    const nationQ = this.q.nation(nationId);
    const nReinforcements =
      type === "regulars" ? nationQ.nRegularReinforcements() : nationQ.nEliteReinforcements();
    if (!nReinforcements) {
      await this.ui.askContinue("No reinforcements available");
      return [];
    }
    if (!availableRegionIds.length) {
      await this.ui.askContinue("No free regions available");
      return [];
    }
    let nLeftRegions = Math.min(availableRegionIds.length, nMaxRegions);
    let nLeftUnits = Math.min(nReinforcements, nLeftRegions * nUnitsPerRegion);
    let continuee = true;
    const actions: WotrRegularUnitRecruitment[] = [];
    do {
      const regionId = await this.ui.askRegion(
        `Select a region to recruit ${type} units`,
        availableRegionIds
      );
      let nUnits: number;
      if (nLeftRegions * nUnitsPerRegion === nLeftUnits) {
        nUnits = nUnitsPerRegion;
      } else {
        const nMinUnits = Math.max(1, nLeftUnits - (nLeftRegions - 1) * nUnitsPerRegion);
        const nMaxUnits = Math.min(nLeftUnits, nUnitsPerRegion);
        if (nMinUnits === nMaxUnits) {
          nUnits = nMaxUnits;
        } else {
          nUnits = await this.ui.askQuantity("Select number of units to recruit", {
            min: nMinUnits,
            max: nMaxUnits,
            default: nMaxUnits
          });
        }
      }

      actions.push(recruitRegularUnit(regionId, nationId, nUnits));
      this.unitHandler.recruitRegularUnit(nUnits, nationId, regionId);

      availableRegionIds = availableRegionIds.filter(r => r !== regionId);
      nLeftRegions--;
      nLeftUnits -= nUnits;
      continuee = nLeftRegions > 0 && nLeftUnits > 0;
    } while (continuee);
    return actions;
  }

  async recruitRegularsOrElitesByCard(
    regionId: WotrRegionId,
    nationId: WotrNationId,
    nUnits: number = 1
  ): Promise<WotrAction[]> {
    const frontId = this.nationStore.nation(nationId).front;
    if (!this.q.region(regionId).isFreeForRecruitmentByCard(frontId)) return [];
    let continuee = true;
    let nRegulars = 0;
    let nElites = 0;
    while (continuee) {
      const units: WotrReinforcementUnit[] = [];
      if (this.q.nation(nationId).hasRegularReinforcements())
        units.push({ nation: nationId, type: "regular" });
      if (this.q.nation(nationId).hasEliteReinforcements())
        units.push({ nation: nationId, type: "elite" });
      if (units.length) {
        const unit = await this.ui.askReinforcementUnit("Choose a unit to recruit", {
          frontId,
          units,
          canPass: false
        });
        if (unit.type === "regular") nRegulars++;
        else nElites++;
        continuee = nRegulars + nElites < nUnits;
      } else {
        continuee = false;
      }
    }
    const actions: WotrAction[] = [];
    if (nRegulars) {
      actions.push(recruitRegularUnit(regionId, nationId, nRegulars));
      this.unitHandler.recruitRegularUnit(nRegulars, nationId, regionId);
    }
    if (nElites) {
      actions.push(recruitEliteUnit(regionId, nationId, nElites));
      this.unitHandler.recruitEliteUnit(nElites, nationId, regionId);
    }
    actions.push(...(await this.checkStackingLimit(regionId, frontId)));
    return actions;
  }

  async recruitUnitsInSameRegionByCard(
    regionId: WotrRegionId,
    nationId: WotrNationId,
    nRegulars: number,
    nElites: number,
    nNazguls: number
  ): Promise<WotrAction[]> {
    const frontId = this.nationStore.nation(nationId).front;
    if (!this.q.region(regionId).isFreeForRecruitmentByCard(frontId)) return [];
    let continuee = true;
    let nChosenRegulars = 0;
    let nChosenElites = 0;
    let nChosenNazguls = 0;
    while (continuee) {
      const units: WotrReinforcementUnit[] = [];
      if (nChosenRegulars < nRegulars && this.q.nation(nationId).hasRegularReinforcements())
        units.push({ nation: nationId, type: "regular" });
      if (nChosenElites < nElites && this.q.nation(nationId).hasEliteReinforcements())
        units.push({ nation: nationId, type: "elite" });
      if (nChosenNazguls < nNazguls && this.q.nation(nationId).hasNazgulReinforcements())
        units.push({ nation: nationId, type: "nazgul" });
      if (units.length) {
        const unit = await this.ui.askReinforcementUnit("Choose a unit to recruit", {
          frontId,
          units,
          canPass: true
        });
        if (!unit) {
          continuee = false;
        } else if (unit.type === "regular") {
          this.unitHandler.recruitRegularUnit(1, nationId, regionId);
          nChosenRegulars++;
        } else if (unit.type === "elite") {
          this.unitHandler.recruitEliteUnit(1, nationId, regionId);
          nChosenElites++;
        } else if (unit.type === "nazgul") {
          this.unitHandler.recruitNazgul(1, regionId);
          nChosenNazguls++;
        }
        continuee =
          nChosenRegulars < nRegulars || nChosenElites < nElites || nChosenNazguls < nNazguls;
      } else {
        continuee = false;
      }
    }
    const actions: WotrAction[] = [];
    if (nRegulars) actions.push(recruitRegularUnit(regionId, nationId, nRegulars));
    if (nElites) actions.push(recruitEliteUnit(regionId, nationId, nElites));
    if (nNazguls) actions.push(recruitNazgul(regionId, nNazguls));
    actions.push(...(await this.checkStackingLimit(regionId, frontId)));
    return actions;
  }

  async recruitRegularByCard(
    regionId: WotrRegionId,
    nationId: WotrNationId
  ): Promise<WotrAction | null> {
    const frontId = this.nationStore.nation(nationId).front;
    if (!this.q.region(regionId).isFreeForRecruitmentByCard(frontId)) return null;
    const units: WotrReinforcementUnit[] = [];
    if (this.q.rohan.hasRegularReinforcements()) units.push({ nation: nationId, type: "regular" });
    if (!units.length) return null;
    await this.ui.askReinforcementUnit("Choose a unit to recruit", {
      frontId,
      units,
      canPass: false
    });
    this.unitHandler.recruitRegularUnit(1, nationId, regionId);
    return recruitRegularUnit(regionId, nationId, 1);
  }

  async recruitLeaderByCard(regionId: WotrRegionId, nationId: WotrNationId): Promise<WotrAction[]> {
    const frontId: WotrFrontId = "free-peoples";
    if (!this.q.rohan.hasLeaderReinforcements()) return [];
    if (!this.q.region(regionId).hasArmy(frontId)) return [];
    await this.ui.askReinforcementUnit("Choose a leader to recruit", {
      frontId,
      units: [{ nation: nationId, type: "leader" }],
      canPass: false
    });
    this.unitHandler.recruitLeader(1, nationId, regionId);
    return [recruitLeader(regionId, nationId, 1)];
  }

  attackArmyChoice: WotrUiChoice = {
    label: () => "Attack",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontAttack(frontId),
    actions: async (frontId: WotrFrontId) => this.attack(frontId)
  };

  moveArmiesChoice: WotrUiChoice = {
    label: () => "Move armies",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontMoveArmies(frontId),
    actions: async (frontId: WotrFrontId) => this.moveArmies(2, frontId)
  };

  recruitReinforcementsChoice: WotrUiChoice = {
    label: () => "Recruit reinforcements",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontRecruitReinforcements(frontId),
    actions: async (frontId: WotrFrontId) => this.recruitUnits(frontId)
  };

  leaderArmyMoveChoice: WotrUiChoice = {
    label: () => "Move army with leader",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontMoveArmiesWithLeader(frontId),
    actions: async (frontId: WotrFrontId) => [await this.moveArmyWithLeader(frontId)]
  };

  leaderArmyAttackChoice: WotrUiChoice = {
    label: () => "Attack with leader",
    isAvailable: (frontId: WotrFrontId) => this.unitRules.canFrontAttackWithLeader(frontId),
    actions: async (frontId: WotrFrontId) => this.attackWithLeader(frontId)
  };

  async eliminateUnits(params: WotrEliminateUnitsParams, frontId: string): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    for (const unitMatch of params.units) {
      actions.push(...(await this.eliminateUnit(unitMatch, frontId)));
    }
    return actions;
  }

  async eliminateUnit(selection: WotrRegionUnitMatch, frontId: string): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    const regionFilter = this.regionFilter(selection);
    const regions = this.q.regions().filter(regionFilter);
    const units = await this.ui.askRegionUnits(`Select a ${selection.unitType} unit to eliminate`, {
      regionIds: regions.map(r => r.regionId),
      type: "eliminateUnit",
      unitType: selection.unitType,
      nationId: selection.nationId || null
    });
    if (units.regulars?.length) {
      const nationUnit = units.regulars[0];
      actions.push(eliminateRegularUnit(units.regionId, nationUnit.nation, nationUnit.quantity));
      this.unitHandler.eliminateRegularUnit(nationUnit.quantity, nationUnit.nation, units.regionId);
    }
    if (units.elites?.length) {
      const eliteUnit = units.elites[0];
      actions.push(eliminateEliteUnit(units.regionId, eliteUnit.nation, eliteUnit.quantity));
      this.unitHandler.eliminateEliteUnit(eliteUnit.quantity, eliteUnit.nation, units.regionId);
    }
    if (units.leaders?.length) {
      const leaderUnit = units.leaders[0];
      actions.push(eliminateLeader(units.regionId, leaderUnit.nation, leaderUnit.quantity));
      this.unitHandler.eliminateLeader(leaderUnit.quantity, leaderUnit.nation, units.regionId);
    }
    if (units.nNazgul) {
      actions.push(eliminateNazgul(units.regionId, units.nNazgul));
      this.unitHandler.eliminateNazgul(units.nNazgul, units.regionId);
    }
    return actions;
  }

  private regionFilter(match: WotrRegionUnitMatch): (r: WotrRegionQuery) => boolean {
    switch (match.unitType) {
      case "regular":
        return r => r.hasRegularUnitsOfNation(match.nationId!);
      case "elite":
        return r => r.hasEliteUnitsOfNation(match.nationId!);
      case "leader":
        return r => r.hasLeadersOfNation(match.nationId!);
      case "army":
        return r => r.hasArmyUnitsOfNation(match.nationId!);
      case "nazgul":
        return r => r.hasNazgul();
      case "companion":
        return r => r.hasCompanions();
      case "minion":
        return r => r.hasMinions();
      case "nazgulOrMinion":
        return r => r.hasNazgul() || r.hasMinions();
    }
  }

  async forfeitLeadership(params: WotrForfeitLeadershipParams): Promise<WotrReactionStory> {
    const continuee = await this.ui.askConfirm(
      "Forfeit leadership?",
      "Forfeit leadership",
      "Cancel"
    );
    if (!continuee)
      return {
        type: "reaction-card-skip",
        card: params.cardId
      };
    const message = this.forfeitLeadershipMessage(params.points);
    const minPoints = this.forfeitLeadershipMinPoints(params.points);
    const units = await this.ui.askRegionUnits(message, {
      regionIds: [params.regionId],
      type: "forfeitLeadership",
      frontId: params.frontId,
      message,
      minPoints,
      onlyNazgul: params.onlyNazgul ?? false
    });
    const unitComposers: WotrUnitComposer[] = [];
    units.elites?.forEach(unit => unitComposers.push(elite(unit.nation, unit.quantity)));
    units.leaders?.forEach(unit => unitComposers.push(leader(unit.nation, unit.quantity)));
    if (units.nNazgul) unitComposers.push(nazgul(units.nNazgul));
    units.characters?.forEach(unit => unitComposers.push(character(unit)));
    return {
      type: "reaction-card",
      card: params.cardId,
      actions: [forfeitLeadership(...unitComposers)]
    };
  }

  private forfeitLeadershipMessage(points: number | "oneOrMore"): string {
    if (points === "oneOrMore") {
      return "Select one or more leadership points to forfeit";
    } else if (points === 1) {
      return "Select 1 leadership point to forfeit";
    } else {
      return `Select ${points} leadership points to forfeit`;
    }
  }

  private forfeitLeadershipMinPoints(points: number | "oneOrMore"): number {
    if (points === "oneOrMore") {
      return 1;
    } else {
      return points;
    }
  }

  async rageOfTheDunledingsMoveUnits(
    toRegion: WotrRegionId,
    dunlandRegions: WotrRegionId[]
  ): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    let fromRegions = dunlandRegions.filter(r => this.q.region(r).hasArmyUnitsOfNation("isengard"));
    if (!fromRegions.length) return actions;
    const move = await this.ui.askConfirm("Want to move armies?", "Move", "Skip");
    if (!move) return actions;
    let continueMoving = true;
    let movableUnits = 4;
    while (continueMoving) {
      const movingArmy = await this.ui.askRegionUnits("Select units to move", {
        regionIds: fromRegions,
        type: "rageOfTheDunlendings",
        maxNArmyUnits: movableUnits
      });
      const regionArmy = this.q.region(movingArmy.regionId).army("shadow")!;
      const leftUnits = this.unitUtils.splitUnits(regionArmy, movingArmy);
      const action = moveArmy(movingArmy.regionId, toRegion, leftUnits);
      actions.push(action);
      this.unitHandler.moveArmy(action, "shadow");
      await this.checkStackingLimit(toRegion, "shadow");
      fromRegions = fromRegions.filter(r => r !== action.fromRegion);
      movableUnits -= this.unitUtils.nArmyUnits(regionArmy);
      if (action.leftUnits) movableUnits += this.unitUtils.nArmyUnits(action.leftUnits);
      if (fromRegions.length && movableUnits > 0) {
        continueMoving = await this.ui.askConfirm(
          "Continue moving armies?",
          "Move another",
          "Stop moving"
        );
      } else {
        continueMoving = false;
      }
    }
    return actions;
  }
}
