import { Injectable } from '@angular/core';
import { immutableUtil } from '@leobg/commons/utils';
import type {
  WotrCharacterId,
  WotrCompanionId,
} from '../character/wotr-character-models';
import { KomeSovereignQuery } from '../character/wotr-character-query';
import type { WotrGameQuery } from '../game/wotr-game-query';
import type { WotrNationId } from '../nation/wotr-nation-models';
import { frontOfNation } from '../nation/wotr-nation-models';
import type { WotrArmy, WotrLeaderUnits, WotrUnits } from './wotr-unit-models';

@Injectable()
export class WotrUnitUtils {
  q!: WotrGameQuery;

  addRegulars(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined,
  ): WotrArmy {
    return this.addUnits('regulars', nation, quantity, army);
  }

  removeRegulars(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined,
  ): WotrArmy | undefined {
    return this.removeUnits('regulars', nation, quantity, army);
  }

  addElites(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined,
  ): WotrArmy {
    return this.addUnits('elites', nation, quantity, army);
  }

  removeElites(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined,
  ): WotrArmy | undefined {
    return this.removeUnits('elites', nation, quantity, army);
  }

  addLeaders(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined,
  ): WotrArmy {
    return this.addUnits('leaders', nation, quantity, army);
  }

  removeLeaders(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined,
  ): WotrArmy | undefined {
    return this.removeUnits('leaders', nation, quantity, army);
  }

  private addUnits(
    unitKey: 'regulars' | 'elites' | 'leaders',
    nation: WotrNationId,
    quantity: number,
    army: WotrArmy | undefined,
  ): WotrArmy {
    army ??= { front: frontOfNation(nation) };
    const units = army[unitKey];
    if (units) {
      const index = units.findIndex((u) => u.nation === nation);
      if (index === -1) {
        return {
          ...army,
          [unitKey]: immutableUtil.listPush([{ nation, quantity }], units),
        };
      }
      const unit = units[index];
      return {
        ...army,
        [unitKey]: immutableUtil.listReplaceByIndex(
          index,
          { ...unit, quantity: unit.quantity + quantity },
          units,
        ),
      };
    }
    return {
      ...army,
      [unitKey]: [{ nation, quantity }],
    };
  }

  private removeUnits(
    unitKey: 'regulars' | 'elites' | 'leaders',
    nation: WotrNationId,
    quantity: number,
    army: WotrArmy | undefined,
  ): WotrArmy | undefined {
    if (!army) {
      throw new Error('removeUnits');
    }
    const { [unitKey]: units, ...restArmy } = army;
    if (!units) {
      throw new Error('removeUnitsFrom');
    }
    const index = units.findIndex((u) => u.nation === nation);
    if (index === -1) throw new Error('removeUnitsFrom');
    const unit = units[index];
    const newQuantity = unit.quantity - quantity;
    if (newQuantity < 0) {
      throw new Error('removeUnitsFrom');
    }
    const newUnits = newQuantity
      ? immutableUtil.listReplaceByIndex(
          index,
          { ...unit, quantity: newQuantity },
          units,
        )
      : immutableUtil.listRemoveByIndex(index, units);
    const newArmy: WotrArmy = {
      ...restArmy,
      [unitKey]: newUnits,
    };
    return this.isEmptyArmy(newArmy) ? undefined : newArmy;
  }

  addNazgul(quantity: number, army: WotrArmy | undefined): WotrArmy {
    army ??= { front: 'shadow' };
    return { ...army, nNazgul: (army.nNazgul ?? 0) + quantity };
  }

  removeNazgul(
    quantity: number,
    army: WotrArmy | undefined,
  ): WotrArmy | undefined {
    if (!army) {
      throw new Error('removeNazgul');
    }
    army = { ...army, nNazgul: (army.nNazgul ?? 0) - quantity };
    return this.isEmptyArmy(army) ? undefined : army;
  }

  addCharacter(
    characterId: WotrCharacterId,
    army: WotrArmy | undefined,
  ): WotrArmy {
    if (!army) {
      throw new Error('addCharacter');
    }
    return {
      ...army,
      characters: immutableUtil.listPush([characterId], army.characters ?? []),
    };
  }

