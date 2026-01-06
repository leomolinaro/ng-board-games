import { inject, Injectable } from "@angular/core";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegion } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterMovementOptions } from "./wotr-character-ui";

@Injectable({ providedIn: "root" })
export class WotrCharacterRules {
  private regionStore = inject(WotrRegionStore);
  private q = inject(WotrGameQuery);

  isCharacterInRegionOf(characterId: WotrCharacterId, nationId: WotrNationId): boolean {
    return (
      this.q.character(characterId).isInPlay() &&
      this.regionStore.characterRegion(characterId)?.nationId === nationId
    );
  }

  canMoveNazgulOrMinions(): boolean {
    if (this.canMoveStandardNazgul()) return true;
    this.q.minions.some(minion => minion.canMove());
    return false;
  }

  canMoveStandardNazgul(): boolean {
    return this.regionStore.regions().some(region => {
      if (region.army?.nNazgul) return true;
      if (region.freeUnits?.nNazgul) return true;
      if (region.underSiegeArmy?.nNazgul) return true;
      return false;
    });
  }

  canMoveCompanions(): boolean {
    return this.q.companions.some(companion => companion.canMove());
  }

  companionCanEnterRegion(
    region: WotrRegion,
    distance: number,
    options?: WotrCharacterMovementOptions
  ): boolean {
    if (distance === 0) return true;
    if (options?.canEndInSiege) return true;
    if (region.settlement !== "stronghold") return true;
    if (region.controlledBy !== "free-peoples") return true;
    if (region.underSiegeArmy) return false;
    return true;
  }

  companionCanLeaveRegion(region: WotrRegion, distance: number): boolean {
    if (region.settlement !== "stronghold") return true;
    if (region.controlledBy === "free-peoples") {
      return !region.underSiegeArmy;
    } else {
      return distance === 0;
    }
  }

  hasNazgul(region: WotrRegion): boolean {
    if (region.army?.nNazgul) return true;
    if (region.freeUnits?.nNazgul) return true;
    if (region.underSiegeArmy?.nNazgul) return true;
    if (region.army?.characters?.includes("the-witch-king")) return true;
    if (region.freeUnits?.characters?.includes("the-witch-king")) return true;
    if (region.underSiegeArmy?.characters?.includes("the-witch-king")) return true;
    return false;
  }

  characterGroupLevel(characters: WotrCharacterId[]): number {
    return characters.reduce((l, characterId) => {
      const character = this.q.character(characterId);
      if (l < character.level) return character.level;
      return l;
    }, 0);
  }

  maxLevel(companions: WotrCharacterId[]): number {
    return companions.reduce((max, c) => Math.max(max, this.q.character(c).level), 0);
  }
}
