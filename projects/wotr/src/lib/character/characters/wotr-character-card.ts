import { unexpectedStory } from "../../../../../commons/src";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrPlayer } from "../../player/wotr-player";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";

export abstract class WotrCharacterCard {
  protected abstract characterStore: WotrCharacterStore;
  protected abstract characterId: WotrCharacterId;

  private abilities: WotrCardAbility[] | null = null;

  name(): string {
    return this.characterStore.character(this.characterId).name;
  }

  protected abstract createAbilities(): WotrCardAbility[];

  abstract canBeBroughtIntoPlay(die: WotrActionDie): boolean;
  abstract bringIntoPlay(ui: WotrGameUi): Promise<WotrAction>;

  resolveBringIntoPlayEffect(): void {}

  getAbilities(): WotrCardAbility[] {
    if (!this.abilities) {
      this.abilities = this.createAbilities();
    }
    return this.abilities;
  }
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
      throw unexpectedStory(story, " character activation or not");
  }
}
