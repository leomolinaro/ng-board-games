import { Injectable } from "@angular/core";
import { WotrModifier } from "../commons/wotr-modifier";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrUiChoice } from "../game/wotr-game-ui";
import { WotrDieCardStory, WotrDieStory } from "../game/wotr-story-models";
import { WotrActionDie, WotrActionDieResult } from "./wotr-action-die-models";

export type WotrActionDieChoiceModifier = (params: WotrActionDieChoiceParams) => WotrUiChoice[];

export interface WotrActionDieChoiceParams {
  die: WotrActionDie;
  dieResult: WotrActionDieResult;
  frontId: WotrFrontId;
}

export type WotrAfterActionDieResolution = (
  story: WotrDieStory,
  frontId: WotrFrontId
) => Promise<void>;

export type WotrAfterActionDieCardResolution = (
  story: WotrDieCardStory,
  frontId: WotrFrontId
) => Promise<void>;

@Injectable()
export class WotrActionDieModifiers {
  public readonly actionDieChoices = new WotrModifier<WotrActionDieChoiceModifier>();
  public getActionDieChoices(die: WotrActionDie, frontId: WotrFrontId): WotrUiChoice[] {
    const params: WotrActionDieChoiceParams = {
      die,
      dieResult: typeof die === "string" ? die : die.result,
      frontId
    };
    return this.actionDieChoices
      .get()
      .reduce<WotrUiChoice[]>((choices, modifier) => choices.concat(modifier(params)), []);
  }

  public readonly afterActionDieResolution = new WotrModifier<WotrAfterActionDieResolution>();
  async onAfterActionDieResolution(story: WotrDieStory, frontId: WotrFrontId): Promise<void> {
    await Promise.all(this.afterActionDieResolution.get().map(handler => handler(story, frontId)));
  }

  public readonly afterActionDieCardResolution =
    new WotrModifier<WotrAfterActionDieCardResolution>();
  async onAfterActionDieCardResolution(
    story: WotrDieCardStory,
    frontId: WotrFrontId
  ): Promise<void> {
    await Promise.all(
      this.afterActionDieCardResolution.get().map(handler => handler(story, frontId))
    );
  }

  clear() {
    this.actionDieChoices.clear();
    this.afterActionDieResolution.clear();
    this.afterActionDieCardResolution.clear();
  }
}