  removeCharacter(
    characterId: WotrCharacterId,
    army: WotrArmy | undefined,
  ): WotrArmy | undefined {
    if (!army?.characters) throw new Error('No characters in army to remove');
    army = {
      ...army,
      characters: immutableUtil.listRemoveFirst(
        (c) => c === characterId,
        army.characters ?? [],
      ),
    };
    return this.isEmptyArmy(army) ? undefined : army;
  }

  isEmptyArmy(army: WotrUnits): boolean {
    if (army.regulars?.length) return false;
    if (army.elites?.length) return false;
    if (army.characters?.length) return false;
    if (army.leaders?.length) return false;
    if (army.nNazgul) return false;
    return true;
  }

  hasUnitsOfNation(nation: WotrNationId, units: WotrUnits): boolean {
    if (units.regulars?.some((u) => u.nation === nation)) return true;
    if (units.elites?.some((u) => u.nation === nation)) return true;
    if (units.leaders?.some((u) => u.nation === nation)) return true;
    return false;
  }

  hasArmyUnits(units: WotrUnits): boolean {
    if (units.regulars?.length) return true;
    if (units.elites?.length) return true;
    return false;
  }

  hasArmyUnitsOfNation(nation: WotrNationId, units: WotrUnits): boolean {
    if (units.regulars?.some((u) => u.nation === nation)) return true;
    if (units.elites?.some((u) => u.nation === nation)) return true;
    return false;
  }

  hasArmyUnitsOfDifferentNations(units: WotrUnits): boolean {
    let count = 0;
    if (this.hasArmyUnitsOfNation('sauron', units)) count++;
    if (this.hasArmyUnitsOfNation('isengard', units)) count++;
    if (this.hasArmyUnitsOfNation('southrons', units)) count++;
    return count > 1;
  }

  hasRegularUnits(units: WotrUnits): boolean {
    return Boolean(units.regulars?.length);
  }

  hasRegularUnitsOfNation(nation: WotrNationId, units: WotrUnits): boolean {
    return Boolean(units.regulars?.some((u) => u.nation === nation));
  }

  getNRegularUnitsOfNation(nation: WotrNationId, units: WotrUnits): number {
    if (!units.regulars?.length) return 0;
    const unit = units.regulars.find((u) => u.nation === nation);
    return unit ? unit.quantity : 0;
  }

  hasEliteUnits(units: WotrUnits): boolean {
    return Boolean(units.elites?.length);
  }

  getNEliteUnits(units: WotrUnits): number {
    let count = 0;
    if (units.elites) for (const unit of units.elites) count += unit.quantity;
    return count;
  }

  getNEliteUnitsOfNation(nation: WotrNationId, units: WotrUnits): number {
    if (!units.elites?.length) return 0;
    const unit = units.elites.find((u) => u.nation === nation);
    return unit ? unit.quantity : 0;
  }

  hasEliteUnitsOfNation(nation: WotrNationId, units: WotrUnits): boolean {
    return Boolean(units.elites?.some((u) => u.nation === nation));
  }

  hasNazgul(units: WotrUnits): boolean {
    if (units.nNazgul) return true;
    if (units.characters?.includes('the-witch-king')) return true;
    return false;
  }

  nazgulCount(units: WotrUnits): number {
    let count = 0;
    if (units.nNazgul) count += units.nNazgul;
    if (units.characters?.includes('the-witch-king')) count += 1;
    return count;
  }

  nazgulLeadership(units: WotrUnits): number {
    let leadership = 0;
    if (units.nNazgul) leadership += units.nNazgul;
    if (units.characters?.includes('the-witch-king')) leadership += 2;
    return leadership;
  }

  hasLeaders(units: WotrUnits): boolean {
    return Boolean(units.leaders?.length);
  }

  leadership(units: WotrLeaderUnits): number {
    let leadership = 0;
    if (units.leaders) {
      for (const leader of units.leaders) {
        leadership += leader.quantity;
      }
    }
    if (units.nNazgul) leadership += units.nNazgul;
    if (units.characters)
      leadership += this.charactersLeadership(units.characters);
    return leadership;
  }

