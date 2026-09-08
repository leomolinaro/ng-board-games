import { inject, Injectable } from '@angular/core';
import type { WotrFrontId } from '../front/wotr-front-models';
import { WotrGameQuery } from '../game/wotr-game-query';
import type { WotrNationId } from '../nation/wotr-nation-models';
import type { WotrRegion } from '../region/wotr-region-models';
import { WotrRegionStore } from '../region/wotr-region-store';
import type { WotrCharacterId } from './wotr-character-models';
import type { WotrCharacterMovementOptions } from './wotr-character-ui';

@Injectable()
export class WotrCharacterRules {
  private regionStore = inject(WotrRegionStore);
  private q = inject(WotrGameQuery);

  isCharacterInRegionOf(
    characterId: WotrCharacterId,
    nationId: WotrNationId,
  ): boolean {
    return (
      this.q.character(characterId).isInPlay() &&
      this.regionStore.characterRegion(characterId)?.nationId === nationId
    );
  }

  canMoveNazgulOrMinions(): boolean {
    if (this.canMoveStandardNazgul()) return true;
    this.q.minions.some((minion) => minion.canMove());
    return false;
  }

  canMoveStandardNazgul(): boolean {
    return this.regionStore.regions().some((region) => {
      if (region.army?.nNazgul) return true;
      if (region.freeUnits?.nNazgul) return true;
      if (region.underSiegeArmy?.nNazgul) return true;
      return false;
    });
  }

  canMoveCompanions(): boolean {
    return this.q.companions.some((companion) => companion.canMove());
  }

  characterCanEnterRegion(
    region: WotrRegion,
    frontId: WotrFrontId,
    distance: number,
    options?: WotrCharacterMovementOptions,
  ): boolean {
    if (distance === 0) return true;
    if (options?.canEndInSiege) return true;
    if (region.settlement !== 'stronghold') return true;
    return region.underSiegeArmy
      ? region.controlledBy !== frontId
      : region.controlledBy === frontId;
  }

  companionCanLeaveRegion(region: WotrRegion, distance: number): boolean {
    if (region.settlement !== 'stronghold') return true;
    return region.controlledBy === 'free-peoples'
      ? !region.underSiegeArmy
      : distance === 0;
  }

  hasNazgul(region: WotrRegion): boolean {
    if (region.army?.nNazgul) return true;
    if (region.freeUnits?.nNazgul) return true;
    if (region.underSiegeArmy?.nNazgul) return true;
    if (region.army?.characters?.includes('the-witch-king')) return true;
    if (region.freeUnits?.characters?.includes('the-witch-king')) return true;
    if (region.underSiegeArmy?.characters?.includes('the-witch-king'))
      return true;
    return false;
  }

  characterGroupLevel(characters: WotrCharacterId[]): number {
    let level = 0;
    for (const characterId of characters) {
      const character = this.q.character(characterId);
      if (level < character.level) level = character.level;
    }
    return level;
  }

  maxLevel(companions: WotrCharacterId[]): number {
    let max = 0;
    for (const companion of companions) {
      max = Math.max(max, this.q.character(companion).level);
    }
    return max;
  }
}
