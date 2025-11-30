import { inject, Injectable } from "@angular/core";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegion } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrCharacter, WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterStore } from "./wotr-character-store";
import { WotrCharacterMovementOptions } from "./wotr-character-ui";

@Injectable({ providedIn: "root" })
export class WotrCharacterRules {
  private characterStore = inject(WotrCharacterStore);
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
    this.characterStore.minions().some(minion => this.canMoveCharacter(minion));
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

  canMoveCharacter(character: WotrCharacter): boolean {
    if (character.status !== "inPlay") return false;
    if (character.level === 0) return false;
    if (character.flying) {
      if (this.isCharacterUnderSiege(character)) return false;
    }
    return true;
  }

  canMoveCompanions(): boolean {
    return this.characterStore.companions().some(companion => this.canMoveCharacter(companion));
  }

  isCharacterUnderSiege(character: WotrCharacter): boolean {
    return this.regionStore.regions().some(region => {
      return !region.underSiegeArmy?.characters?.includes(character.id);
    });
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
      const character = this.characterStore.character(characterId);
      if (l < character.level) return character.level;
      return l;
    }, 0);
  }
}
