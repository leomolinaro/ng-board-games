import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { KomeSovereignCard } from "./kome-sovereign-card";

// Dain Ironfoot - King Under the Mountain (Level 1, Leadership 1, Shadow Resistance 4)
// If the Dwarves are active and Erebor is unconquered, you may spend a Muster Action die
// result, or any Ruler die result, to move Dain to Erebor and awaken him there.
// Dwarvenking. If the Dwarves are "At War" and Dain is in Erebor, you may use a Muster Action
// die result to replace one Dwarven Regular unit in the Army with Dain with one Elite unit
// (even if Erebor is under siege).
// Iron Guard. If the Dwarves are "At War", you may use a Muster result on the Ruler die
// to recruit one Dwarven unit (Regular or Elite) in the same region as Dain, if it is free
// or under siege; then, you may recruit either one Dwarven Regular unit or Leader in any
// other free Dwarven Settlement.
// Dain is a Companion.

// Dain Ironfoot - Corrupted Ruler
// If Dain becomes Corrupted, place him in Erebor.
// Corrupted King. The Free Peoples player cannot recruit Leaders of Elite units in Erebor,
// except as an effect of an Event card.
// Fate of the Lonely Mountain. If Erebor is under siege, you can extend a siege battle there
// by removing a Shadow Regular unit, instead of reducing an Elite unit, onece per siege battle.
// When a Companion with a Dwarven or Free Peoples icon is in the same region as Dain,
// Corrupted Ruler, the Free Peoples player may use a Character Action die result ot remove Dain from play.
// His figure is removed, this card is discarded, and his Weaknesses immediately cease their effect.

export class Dain extends KomeSovereignCard {
  constructor(private q: WotrGameQuery) {
    super();
  }

  readonly sovereignId = "dain";

  override canBeAwakened(die: WotrActionDie): boolean {
    return false;
  }

  override async awaken(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Not implemented");
  }
}
