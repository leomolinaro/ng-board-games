import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCharacterId } from "./wotr-character-models";

export type WotrBeforeCharacterElimination = (characterId: WotrCharacterId) => Promise<boolean>;

@Injectable({ providedIn: "root" })
export class WotrCharacterModifiers {
  public readonly beforeCharacterElimination = new WotrModifier<WotrBeforeCharacterElimination>();
  async onBeforeCharacterElimination(characterId: WotrCharacterId): Promise<boolean> {
    if (!this.beforeCharacterElimination.get().length) return true;
    const results = await Promise.all(
      this.beforeCharacterElimination.get().map(handler => handler(characterId))
    );
    return results.every(result => result === true);
  }

  clear() {
    this.beforeCharacterElimination.clear();
  }
}