  charactersLeadership(characters: WotrCharacterId[]): number {
    let leadership = 0;
    for (const characterId of characters) {
      const character = this.q.character(characterId);
      leadership += character.leadership;
    }
    return leadership;
  }

  hasCompanions(units: WotrUnits): boolean {
    return (
      units.characters?.some(
        (c) => this.q.character(c).frontId === 'free-peoples',
      ) ?? false
    );
  }

  getCompanions(units: WotrUnits): WotrCompanionId[] {
    return (units.characters?.filter(
      (c) => this.q.character(c).frontId === 'free-peoples',
    ) ?? []) as WotrCompanionId[];
  }

  isCompanion(characterId: WotrCharacterId): boolean {
    const character = this.q.character(characterId);
    if (character.frontId !== 'free-peoples') return false;
    return character instanceof KomeSovereignQuery
      ? character.rulerStatus === 'awakened'
      : true;
  }

  nCompanions(units: WotrUnits): number {
    return this.getCompanions(units).length || 0;
  }

  hasMinions(units: WotrUnits): boolean {
    return (
      units.characters?.some((c) => this.q.character(c).frontId === 'shadow') ??
      false
    );
  }

  getNArmyUnits(units: WotrUnits): number {
    let n = 0;
    if (units.regulars) for (const unit of units.regulars) n += unit.quantity;
    if (units.elites) for (const unit of units.elites) n += unit.quantity;
    return n;
  }

  unitsToArmy(units: WotrUnits): WotrArmy {
    return {
      front: frontOfNation(
        units.regulars?.length
          ? units.regulars[0].nation
          : units.elites![0].nation,
      ),
      ...units,
    };
  }

  mergeArmies(
    army1: WotrArmy | undefined,
    army2: WotrArmy | undefined,
  ): WotrArmy | undefined {
    if (!army1) return army2;
    if (!army2) return army1;
    let newArmy = army1;
    if (army2.regulars) {
      for (const unit of army2.regulars)
        newArmy = this.addRegulars(unit.quantity, unit.nation, newArmy);
    }
    if (army2.elites)
      for (const unit of army2.elites)
        newArmy = this.addElites(unit.quantity, unit.nation, newArmy);
    if (army2.leaders)
      for (const unit of army2.leaders)
        newArmy = this.addLeaders(unit.quantity, unit.nation, newArmy);
    if (army2.nNazgul) newArmy = this.addNazgul(army2.nNazgul, newArmy);
    if (army2.characters)
      for (const character of army2.characters)
        newArmy = this.addCharacter(character, newArmy);
    return newArmy;
  }

  splitUnits(
    army: WotrArmy | undefined,
    splittedUnits: WotrUnits | undefined,
  ): WotrArmy | undefined {
    if (!army) throw new Error('splitArmy');
    if (!splittedUnits) return army;
    let newArmy: WotrArmy | undefined = army;
    if (splittedUnits.regulars)
      for (const unit of splittedUnits.regulars)
        newArmy = this.removeRegulars(unit.quantity, unit.nation, newArmy);
    if (splittedUnits.elites)
      for (const unit of splittedUnits.elites)
        newArmy = this.removeElites(unit.quantity, unit.nation, newArmy);
    if (splittedUnits.leaders)
      for (const unit of splittedUnits.leaders)
        newArmy = this.removeLeaders(unit.quantity, unit.nation, newArmy);

    if (splittedUnits.nNazgul)
      newArmy = this.removeNazgul(splittedUnits.nNazgul, newArmy);
    if (splittedUnits.characters)
      for (const character of splittedUnits.characters)
        newArmy = this.removeCharacter(character, newArmy);
    return newArmy;
  }

  nArmyUnits(army: WotrUnits): number {
    const { regulars, elites } = army;
    let totalArmyUnits = 0;
    if (regulars) for (const unit of regulars) totalArmyUnits += unit.quantity;
    if (elites) for (const unit of elites) totalArmyUnits += unit.quantity;
    return totalArmyUnits;
  }

  nHits(army: WotrArmy): number {
    const { regulars, elites } = army;
    let totalHits = 0;
    if (regulars) for (const unit of regulars) totalHits += unit.quantity;
    if (elites) for (const unit of elites) totalHits += unit.quantity * 2;
    return totalHits;
  }
}
