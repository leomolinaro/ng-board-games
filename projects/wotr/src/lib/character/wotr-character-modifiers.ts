import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCharacterId, WotrCompanionId } from "./wotr-character-models";

export type WotrBeforeCharacterElimination = (characterId: WotrCharacterId) => Promise<boolean>;
export type WotrAfterCharacterElimination = (characterId: WotrCharacterId) => Promise<void>;
export type WotrAfterCompanionLeavingTheFellowship = (
  companionId: WotrCompanionId
) => Promise<void>;

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
  public async onAfterCharacterElimination(characterId: WotrCharacterId): Promise<void> {
    await Promise.all(this.afterCharacterElimination.get().map(handler => handler(characterId)));
  }

  public readonly afterCompanionLeavingTheFellowship =
    new WotrModifier<WotrAfterCompanionLeavingTheFellowship>();
  public async onAfterCompanionLeavingTheFellowship(companionId: WotrCompanionId): Promise<void> {
    await Promise.all(
      this.afterCompanionLeavingTheFellowship.get().map(handler => handler(companionId))
    );
  }

  clear() {
    this.beforeCharacterElimination.clear();
    this.afterCharacterElimination.clear();
    this.afterCompanionLeavingTheFellowship.clear();
  }
}
