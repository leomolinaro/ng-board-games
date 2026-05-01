import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { KomeSovereignCard } from "./kome-sovereign-card";

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
  constructor(private q: WotrGameQuery) {
    super();
  }

  readonly sovereignId = "theoden";

  override canBeAwakened(die: WotrActionDie): boolean {
    return false;
  }

  override async awaken(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Not implemented");
  }
}
