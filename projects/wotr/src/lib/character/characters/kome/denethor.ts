import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { KomeSovereignCard } from "./kome-sovereign-card";

// Denethor - Lord Steward of Gondor (Level 1, Leadership 1, Shadow Reistance 3)
// If Gondor is active and Minas Tirith is unconquered, you may spend a Muster
// Action die result, or any Ruler die result, to move Denethor to Minas Tirith
// and awaken him there.
// Stewardship. If Gondor is "At War" and Denethor is in Minas Tirith, you may use a Muster
// Action die result to replace one Gondor Regular unit in the Army with Denethor with one
// Elite unit (even if Minas Tirith is under siege).
// Palantir of Anarion. If Denethor is in Misan Tirith, after you use an Event result on the
// Ruler die to draw or play an Event card, you may immediately draw another Event card
// from a deck of your choice.
// Denethor is a Companion.

// Denethor - Corrupted Ruler
// If Denethor becomes Corrupted, place him in Minas Tirith.
// Corrupted Steward. The Free Peoples player cannot recruit Leaders or Elite units in Minas Tirith,
// except as an effect of an Event card.
// Fate of the White Tower. If Minas Tirith is under siege, you can extend a siege battle there
// by removing a Shadow Regular unit, instead of reducing an Elite unit, once per siege battle.
// When a Companion with a Gondor or Free Peoples icon is in the same region as Denethor,
// Corrupted Ruler, the Free Peoples player may use a Character Action die result to remove Denethor
// from play. His figure is removed, this card is discarded, and his Weaknesses immediately cease
// their effect.

export class Denethor extends KomeSovereignCard {
  constructor(private q: WotrGameQuery) {
    super();
  }

  readonly sovereignId = "denethor";

  override canBeAwakened(die: WotrActionDie): boolean {
    return false;
  }

  override async awaken(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Not implemented");
  }
}
