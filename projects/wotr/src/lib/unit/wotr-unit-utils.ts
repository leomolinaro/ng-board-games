import { Injectable } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { frontOfNation, WotrNationId } from "../nation/wotr-nation-models";
import { WotrArmy, WotrLeaderUnits, WotrUnits } from "./wotr-unit-models";

@Injectable()
export class WotrUnitUtils {
  q!: WotrGameQuery;

  addRegulars(quantity: number, nation: WotrNationId, army: WotrArmy | undefined): WotrArmy {
    return this.addUnits("regulars", nation, quantity, army);
  }

  removeRegulars(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined
  ): WotrArmy | undefined {
    return this.removeUnits("regulars", nation, quantity, army);
  }

  addElites(quantity: number, nation: WotrNationId, army: WotrArmy | undefined): WotrArmy {
    return this.addUnits("elites", nation, quantity, army);
  }

  removeElites(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined
  ): WotrArmy | undefined {
    return this.removeUnits("elites", nation, quantity, army);
  }

  addLeaders(quantity: number, nation: WotrNationId, army: WotrArmy | undefined): WotrArmy {
    return this.addUnits("leaders", nation, quantity, army);
  }

  removeLeaders(
    quantity: number,
    nation: WotrNationId,
    army: WotrArmy | undefined
  ): WotrArmy | undefined {
    return this.removeUnits("leaders", nation, quantity, army);
  }

  private addUnits(
    unitKey: "regulars" | "elites" | "leaders",
    nation: WotrNationId,
    quantity: number,
    army: WotrArmy | undefined
  ): WotrArmy {
    if (!army) {
      army = { front: frontOfNation(nation) };
    }
    const units = army[unitKey];
    if (units) {
      const index = units.findIndex(u => u.nation === nation);
      if (index >= 0) {
        const unit = units[index];
        return {
          ...army,
          [unitKey]: immutableUtil.listReplaceByIndex(
            index,
            { ...unit, quantity: unit.quantity + quantity },
            units
          )
        };
      } else {
        return {
          ...army,
          [unitKey]: immutableUtil.listPush([{ nation, quantity }], units)
        };
      }
    } else {
      return {
        ...army,
        [unitKey]: [{ nation, quantity }]
      };
    }
  }

  private removeUnits(
    unitKey: "regulars" | "elites" | "leaders",
    nation: WotrNationId,
    quantity: number,
    army: WotrArmy | undefined
  ): WotrArmy | undefined {
    if (!army) {
      throw new Error("removeUnits");
    }
    const { [unitKey]: units, ...restArmy } = army;
    if (!units) {
      throw new Error("removeUnitsFrom");
    }
    const index = units.findIndex(u => u.nation === nation);
    if (index < 0) {
      throw new Error("removeUnitsFrom");
    }
    const unit = units[index];
    const newQuantity = unit.quantity - quantity;
    if (newQuantity < 0) {
      throw new Error("removeUnitsFrom");
    }
    const newUnits = newQuantity
      ? immutableUtil.listReplaceByIndex(index, { ...unit, quantity: newQuantity }, units)
      : immutableUtil.listRemoveByIndex(index, units);
    const newArmy: WotrArmy = {
      ...restArmy,
      [unitKey]: newUnits
    };
    return this.isEmptyArmy(newArmy) ? undefined : newArmy;
  }

  addNazgul(quantity: number, army: WotrArmy | undefined): WotrArmy {
    if (!army) {
      army = { front: "shadow" };
    }
    return { ...army, nNazgul: (army.nNazgul || 0) + quantity };
  }

  removeNazgul(quantity: number, army: WotrArmy | undefined): WotrArmy | undefined {
    if (!army) {
      throw new Error("removeNazgul");
    }
    army = { ...army, nNazgul: (army.nNazgul || 0) - quantity };
    return this.isEmptyArmy(army) ? undefined : army;
  }

  addCharacter(characterId: WotrCharacterId, army: WotrArmy | undefined): WotrArmy {
    if (!army) {
      throw new Error("addCharacter");
    }
    return { ...army, characters: immutableUtil.listPush([characterId], army.characters || []) };
  }

