import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
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
  getAbilities(): WotrCardAbility[] {
    if (!this.abilities) {
      this.abilities = this.createAbilities();
    }
    return this.abilities;
  }
}
