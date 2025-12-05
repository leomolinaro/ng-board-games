import { BgStoryDoc, unexpectedStory } from "@leobg/commons";
import { WotrActionDie, WotrActionToken } from "../action-die/wotr-action-die-models";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { findAction, WotrAction } from "../commons/wotr-action-models";
import { WotrElvenRing, WotrFrontId } from "../front/wotr-front-models";

export interface WotrBaseStory {
  type: "base";
  actions: WotrAction[];
}
export interface WotrDieStory {
  type: "die";
  die: WotrActionDie;
  elvenRing?: WotrElvenRingAction;
  character?: WotrCharacterId;
  actions: WotrAction[];
}
export interface WotrDieCardStory {
  type: "die-card";
  die: WotrActionDie;
  elvenRing?: WotrElvenRingAction;
  card: WotrCardId;
  actions: WotrAction[];
}
export interface WotrPassStory {
  type: "die-pass";
  elvenRing?: WotrElvenRingAction;
}
export interface WotrTokenStory {
  type: "token";
  token: WotrActionToken;
  actions: WotrAction[];
  elvenRing?: WotrElvenRingAction;
}
export interface WotrSkipTokensStory {
  type: "token-skip";
  elvenRing?: WotrElvenRingAction;
}
export interface WotrElvenRingAction {
  ring: WotrElvenRing;
  fromDie: WotrActionDie;
  toDie: WotrActionDie;
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

// TODO rename in "effect"
export type WotrReactionStory =
  | WotrCardReactionStory
  | WotrSkipCardReactionStory
  | WotrCombatCardReactionStory
  | WotrSkipCombatCardReactionStory
  | WotrCharacterReactionStory
  | WotrSkipCharacterReactionStory;

export type WotrStory =
  | WotrBaseStory
  | WotrTokenStory
  | WotrSkipTokensStory
  | WotrReactionStory
  | WotrDieStory
  | WotrDieCardStory
  | WotrPassStory;

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrStory>;

export function filterActions<A extends WotrAction>(
  story: WotrStory,
  ...actionTypes: A["type"][]
): A[] {
  const actions = assertActionsStory(story);
  const foundActions = actions.filter(a => actionTypes.includes(a.type)) as A[];
  if (foundActions.length) return foundActions;
  throw unexpectedStory(story, actionTypes.join(" or "));
}

export function assertAction<A extends WotrAction>(
  story: WotrStory,
  ...actionTypes: A["type"][]
): A {
  const actions = assertActionsStory(story);
  const foundAction = findAction<A>(actions, ...actionTypes);
  if (foundAction) return foundAction;
  throw unexpectedStory(story, actionTypes.join(" or "));
}

export function assertActionsStory(story: WotrStory): WotrAction[] {
  if ("actions" in story) return story.actions;
  throw unexpectedStory(story, "some actions");
}
