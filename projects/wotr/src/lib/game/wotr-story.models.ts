import { BgStoryDoc } from "@leobg/commons";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrElvenRing, WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntStory } from "../hunt/wotr-hunt-actions";

export interface WotrPhaseStory { type: "phase"; actions: WotrAction[] }
export interface WotrBattleStory { type: "battle"; actions: WotrAction[] }
export interface WotrDieStory { type: "die"; die: WotrActionDie; elvenRing?: WotrElvenRing; character?: WotrCharacterId; actions: WotrAction[] }
export interface WotrDieCardStory { type: "die-card"; die: WotrActionDie; elvenRing?: WotrElvenRing; card: WotrCardId; actions: WotrAction[] }
export interface WotrPassStory { type: "die-pass" }
export interface WotrTokenStory { type: "token"; token: WotrActionToken; actions: WotrAction[] }
export interface WotrSkipTokensStory { type: "token-skip" }
export interface WotrCardReactionStory { type: "reaction-card"; card: WotrCardId; actions: WotrAction[] }
export interface WotrSkipCardReactionStory { type: "reaction-card-skip"; card: WotrCardId }
export interface WotrCombatCardReactionStory { type: "reaction-combat-card"; card: WotrCardId; actions: WotrAction[] }
export interface WotrSkipCombatCardReactionStory { type: "reaction-combat-card-skip"; card: WotrCardId }
export interface WotrCharacterReactionStory { type: "reaction-character"; character: WotrCharacterId; actions: WotrAction[] }
export interface WotrSkipCharacterReactionStory { type: "reaction-character-skip"; character: WotrCharacterId }

export type WotrFlowStory = WotrPhaseStory | WotrBattleStory | WotrHuntStory;
export type WotrActionDieStory = WotrDieStory | WotrDieCardStory | WotrPassStory;
export type WotrActionTokenStory = WotrTokenStory | WotrSkipTokensStory;
export type WotrReactionStory =
  WotrCardReactionStory | WotrSkipCardReactionStory |
  WotrCombatCardReactionStory | WotrSkipCombatCardReactionStory |
  WotrCharacterReactionStory | WotrSkipCharacterReactionStory;

export type WotrGameStory = WotrFlowStory | WotrActionDieStory | WotrActionTokenStory | WotrReactionStory;

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrGameStory>;
