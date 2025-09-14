import { WotrAbility } from "../../ability/wotr-ability";
import {
  WotrActionDieModifiers,
  WotrAfterActionDieResolution
} from "../../action-die/wotr-action-die-modifiers";

// Gandalf the Grey - The Grey Wanderer (Level 3, Leadership 1)
// Guide. After you use an Event Action Die to play an Event card, you may immediately draw an Event card from the deck matching the type of that card.
// Captain of the West. If Gandalf is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Emissary from the West. If Gandalf is not in the Fellowship, he can be replaced by Gandalf the White (instructions are provided on the Gandalf the White Character
// card).

export class GandalfGuideAbility implements WotrAbility<WotrAfterActionDieResolution> {
  constructor(private actionDieModifiers: WotrActionDieModifiers) {}

  modifier = this.actionDieModifiers.afterActionDieResolution;

  public handler: WotrAfterActionDieResolution = async (die, frontId, actions) => {
    throw new Error("Guide ability not implemented yet");
  };
}

export class EmissaryFromTheWestAbility implements WotrAbility<unknown> {
  public handler = null;
}
