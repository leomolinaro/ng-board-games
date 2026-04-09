import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrCharacterId, WotrCompanionId } from "./wotr-character-models";

export interface WotrCharacterEliminationParams {
  characterId: WotrCharacterId;
  fromTheFellowship: boolean;
}

export type WotrBeforeCharacterElimination = (
  params: WotrCharacterEliminationParams
) => Promise<boolean>;
export type WotrAfterCharacterElimination = (
  params: WotrCharacterEliminationParams
) => Promise<void>;
export type WotrAfterCompanionLeavingTheFellowship = (
  companionId: WotrCompanionId
) => Promise<void>;
export type WotrCharacterMovementLevelModifier = (
  movingCharacters: WotrCharacterId[],
  originalLevel: number
) => number;

@Injectable()
export class WotrCharacterModifiers {
  public readonly beforeCharacterElimination = new WotrModifier<WotrBeforeCharacterElimination>();
  async onBeforeCharacterElimination(params: WotrCharacterEliminationParams): Promise<boolean> {
    if (!this.beforeCharacterElimination.get().length) return true;
    const results = await Promise.all(
      this.beforeCharacterElimination.get().map(handler => handler(params))
    );
    return results.every(result => result === true);
  }

  public readonly afterCharacterElimination = new WotrModifier<WotrAfterCharacterElimination>();
  public async onAfterCharacterElimination(params: WotrCharacterEliminationParams): Promise<void> {
    await Promise.all(this.afterCharacterElimination.get().map(handler => handler(params)));
  }

  public readonly afterCompanionLeavingTheFellowship =
    new WotrModifier<WotrAfterCompanionLeavingTheFellowship>();
  public async onAfterCompanionLeavingTheFellowship(companionId: WotrCompanionId): Promise<void> {
    await Promise.all(
      this.afterCompanionLeavingTheFellowship.get().map(handler => handler(companionId))
    );
  }

  public readonly characterMovementLevelModifier =
    new WotrModifier<WotrCharacterMovementLevelModifier>();
  public getCharacterMovementLevel(characters: WotrCharacterId[], originalLevel: number): number {
    return this.characterMovementLevelModifier
      .get()
      .reduce(
        (modifier, handler) => Math.max(modifier, handler(characters, originalLevel)),
        originalLevel
      );
  }

  clear() {
    this.beforeCharacterElimination.clear();
    this.afterCharacterElimination.clear();
    this.afterCompanionLeavingTheFellowship.clear();
    this.characterMovementLevelModifier.clear();
  }
}
