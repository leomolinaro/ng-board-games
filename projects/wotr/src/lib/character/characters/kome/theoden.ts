import type { WotrAbility } from '../../../ability/wotr-ability';
import type { WotrFrontId } from '../../../front/wotr-front-models';
import type { WotrGameQuery } from '../../../game/wotr-game-query';
import type { WotrLogWriter } from '../../../log/wotr-log-writer';
import type { WotrRegionId } from '../../../region/wotr-region-models';
import type {
  WotrAfterRegionControlChange,
  WotrRegionModifiers,
} from '../../../region/wotr-region-modifiers';
import type { WotrRegionStore } from '../../../region/wotr-region-store';
import type { WotrRecruitmentConstraints } from '../../../unit/wotr-unit-handler';
import type {
  WotrRecruitmentConstraintsModifier,
  WotrUnitModifiers,
} from '../../../unit/wotr-unit-modifiers';
import type { WotrCharacterHandler } from '../../wotr-character-handler';
import { KomeSovereignCard } from './kome-sovereign-card';

// Theoden - King of the Riddermark (Level 2, Leadership 1, Shadow Resistance 3)
// If Rohan is active and Edoras is unconquered, you may spend a Muster Action die result,
// or any Ruler die result, to move Theoden to Edoras and awaken him there.
// Forth, Eorlingas! In the first Combat round of each battle, Theoden's Leadership is 3.
// Mustering of the Mark. If Rohan is "At War", you may use a Muster result on the Ruler die
// to recruit one Rohan Regular unit or Leader in two different free Rohan Settlements,
// and one Rohan Regular unit or Leader in the same region as Theoden, if it is free.
// Theoden is a Companion.

// Theoden - Corrupted Ruler
// If Theoden becomes Corrupted, place him in Edoras.
// Corrupted King. The Free Peoples player cannot recruit Leaders or Elite units of Rohan,
// except as an effect of an Event card.
// Mark of the White Hand. If you control Helm's Deep, it is considered an Isengard Stronghold.
// It is still counted as conquered by the Shadow for the purpose of Victory conditions.
// When a Companion with a Rohan or Free Peoples icon is in the same region as Theoden, Corrupted Ruler,
// the Free Peoples player may use a Character Action die result to remove Theoden from play. His figure
// is removed, this card is discarded, and his Weaknesses immediately cease their effect.

export class Theoden extends KomeSovereignCard {
  constructor(
    protected q: WotrGameQuery,
    protected characterHandler: WotrCharacterHandler,
    protected logger: WotrLogWriter,
  ) {
    super();
  }

  readonly sovereignId = 'theoden';
  protected readonly nation = 'rohan';
  protected readonly awakeningRegion = 'edoras';
  protected readonly corruptionRegion = 'edoras';
}

export class TheodenCorruptedKing implements WotrAbility<WotrRecruitmentConstraintsModifier> {
  constructor(private unitModifiers: WotrUnitModifiers) {
    this.modifier = this.unitModifiers.recruitmentConstraintsModifier;
  }

  modifier;

  handler(constraints: WotrRecruitmentConstraints): void {
    constraints.excludedNationsForEliteUnits.add('rohan');
    constraints.excludedNationsForLeaderUnits.add('rohan');
  }
}

export class MarkOfTheWhiteHand implements WotrAbility<WotrAfterRegionControlChange> {
  constructor(
    private regionModifiers: WotrRegionModifiers,
    private regionStore: WotrRegionStore,
  ) {
    this.modifier = this.regionModifiers.afterRegionControlChange;
  }

  modifier;

  handler(regionId: WotrRegionId, newController: WotrFrontId): void {
    if (regionId === 'helms-deep') {
      if (newController === 'free-peoples') {
        this.regionStore.changeNation('helms-deep', 'isengard');
      } else {
        this.regionStore.changeNation('helms-deep', 'rohan');
      }
    }
  }

  destroy(): void {
    if (this.regionStore.region('helms-deep').nationId === 'isengard') {
      this.regionStore.changeNation('helms-deep', 'rohan');
    }
  }
}
