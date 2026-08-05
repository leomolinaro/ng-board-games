import { unexpectedStory } from "../../../../../commons/src";
import { WotrUiAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUiContext } from "../../game/wotr-game-ui-context";
import { WotrPlayer } from "../../player/wotr-player";
import { WotrCharacterId } from "../wotr-character-models";

export abstract class WotrPlayableCharacterCard {
  public abstract characterId: WotrCharacterId;

  abstract canBeBroughtIntoPlay(die: WotrActionDie): boolean;
  abstract bringIntoPlay(ui: WotrGameUiContext): Promise<WotrAction>;

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
