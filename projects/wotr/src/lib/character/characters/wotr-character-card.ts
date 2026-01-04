import { unexpectedStory } from "../../../../../commons/src";
import { WotrUiAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrPlayer } from "../../player/wotr-player";
import { WotrCharacterId } from "../wotr-character-models";

export abstract class WotrCharacterCard {
  public abstract characterId: WotrCharacterId;

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    throw new Error("Character already in play.");
  }
  bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Character already in play.");
  }

  resolveBringIntoPlayEffect(): void {}
}

export async function activateCharacterAbility(
  ability: WotrUiAbility,
  characterId: WotrCharacterId,
  player: WotrPlayer
): Promise<false | WotrAction[]> {
  const story = await player.activateCharacterAbility(ability, characterId);
  switch (story.type) {
    case "character-effect":
      return story.actions;
    case "character-effect-skip":
      return false;
    default:
      throw unexpectedStory(story, "character activation or not");
  }
}
