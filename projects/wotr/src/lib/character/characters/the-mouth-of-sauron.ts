import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers,
  WotrAfterActionDieResolution
} from "../../action-die/wotr-action-die-modifiers";
import { WotrActionDieUi } from "../../action-die/wotr-action-die-ui";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi, WotrUiCharacterChoice } from "../../game/wotr-game-ui";
import { WotrDieStory } from "../../game/wotr-story-models";
import { WotrRegion } from "../../region/wotr-region-models";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// The Mouth of Sauron - Lieutenant of Barad-dûr (Level 3, Leadership 2, +1 Action Die)
// If the Fellowship is on the Mordor Track or all the Free Peoples Nations are "At War," you may use one Muster action die result to place the Mouth of Sauron in
// any region with an unconquered Sauron Stronghold.
// Messenger of the Dark Tower. Once per turn, you may use a Muster Action die result as an Army Action die result instead.

export class WotrMouthOfSauron extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private q: WotrGameQuery
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.q.theMouthOfSauron.isAvailable() &&
      (this.q.fellowship.isOnMordorTrack() || this.q.freePeoples.victoryPoints() > 0) &&
      this.q.regions().some(r => this.isValidRegion(r.region()))
    );
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.q
      .regions()
      .filter(r => this.isValidRegion(r.region()))
      .map(r => r.regionId);
    const region = await ui.askRegion(
      "Select a region to bring the Mouth of Sauron into play",
      validRegions
    );
    return playCharacter(region, "the-mouth-of-sauron");
  }

  private isValidRegion(r: WotrRegion): boolean {
    return (
      r.nationId === "sauron" &&
      this.q.region(r.id).isUnconquered() &&
      r.settlement === "stronghold"
    );
  }
}

export class MessengerOfTheDarkTowerAbility implements WotrAbility<WotrActionDieChoiceModifier> {
  constructor(
    private characterStore: WotrCharacterStore,
    private actionDieUi: WotrActionDieUi,
    private actionDieModifiers: WotrActionDieModifiers
  ) {}

  public modifier = this.actionDieModifiers.actionDieChoices;
  public handler: WotrActionDieChoiceModifier = (die: WotrActionDie) => {
    if (die !== "muster") return [];
    const messengerChoice: WotrUiCharacterChoice = {
      label: () => "Messenger of the Dark Tower",
      isAvailable: () => !this.characterStore.messengerOfTheDarkTowerUsed(),
      character: "the-mouth-of-sauron",
      actions: async () => (await this.actionDieUi.resolveArmyResult("muster", "shadow")).actions
    };
    return [messengerChoice];
  };
}

export class MessengerOfTheDarkTowerSetUsedAbility
  implements WotrAbility<WotrAfterActionDieResolution>
{
  constructor(
    private characterStore: WotrCharacterStore,
    private actionDieModifiers: WotrActionDieModifiers
  ) {}

  public modifier = this.actionDieModifiers.afterActionDieResolution;
  public handler: WotrAfterActionDieResolution = async (
    story: WotrDieStory,
    frontId: WotrFrontId
  ) => {
    if (frontId !== "shadow") return;
    if (story.character !== "the-mouth-of-sauron") return;
    if (story.die !== "muster") return;
    this.characterStore.setMessengerOfTheDarkTowerUsed();
  };
}
