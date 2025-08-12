import { unexpectedStory } from "../../../../../commons/src";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import {
  WotrBattleModifiers,
  WotrBattleOnCombatRoundStart
} from "../../battle/wotr-battle-modifiers";
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

  protected abstract inPlayAbilities(): WotrCardAbility[];
  protected guideAbilities(): WotrCardAbility[] {
    return [];
  }
  protected eliminatedAbilities(): WotrCardAbility[] {
    return [];
  }

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    throw new Error("Character already in play.");
  }
  bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Character already in play.");
  }

  resolveBringIntoPlayEffect(): void {}

  getAbilities(): WotrCardAbility[] {
    if (!this.abilities) {
      this.abilities = this.inPlayAbilities();
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

export class CaptainOfTheWestAbility implements WotrCardAbility {
  constructor(
    private characterId: WotrCharacterId,
    private battleModifiers: WotrBattleModifiers
  ) {}

  private handler: WotrBattleOnCombatRoundStart = async round => {
    if (round.attacker.army().characters?.includes(this.characterId)) {
      round.attacker.combatModifiers.push(1);
    } else if (round.defender.army().characters?.includes(this.characterId)) {
      round.defender.combatModifiers.push(1);
    }
  };

  activate(): void {
    this.battleModifiers.combatRoundStartHandlers.register(this.handler);
  }

  deactivate(): void {
    this.battleModifiers.combatRoundStartHandlers.unregister(this.handler);
  }
}