  removeCharacter(characterId: WotrCharacterId, army: WotrArmy | undefined): WotrArmy | undefined {
    if (!army?.characters) throw new Error("No characters in army to remove");
    army = {
      ...army,
      characters: immutableUtil.listRemoveFirst(c => c === characterId, army.characters || [])
    };
    return this.isEmptyArmy(army) ? undefined : army;
  }

  isEmptyArmy(army: WotrUnits) {
    if (army.regulars?.length) return false;
    if (army.elites?.length) return false;
    if (army.characters?.length) return false;
    if (army.leaders?.length) return false;
    if (army.nNazgul) return false;
    return true;
  }

  hasUnitsOfNation(nation: WotrNationId, units: WotrUnits) {
    if (units.regulars?.some(u => u.nation === nation)) return true;
    if (units.elites?.some(u => u.nation === nation)) return true;
    if (units.leaders?.some(u => u.nation === nation)) return true;
    return false;
  }

  hasArmyUnits(units: WotrUnits) {
    if (units.regulars?.length) return true;
    if (units.elites?.length) return true;
    return false;
  }

  hasArmyUnitsOfNation(nation: WotrNationId, units: WotrUnits) {
    if (units.regulars?.some(u => u.nation === nation)) return true;
    if (units.elites?.some(u => u.nation === nation)) return true;
    return false;
  }

  hasArmyUnitsOfDifferentNations(units: WotrUnits) {
    let count = 0;
    if (this.hasArmyUnitsOfNation("sauron", units)) count++;
    if (this.hasArmyUnitsOfNation("isengard", units)) count++;
    if (this.hasArmyUnitsOfNation("southrons", units)) count++;
    return count > 1;
  }

  hasRegularUnits(units: WotrUnits) {
    if (units.regulars?.length) return true;
    return false;
  }

  hasRegularUnitsOfNation(nation: WotrNationId, units: WotrUnits) {
    if (units.regulars?.some(u => u.nation === nation)) return true;
    return false;
  }

  hasEliteUnits(units: WotrUnits) {
    if (units.elites?.length) return true;
    return false;
  }

  getNEliteUnits(units: WotrUnits) {
    if (!units.elites?.length) return 0;
    return units.elites.reduce((count, u) => count + u.quantity, 0);
  }

  hasEliteUnitsOfNation(nation: WotrNationId, units: WotrUnits) {
    if (units.elites?.some(u => u.nation === nation)) return true;
    return false;
  }

  hasNazgul(units: WotrUnits) {
    if (units.nNazgul) return true;
    if (units.characters?.includes("the-witch-king")) return true;
    return false;
  }

  nazgulCount(units: WotrUnits): number {
    let count = 0;
    if (units.nNazgul) count += units.nNazgul;
    if (units.characters?.includes("the-witch-king")) count += 1;
    return count;
  }

  nazgulLeadership(units: WotrUnits): number {
    let leadership = 0;
    if (units.nNazgul) leadership += units.nNazgul;
    if (units.characters && units.characters.indexOf("the-witch-king") >= 0) leadership += 2;
    return leadership;
  }

  hasLeaders(units: WotrUnits): boolean {
    if (units.leaders?.length) return true;
    return false;
  }

  leadership(units: WotrLeaderUnits): number {
    let leadership = 0;
    if (units.elites) {
      for (const elite of units.elites) {
        // leadership += elite.quantity;
      }
    }
    if (units.leaders) {
      for (const leader of units.leaders) {
        leadership += leader.quantity;
      }
    }
    if (units.nNazgul) leadership += units.nNazgul;
    if (units.characters) leadership += this.charactersLeadership(units.characters);
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
    return units.characters?.some(c => this.q.character(c).frontId === "free-peoples") || false;
  }

  getCompanions(units: WotrUnits): WotrCompanionId[] {
    return (units.characters?.filter(c => this.q.character(c).frontId === "free-peoples") ||
      []) as WotrCompanionId[];
  }

