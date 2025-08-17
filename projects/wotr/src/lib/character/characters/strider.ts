import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { hideFellowship } from "../../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrPlayerChoice } from "../../game/wotr-game-ui";

// Strider - Ranger of the North (Level 3, Leadership 1)
// Guide. You may use any of your Action die results to hide a revealed Fellowship.
// Captain of the West. If Strider is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Heir to Isuldur. If Strider is not in the Fellowship, he can be replaced by Aragorn (instructions are provided on the Aragorn Character card).

export class StriderGuideAbility extends WotrCardAbility<WotrActionDieChoiceModifier> {
  constructor(
    private fellowshipStore: WotrFellowshipStore,
    actionDieModifiers: WotrActionDieModifiers
  ) {
    super(actionDieModifiers.actionDieChoices);
  }

  protected override handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    if (this.fellowshipStore.guide() !== "strider") return [];
    const choice: WotrPlayerChoice = {
      label: () => "Hide the Fellowship (Strider's guide ability)",
      isAvailable: () => this.fellowshipStore.isRevealed(),
      resolve: async () => {
        return [hideFellowship()];
      }
    };
    return [choice];
  };
}

export class HeirToIsildurAbility extends WotrCardAbility<unknown> {
  protected override handler = null;
}
