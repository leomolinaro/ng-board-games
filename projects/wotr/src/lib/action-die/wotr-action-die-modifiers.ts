import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrActionDie } from "./wotr-action-die-models";

export type WotrActionDieChoiceModifier = (
  die: WotrActionDie,
  frontId: WotrFrontId
) => WotrPlayerChoice[];

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

  clear() {
    this.actionDieChoices.clear();
  }
}