  isCompanion(characterId: WotrCharacterId): boolean {
    const character = this.q.character(characterId);
    if (character.frontId !== "free-peoples") return false;
    return !character.rulerStatus || character.rulerStatus === "awakened";
  }

  nCompanions(units: WotrUnits): number {
    return this.getCompanions(units).length || 0;
  }

  hasMinions(units: WotrUnits): boolean {
    return units.characters?.some(c => this.q.character(c).frontId === "shadow") || false;
  }

  getNArmyUnits(units: WotrUnits) {
    let n = 0;
    if (units.regulars?.length) n += units.regulars.reduce((count, u) => count + u.quantity, 0);
    if (units.elites?.length) n += units.elites.reduce((count, u) => count + u.quantity, 0);
    return n;
  }

  unitsToArmy(units: WotrUnits): WotrArmy {
    return {
      front: units.regulars?.length
        ? frontOfNation(units.regulars[0].nation)
        : frontOfNation(units.elites![0].nation),
      ...units
    };
  }

  mergeArmies(army1: WotrArmy | undefined, army2: WotrArmy | undefined): WotrArmy | undefined {
    if (!army1) return army2;
    if (!army2) return army1;
    let newArmy = army1;
    if (army2.regulars) {
      newArmy = army2.regulars.reduce(
        (a, unit) => this.addRegulars(unit.quantity, unit.nation, a),
        newArmy
      );
    }
    if (army2.elites) {
      newArmy = army2.elites.reduce(
        (a, unit) => this.addElites(unit.quantity, unit.nation, a),
        newArmy
      );
    }
    if (army2.leaders) {
      newArmy = army2.leaders.reduce(
        (a, unit) => this.addLeaders(unit.quantity, unit.nation, a),
        newArmy
      );
    }
    if (army2.nNazgul) {
      newArmy = this.addNazgul(army2.nNazgul, newArmy);
    }
    if (army2.characters) {
      newArmy = army2.characters.reduce((a, unit) => this.addCharacter(unit, a), newArmy);
    }
    return newArmy;
  }

  splitUnits(
    army: WotrArmy | undefined,
    splittedUnits: WotrUnits | undefined
  ): WotrArmy | undefined {
    if (!army) throw new Error("splitArmy");
    if (!splittedUnits) return army;
    let newArmy: WotrArmy | undefined = army;
    if (splittedUnits.regulars) {
      newArmy = splittedUnits.regulars.reduce<WotrArmy | undefined>(
        (a, unit) => this.removeRegulars(unit.quantity, unit.nation, a),
        newArmy
      );
    }
    if (splittedUnits.elites) {
      newArmy = splittedUnits.elites.reduce<WotrArmy | undefined>(
        (a, unit) => this.removeElites(unit.quantity, unit.nation, a),
        newArmy
      );
    }
    if (splittedUnits.leaders) {
      newArmy = splittedUnits.leaders.reduce<WotrArmy | undefined>(
        (a, unit) => this.removeLeaders(unit.quantity, unit.nation, a),
        newArmy
      );
    }
    if (splittedUnits.nNazgul) {
      newArmy = this.removeNazgul(splittedUnits.nNazgul, newArmy);
    }
    if (splittedUnits.characters) {
      newArmy = splittedUnits.characters.reduce<WotrArmy | undefined>(
        (a, unit) => this.removeCharacter(unit, a),
        newArmy
      );
    }
    return newArmy;
  }

  nArmyUnits(army: WotrUnits): number {
    const { regulars, elites } = army;
    let totalArmyUnits = 0;
    totalArmyUnits += regulars?.reduce((sum, unit) => sum + unit.quantity, 0) ?? 0;
    totalArmyUnits += elites?.reduce((sum, unit) => sum + unit.quantity, 0) ?? 0;
    return totalArmyUnits;
  }

  nHits(army: WotrArmy) {
    const { regulars, elites } = army;
    let totalHits = 0;
    totalHits += regulars?.reduce((sum, unit) => sum + unit.quantity, 0) ?? 0;
    totalHits += elites?.reduce((sum, unit) => sum + unit.quantity * 2, 0) ?? 0;
    return totalHits;
  }
}
