import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { KomeSovereignCard } from "./kome-sovereign-card";

// Brand - King of Dale (Level 1, Leadership 1, Shadow Resistance 2)
// If the North is active, you may spend a Muster Action die result, or any Ruler die result,
// to move Brand to an unconquered Free Peoples City or Stronghold and awaken him there.
// Heir of Bard. Once per battle, if Brand and a North Army unit are in battle, after revealing
// Combat cards you may forfeit the effects of your Combat card to cancel the effects of the Combat
// card played by the Shadow player. [0]
// Call to Arms. If the North is "At War", you may use a Muster result on the Ruler die to recruit
// one North Regular unit or Leader in two different free North Settlements, and one North
// Regular unit or Leader in the same region as Brand, if it is free.
// Brand is a Companion.

// Brand - Corrupted Ruler
// If Brand becomes Corrupted, place him in Dale.
// Corrupted King. The Free Peoples player cannot recruit Leaders or Elite units of the North Nation,
// except as an effect of an Event card.
// Shadow in the North. Once per battle, if a North Army unit is in that battle, after revealing
// Combat cards you may forfeit the effects of your Combat card to cancel the effects of the Combat
// card played by the Free Peoples player. [0]
// When a Companion with a North or Free Peoples icon is in the same region as Brand, Corrupted Ruler,
// the Free Peoples player may use a Character Action die result to remove Brand from play. His figure
// is removed, this card is discarded, and his Weaknesses immediately cease their effect.

export class Brand extends KomeSovereignCard {
  constructor(private q: WotrGameQuery) {
    super();
  }

  readonly sovereignId = "brand";

  override canBeAwakened(die: WotrActionDie): boolean {
    return false;
  }

  override async awaken(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Not implemented");
  }
}
