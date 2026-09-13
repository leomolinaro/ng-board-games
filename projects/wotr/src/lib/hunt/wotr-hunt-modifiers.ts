import { Injectable } from '@angular/core';
import { WotrModifier } from '../commons/wotr-modifier';
import type { WotrFellowshipMove } from '../fellowship/wotr-fellowship-models';
import type { WotrUiChoice } from '../game/wotr-game-ui';
import type { WotrHuntEffectParams, WotrHuntTileId } from './wotr-hunt-models';

export class WotrHuntRollModifiers {
  rollModifiers: number[] = [];
  reRollModifiers: number[] = [];
}
export type WotrBeforeHuntRoll = (
  modifiers: WotrHuntRollModifiers,
) => void | Promise<void>;

export type WotrHuntDrawPrevented = () => Promise<boolean>;

export type WotrAfterTileDrawn = (
  tile: WotrHuntTileId,
) => Promise<WotrHuntTileId>;

export type WotrHuntEffectChoiceModifier = (
  params: WotrHuntEffectParams,
) => WotrUiChoice<WotrHuntEffectParams>[];

export type WotrAfterFellowshipReveal = (
  params: WotrFellowshipMove,
) => void | Promise<void>;

export type WotrFellowshipProgressDieAddedToHuntBoxPrevented = () =>
  boolean | Promise<boolean>;

@Injectable()
export class WotrHuntModifiers {
  public readonly beforeHuntRoll = new WotrModifier<WotrBeforeHuntRoll>();
  public async onBeforeHuntRoll(
    modifiers: WotrHuntRollModifiers,
  ): Promise<void> {
    for (const handler of this.beforeHuntRoll.get()) {
      await handler(modifiers);
    }
  }

  public readonly huntDrawPrevented = new WotrModifier<WotrHuntDrawPrevented>();
  public couldHuntDrawBePrevented(): boolean {
    return this.huntDrawPrevented.get().length > 0;
  }
  public async isHuntDrawPrevented(): Promise<boolean> {
    for (const handler of this.huntDrawPrevented.get()) {
      if (await handler()) {
        return true;
      }
    }
    return false;
  }

  public readonly afterTileDrawn = new WotrModifier<WotrAfterTileDrawn>();
  async onAfterTileDrawn(tile: WotrHuntTileId): Promise<WotrHuntTileId> {
    for (const handler of this.afterTileDrawn.get()) {
      tile = await handler(tile);
    }
    return tile;
  }

  public readonly huntEffectChoices =
    new WotrModifier<WotrHuntEffectChoiceModifier>();
  public getHuntEffectChoices(
    params: WotrHuntEffectParams,
  ): WotrUiChoice<WotrHuntEffectParams>[] {
    const choices: WotrUiChoice<WotrHuntEffectParams>[] = [];
    for (const modifier of this.huntEffectChoices.get())
      choices.push(...modifier(params));
    return choices;
  }

  public readonly afterFellowshipReveal =
    new WotrModifier<WotrAfterFellowshipReveal>();
  public async onAfterFellowshipReveal(
    params: WotrFellowshipMove,
  ): Promise<void> {
    for (const handler of this.afterFellowshipReveal.get()) {
      await handler(params);
    }
  }

  public readonly fellowshipProgressDieAddedToHuntBoxPrevented =
    new WotrModifier<WotrFellowshipProgressDieAddedToHuntBoxPrevented>();
  public async isFellowshipProgressDieAddedToHuntBoxPrevented(): Promise<boolean> {
    for (const handler of this.fellowshipProgressDieAddedToHuntBoxPrevented.get()) {
      if (await handler()) {
        return true;
      }
    }
    return false;
  }

  clear(): void {
    this.afterTileDrawn.clear();
    this.huntEffectChoices.clear();
    this.beforeHuntRoll.clear();
    this.huntDrawPrevented.clear();
    this.afterFellowshipReveal.clear();
    this.fellowshipProgressDieAddedToHuntBoxPrevented.clear();
  }
}
