import { unexpectedStory } from "../../../../../commons/src";
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
  characterId: WotrCharacterId,
  player: WotrPlayer
): Promise<false | WotrAction[]> {
  const story = await player.activateCharacterAbility(characterId);
  switch (story.type) {
    case "reaction-character":
      return story.actions;
    case "reaction-character-skip":
      return false;
    default:
      throw unexpectedStory(story, "character activation or not");
  }
}
