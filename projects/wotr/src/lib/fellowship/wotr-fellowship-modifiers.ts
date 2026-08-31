import { Injectable } from '@angular/core';
import { WotrModifier } from '../commons/wotr-modifier';
import type { WotrFellowshipMove } from './wotr-fellowship-models';

export type WotrAfterFellowshipDeclaration = (
  params: WotrFellowshipMove,
) => Promise<void>;

@Injectable()
export class WotrFellowshipModifiers {
  public readonly afterDeclaration =
    new WotrModifier<WotrAfterFellowshipDeclaration>();
  async onAfterFellowshipDeclaration(
    params: WotrFellowshipMove,
  ): Promise<void> {
    if (!this.afterDeclaration.get().length) return;
    for (const handler of this.afterDeclaration.get()) {
      await handler(params);
    }
  }

  clear() {
    this.afterDeclaration.clear();
  }
}
