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
export interface WotrCardEffectStory {
  type: "card-effect";
  card: WotrCardId;
  actions: WotrAction[];
}
export interface WotrSkipCardEffectStory {
  type: "card-effect-skip";
  card: WotrCardId;
}
export interface WotrCombatCardEffectStory {
  type: "combat-card-effect";
  card: WotrCardId;
  actions: WotrAction[];
}
export interface WotrSkipCombatCardEffectStory {
  type: "combat-card-effect-skip";
  card: WotrCardId;
}
export interface WotrCharacterEffectStory {
  type: "character-effect";
  character: WotrCharacterId;
  actions: WotrAction[];
}
export interface WotrSkipCharacterEffectStory {
  type: "character-effect-skip";
  character: WotrCharacterId;
}

export type WotrEffectStory =
  | WotrCardEffectStory
  | WotrSkipCardEffectStory
  | WotrCombatCardEffectStory
  | WotrSkipCombatCardEffectStory
  | WotrCharacterEffectStory
  | WotrSkipCharacterEffectStory;

export type WotrStory =
  | WotrBaseStory
  | WotrTokenStory
  | WotrSkipTokensStory
  | WotrEffectStory
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
