import { BgStoryDoc, unexpectedStory } from "@leobg/commons";
import { WotrActionDie, WotrActionToken } from "../action-die/wotr-action-die-models";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrElvenRing, WotrFrontId } from "../front/wotr-front-models";

export interface WotrPhaseStory {
  type: "phase";
  actions: WotrAction[];
}
export interface WotrBattleStory {
  type: "battle";
  actions: WotrAction[];
}
export interface WotrHuntStory {
  type: "hunt";
  actions: WotrAction[];
}
export interface WotrDieStory {
  type: "die";
  die: WotrActionDie;
  elvenRing?: WotrElvenRing;
  character?: WotrCharacterId;
  actions: WotrAction[];
}
export interface WotrDieCardStory {
  type: "die-card";
  die: WotrActionDie;
  elvenRing?: WotrElvenRing;
  card: WotrCardId;
  actions: WotrAction[];
}
export interface WotrPassStory {
  type: "die-pass";
}
export interface WotrTokenStory {
  type: "token";
  token: WotrActionToken;
  actions: WotrAction[];
}
export interface WotrSkipTokensStory {
  type: "token-skip";
}
export interface WotrCardReactionStory {
  type: "reaction-card";
  card: WotrCardId;
  actions: WotrAction[];
}
export interface WotrSkipCardReactionStory {
  type: "reaction-card-skip";
  card: WotrCardId;
}
export interface WotrCombatCardReactionStory {
  type: "reaction-combat-card";
  card: WotrCardId;
  actions: WotrAction[];
}
export interface WotrSkipCombatCardReactionStory {
  type: "reaction-combat-card-skip";
  card: WotrCardId;
}
export interface WotrCharacterReactionStory {
  type: "reaction-character";
  character: WotrCharacterId;
  actions: WotrAction[];
}
export interface WotrSkipCharacterReactionStory {
  type: "reaction-character-skip";
  character: WotrCharacterId;
}

export type WotrReactionStory =
  | WotrCardReactionStory
  | WotrSkipCardReactionStory
  | WotrCombatCardReactionStory
  | WotrSkipCombatCardReactionStory
  | WotrCharacterReactionStory
  | WotrSkipCharacterReactionStory;

export type WotrGameStory =
  | WotrPhaseStory
  | WotrBattleStory
  | WotrHuntStory
  | WotrTokenStory
  | WotrSkipTokensStory
  | WotrReactionStory
  | WotrDieStory
  | WotrDieCardStory
  | WotrPassStory;

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrGameStory>;

export function filterActions<A extends WotrAction>(
  story: WotrGameStory,
  ...actionTypes: A["type"][]
): A[] {
  const actions = assertActionsStory(story);
  const foundActions = actions.filter(a => actionTypes.includes(a.type)) as A[];
  if (foundActions.length) {
    return foundActions;
  }
  throw unexpectedStory(story, actionTypes.join(" or "));
}

export function findAction<A extends WotrAction>(
  story: WotrGameStory,
  ...actionTypes: A["type"][]
): A {
  const actions = assertActionsStory(story);
  const foundAction = actions.find(a => actionTypes.includes(a.type)) as A;
  if (foundAction) {
    return foundAction;
  }
  throw unexpectedStory(story, actionTypes.join(" or "));
}

export function assertActionsStory(story: WotrGameStory): WotrAction[] {
  if ("actions" in story) {
    return story.actions;
  }
  throw unexpectedStory(story, "some actions");
}
