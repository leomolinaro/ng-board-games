import { unexpectedStory } from '../../../../../commons/src';
import type { WotrUiAbility } from '../../ability/wotr-ability';
import type { WotrActionDie } from '../../action-die/wotr-action-die-models';
import type { WotrAction } from '../../commons/wotr-action-models';
import type { WotrGameUiContext } from '../../game/wotr-game-ui-context';
import type { WotrPlayer } from '../../player/wotr-player';
import type { WotrCharacterId } from '../wotr-character-models';

export abstract class WotrPlayableCharacterCard {
  public abstract characterId: WotrCharacterId;

  abstract canBeBroughtIntoPlay(die: WotrActionDie): boolean;
  abstract bringIntoPlay(ui: WotrGameUiContext): Promise<WotrAction>;

  resolveBringIntoPlayEffect(): void {}
}

export async function activateCharacterAbility(
  ability: WotrUiAbility,
  characterId: WotrCharacterId,
  player: WotrPlayer,
): Promise<false | WotrAction[]> {
  const story = await player.activateCharacterAbility(ability, characterId);
  switch (story.type) {
    case 'character-effect':
      return story.actions;
    case 'character-effect-skip':
      return false;
    default:
      throw unexpectedStory(story, 'character activation or not');
  }
}
