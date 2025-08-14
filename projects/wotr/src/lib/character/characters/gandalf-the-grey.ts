import { Injectable, inject } from "@angular/core";
import {
  WotrActionDieModifiers,
  WotrAfterActionDieResolution
} from "../../action-die/wotr-action-die-modifiers";
import { WotrBattleModifiers } from "../../battle/wotr-battle-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Gandalf the Grey - The Grey Wanderer (Level 3, Leadership 1)
// Guide. After you use an Event Action Die to play an Event card, you may immediately draw an Event card from the deck matching the type of that card.
// Captain of the West. If Gandalf is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Emissary from the West. If Gandalf is not in the Fellowship, he can be replaced by Gandalf the White (instructions are provided on the Gandalf the White Character
// card).

@Injectable({ providedIn: "root" })
export class WotrGandalfTheGrey extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private battleModifiers = inject(WotrBattleModifiers);

  protected override characterId: WotrCharacterId = "gandalf-the-grey";

  override abilities(): WotrCardAbility[] {
    return [
      // new GuideAbility(this.actionDieModifiers.afterActionDieResolution),
      new CaptainOfTheWestAbility(this.characterId, this.battleModifiers)
      // new EmissaryFromTheWestAbility(null as any)
    ];
  }
}

class GuideAbility extends WotrCardAbility<WotrAfterActionDieResolution> {
  protected override handler: WotrAfterActionDieResolution = async (die, frontId, actions) => {
    throw new Error("Guide ability not implemented yet");
  };
}

class EmissaryFromTheWestAbility extends WotrCardAbility<unknown> {
  protected override handler = null;
}
