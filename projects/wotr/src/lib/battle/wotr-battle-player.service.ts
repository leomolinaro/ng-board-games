import { inject, Injectable } from "@angular/core";
import { randomUtil } from "@leobg/commons/utils";
import { eliminateCharacter } from "../character/wotr-character-actions";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtils } from "../unit/wotr-army.utils";
import {
  downgradeEliteUnit,
  eliminateEliteUnit,
  eliminateLeader,
  eliminateNazgul,
  eliminateRegularUnit
} from "../unit/wotr-unit-actions";
import { WotrUnits } from "../unit/wotr-unit.models";
import {
  advanceArmy,
  notAdvanceArmy,
  WotrCombatReRoll,
  WotrCombatRoll
} from "./wotr-battle-actions";
import { WotrBattleStore } from "./wotr-battle.store";
import { WotrCombatDie } from "./wotr-combat-die.models";

@Injectable({ providedIn: "root" })
export class WotrBattlePlayerService {
  private ui = inject(WotrGameUiStore);
  private battleStore = inject(WotrBattleStore);
  private regionStore = inject(WotrRegionStore);
  private armyUtil = inject(WotrArmyUtils);

  async rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrCombatRoll> {
    await this.ui.askContinue(`Roll ${nDice} combat dice`);
    const dice: WotrCombatDie[] = [];
    for (let i = 0; i < nDice; i++) {
      dice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return {
      type: "combat-roll",
      dice: this.rollDice(nDice)
    };
  }

  async reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrCombatReRoll> {
    await this.ui.askContinue(`Re-roll ${nDice} combat dice`);
    return {
      type: "combat-re-roll",
      dice: this.rollDice(nDice)
    };
  }

  private rollDice(nDice: number): WotrCombatDie[] {
    const dice: WotrCombatDie[] = [];
    for (let i = 0; i < nDice; i++) {
      dice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return dice;
  }

  async chooseCasualties(hitPoints: number, frontId: WotrFrontId): Promise<WotrAction[]> {
    const battle = this.battleStore.battle()!;
    const regionId =
      battle.attacker.frontId === frontId ? battle.action.fromRegion : battle.action.toRegion;
    const underSiege = battle.siege && battle.defender.frontId === frontId;
    const units = await this.ui.askCasualtyUnits(`Choose casualties for ${hitPoints} hit points`, {
      type: "chooseCasualties",
      regionIds: [regionId],
      underSiege,
      hitPoints,
      retroguard: null
    });
    return this.eliminateUnitActions(units, regionId);
  }

  async eliminateArmy(frontId: WotrFrontId): Promise<WotrAction[]> {
    const battle = this.battleStore.battle()!;
    const regionId =
      battle.attacker.frontId === frontId ? battle.action.fromRegion : battle.action.toRegion;
    const underSiege = battle.siege && battle.defender.frontId === frontId;
    const units = await this.ui.askCasualtyUnits("Eliminate the entire army", {
      type: "chooseCasualties",
      regionIds: [regionId],
      underSiege,
      hitPoints: "full",
      retroguard: null
    });
    return this.eliminateUnitActions(units, regionId);
  }

  private eliminateUnitActions(
    units: {
      downgrading: WotrUnits;
      removing: WotrUnits;
    },
    regionId: WotrRegionId
  ): WotrAction[] {
    const actions: WotrAction[] = [];
    units.downgrading.elites?.forEach(unit =>
      actions.push(downgradeEliteUnit(regionId, unit.nation, unit.quantity))
    );
    units.removing.regulars?.forEach(unit =>
      actions.push(eliminateRegularUnit(regionId, unit.nation, unit.quantity))
    );
    units.removing.elites?.forEach(unit =>
      actions.push(eliminateEliteUnit(regionId, unit.nation, unit.quantity))
    );
    units.removing.leaders?.forEach(unit =>
      actions.push(eliminateLeader(regionId, unit.nation, unit.quantity))
    );
    if (units.removing.nNazgul) {
      actions.push(eliminateNazgul(regionId, units.removing.nNazgul));
    }
    units.removing.characters?.forEach(unit => actions.push(eliminateCharacter(unit)));
    return actions;
  }

  async battleAdvance(frontId: WotrFrontId): Promise<WotrAction[]> {
    const battle = this.battleStore.battle()!;
    const fromRegion = this.regionStore.region(battle.action.fromRegion);
    const movingUnits = await this.ui.askRegionUnits("Choose units to advance", {
      type: "moveArmy",
      regionIds: [fromRegion.id],
      retroguard: battle.retroguard || null,
      withLeaders: false,
      required: false
    });
    if (this.armyUtil.isEmptyArmy(movingUnits)) {
      return [notAdvanceArmy(fromRegion.id)];
    } else {
      const attackingArmy = this.armyUtil.splitUnits(fromRegion.army, battle.retroguard)!;
      const leftUnits = this.armyUtil.splitUnits(attackingArmy, movingUnits);
      return [advanceArmy(leftUnits)];
    }
  }
}
