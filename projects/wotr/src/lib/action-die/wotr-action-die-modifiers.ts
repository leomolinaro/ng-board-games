import { Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrActionDie } from "./wotr-action-die-models";

export type WotrActionDieChoiceModifier = (
  die: WotrActionDie,
  frontId: WotrFrontId
) => WotrPlayerChoice[];

export type WotrAfterActionDieResolution = (
  die: WotrActionDie,
  frontId: WotrFrontId,
  actions: WotrAction[]
) => Promise<void>;

@Injectable({ providedIn: "root" })
export class WotrActionDieModifiers {
  public readonly actionDieChoices = new WotrModifier<WotrActionDieChoiceModifier>();
  public getActionDieChoices(die: WotrActionDie, frontId: WotrFrontId): WotrPlayerChoice[] {
    return this.actionDieChoices
      .get()
      .reduce<
        WotrPlayerChoice[]
      >((choices, modifier) => choices.concat(modifier(die, frontId)), []);
  }

  public readonly afterActionDieResolution = new WotrModifier<WotrAfterActionDieResolution>();
  async onAfterActionDieResolution(
    die: WotrActionDie,
    frontId: WotrFrontId,
    actions: WotrAction[]
  ): Promise<void> {
    await Promise.all(
      this.afterActionDieResolution.get().map(handler => handler(die, frontId, actions))
    );
  }

  clear() {
    this.actionDieChoices.clear();
  }
}
