import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCharacterId } from "./wotr-character-models";

export type WotrBeforeCharacterElimination = (characterId: WotrCharacterId) => Promise<boolean>;
export type WotrAfterCharacterElimination = (characterId: WotrCharacterId) => Promise<void>;

@Injectable()
export class WotrCharacterModifiers {
  public readonly beforeCharacterElimination = new WotrModifier<WotrBeforeCharacterElimination>();
  async onBeforeCharacterElimination(characterId: WotrCharacterId): Promise<boolean> {
    if (!this.beforeCharacterElimination.get().length) return true;
    const results = await Promise.all(
      this.beforeCharacterElimination.get().map(handler => handler(characterId))
    );
    return results.every(result => result === true);
  }

  public readonly afterCharacterElimination = new WotrModifier<WotrAfterCharacterElimination>();
  public onAfterCharacterElimination(characterId: WotrCharacterId): void {
    this.afterCharacterElimination.get().forEach(handler => handler(characterId));
  }

  clear() {
    this.beforeCharacterElimination.clear();
    this.afterCharacterElimination.clear();
  }
}
