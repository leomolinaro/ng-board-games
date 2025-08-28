import { WotrAbility } from "../../ability/wotr-ability";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrAction } from "../../commons/wotr-action-models";
import { hideFellowship } from "../../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrUiCharacterChoice } from "../../game/wotr-game-ui";
import { WotrCharacterId } from "../wotr-character-models";

// Strider - Ranger of the North (Level 3, Leadership 1)
// Guide. You may use any of your Action die results to hide a revealed Fellowship.
// Captain of the West. If Strider is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Heir to Isuldur. If Strider is not in the Fellowship, he can be replaced by Aragorn (instructions are provided on the Aragorn Character card).

export class StriderGuideAbility implements WotrAbility<WotrActionDieChoiceModifier> {
  constructor(
    private fellowshipStore: WotrFellowshipStore,
    private actionDieModifiers: WotrActionDieModifiers
  ) {}

  public modifier = this.actionDieModifiers.actionDieChoices;

  public handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    if (this.fellowshipStore.guide() !== "strider") return [];
    const choice = new StriderHideChoice(this.fellowshipStore);
    return [choice];
  };
}

class StriderHideChoice implements WotrUiCharacterChoice {
  constructor(private fellowshipStore: WotrFellowshipStore) {}

  character: WotrCharacterId = "strider";
  label(): string {
    return "Hide the Fellowship (Strider's guide ability)";
  }
  isAvailable(): boolean {
    return this.fellowshipStore.isRevealed();
  }
  async actions(): Promise<WotrAction[]> {
    return [hideFellowship()];
  }
}

export class HeirToIsildurAbility implements WotrAbility<unknown> {
  public modifier = null as any;
  public handler = null;
}
