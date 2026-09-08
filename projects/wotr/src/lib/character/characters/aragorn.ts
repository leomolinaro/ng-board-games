import type { WotrActionDie } from '../../action-die/wotr-action-die-models';
import type { WotrBattleModifiers } from '../../battle/wotr-battle-modifiers';
import type { WotrAction } from '../../commons/wotr-action-models';
import type { WotrGameQuery } from '../../game/wotr-game-query';
import type { WotrRegionId } from '../../region/wotr-region-models';
import { playCharacter } from '../wotr-character-actions';
import { WotrPlayableCharacterCard } from './wotr-playable-character-card';

// Aragorn - Heir to Isildur (Level 3, Leadership 2, +1 Action Die)
// If Strider is in Minas Tirith, Dol Amroth, or Pelargir, and that Settlement is unconquered, you may use one Will of the West Action die result to replace Strider
// with Aragorn.
// Captain of the West. If Aragorn is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).

export class WotrAragorn extends WotrPlayableCharacterCard {
  constructor(
    private q: WotrGameQuery,
    protected battleModifiers: WotrBattleModifiers,
  ) {
    super();
  }

  public readonly characterId = 'aragorn';

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (die !== 'will-of-the-west') return false;
    return Boolean(this.striderValidRegion());
  }

  private striderValidRegion(): WotrRegionId | null {
    if (this.striderInRegion('minas-tirith')) return 'minas-tirith';
    if (this.striderInRegion('dol-amroth')) return 'dol-amroth';
    if (this.striderInRegion('pelargir')) return 'pelargir';
    return null;
  }

  private striderInRegion(regionId: WotrRegionId): boolean {
    const region = this.q.region(regionId).region();
    if (region.army?.front === 'free-peoples') {
      return !!region.army.characters?.includes('strider');
    }
    return region.underSiegeArmy?.front === 'free-peoples' ? !!region.underSiegeArmy.characters?.includes('strider') : !!region.freeUnits?.characters?.includes('strider');
  }

  override bringIntoPlay(): WotrAction {
    const regionId = this.striderValidRegion();
    if (!regionId)
      throw new Error(
        'Strider is not in a valid region to bring Aragorn into play.',
      );
    return playCharacter(regionId, 'aragorn');
  }
}
