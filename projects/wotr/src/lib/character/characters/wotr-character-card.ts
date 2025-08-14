import { unexpectedStory } from "../../../../../commons/src";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../battle/wotr-battle-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrPlayer } from "../../player/wotr-player";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";

export abstract class WotrCharacterCard {
  protected abstract characterStore: WotrCharacterStore;
  protected abstract characterId: WotrCharacterId;

  private _abilities: WotrCardAbility[] | null = null;

  name(): string {
    return this.characterStore.character(this.characterId).name;
  }

  protected abstract abilities(): WotrCardAbility[];

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    throw new Error("Character already in play.");
  }
  bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Character already in play.");
  }

  resolveBringIntoPlayEffect(): void {}

  getAbilities(): WotrCardAbility[] {
    if (!this._abilities) {
      this._abilities = this.abilities();
    }
    return this._abilities;
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

export class CaptainOfTheWestAbility extends WotrCardAbility<WotrBeforeCombatRound> {
  constructor(
    private characterId: WotrCharacterId,
    battleModifiers: WotrBattleModifiers
  ) {
    super(battleModifiers.beforeCombatRound);
  }

  protected override handler = async (round: WotrCombatRound): Promise<void> => {
    if (round.attacker.army().characters?.includes(this.characterId)) {
      round.attacker.combatModifiers.push(1);
    } else if (round.defender.army().characters?.includes(this.characterId)) {
      round.defender.combatModifiers.push(1);
    }
  };
}
