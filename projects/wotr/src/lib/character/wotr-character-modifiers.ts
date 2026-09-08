import { Injectable } from '@angular/core';
import { WotrModifier } from '../commons/wotr-modifier';
import type { WotrCharacterId, WotrCompanionId } from './wotr-character-models';

export interface WotrCharacterEliminationParams {
  characterId: WotrCharacterId;
  fromTheFellowship: boolean;
}

export type WotrBeforeCharacterElimination = (
  params: WotrCharacterEliminationParams,
) => Promise<boolean>;
export type WotrAfterCharacterElimination = (
  params: WotrCharacterEliminationParams,
) => void | Promise<void>;
export type WotrAfterCompanionLeavingTheFellowship = (
  companionId: WotrCompanionId,
) => void | Promise<void>;
export type WotrCharacterMovementLevelModifier = (
  movingCharacters: WotrCharacterId[],
  originalLevel: number,
) => number;

@Injectable()
export class WotrCharacterModifiers {
  public readonly beforeCharacterElimination =
    new WotrModifier<WotrBeforeCharacterElimination>();
  async onBeforeCharacterElimination(
    params: WotrCharacterEliminationParams,
  ): Promise<boolean> {
    if (this.beforeCharacterElimination.get().length === 0) return true;
    const results = await Promise.all(
      this.beforeCharacterElimination.get().map((handler) => handler(params)),
    );
    return results.every(Boolean);
  }

  public readonly afterCharacterElimination =
    new WotrModifier<WotrAfterCharacterElimination>();
  public async onAfterCharacterElimination(
    params: WotrCharacterEliminationParams,
  ): Promise<void> {
    for (const handler of this.afterCharacterElimination.get()) {
      await handler(params);
    }
  }

  public readonly afterCompanionLeavingTheFellowship =
    new WotrModifier<WotrAfterCompanionLeavingTheFellowship>();
  public async onAfterCompanionLeavingTheFellowship(
    companionId: WotrCompanionId,
  ): Promise<void> {
    for (const handler of this.afterCompanionLeavingTheFellowship.get()) {
      await handler(companionId);
    }
  }

  public readonly characterMovementLevelModifier =
    new WotrModifier<WotrCharacterMovementLevelModifier>();
  public getCharacterMovementLevel(
    characters: WotrCharacterId[],
    originalLevel: number,
  ): number {
    let modifier = originalLevel;
    for (const handler of this.characterMovementLevelModifier.get()) {
      modifier = Math.max(modifier, handler(characters, originalLevel));
    }
    return modifier;
  }

  clear() {
    this.beforeCharacterElimination.clear();
    this.afterCharacterElimination.clear();
    this.afterCompanionLeavingTheFellowship.clear();
    this.characterMovementLevelModifier.clear();
  }
}
