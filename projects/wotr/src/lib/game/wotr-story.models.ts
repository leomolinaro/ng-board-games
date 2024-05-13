import { BgStoryDoc } from "@leobg/commons";
import { WotrActionDieAction, rollActionDice } from "../action-die/wotr-action-die-actions";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrArmyAction } from "../army/wotr-army-actions";
import { WotrCombatAction } from "../battle/wotr-combat-actions";
import { WotrCardAction } from "../card/wotr-card-actions";
import { WotrCardId, WotrCardLabel, labelToCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCompanionAction } from "../companion/wotr-companion-actions";
import { WotrCompanionId } from "../companion/wotr-companion.models";
import { WotrFellowshipAction } from "../fellowship/wotr-fellowship-actions";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntAction } from "../hunt/wotr-hunt-actions";
import { WotrMinionAction } from "../minion/wotr-minion-actions";
import { WotrMinionId } from "../minion/wotr-minion.models";
import { WotrArmyUnitType, WotrNationId } from "../nation/wotr-nation.models";
import { WotrPoliticalAction } from "../nation/wotr-political-actions";

export interface WotrPhaseStory { type: "phase"; actions: WotrAction[] }
export interface WotrBattleStory { type: "battle"; actions: WotrAction[] }
export interface WotrHuntStory { type: "hunt"; actions: WotrAction[] }
export interface WotrDieStory { type: "die"; die: WotrActionDie; actions: WotrAction[] }
export interface WotrDieCardStory { type: "die-card"; die: WotrActionDie; card: WotrCardId; actions: WotrAction[] }
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

export type WotrStory = WotrFlowStory | WotrActionDieStory | WotrActionTokenStory | WotrReactionStory;

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrStory>;

export type WotrAction =
  WotrCardAction |
  WotrFellowshipAction |
  WotrHuntAction |
  WotrActionDieAction |
  WotrCompanionAction |
  WotrMinionAction |
  WotrArmyAction |
  WotrPoliticalAction |
  WotrCombatAction;

export interface WotrArmy {
  minions?: WotrMinionId[];
  companions?: WotrCompanionId[];
  units: {
    quantity: number;
    type: WotrArmyUnitType | "leader" | "nazgul";
    nation: WotrNationId;
  }[];
}

export class WotrFrontStoryComposer {
  constructor (private front: WotrFrontId, private time: number) { }
  
  protected story () { return { time: this.time, playerId: this.front }; }

  phaseStory (...actions: WotrAction[]): WotrStoryDoc & WotrPhaseStory { return { type: "phase", actions, ...this.story () }; }
  rollActionDice (...dice: WotrActionDie[]): WotrStoryDoc { return this.phaseStory (rollActionDice (dice)); }
  battleStory (...actions: WotrAction[]): WotrStoryDoc & WotrBattleStory { return { type: "battle", actions, ...this.story () }; }
  huntStory (...actions: WotrAction[]): WotrStoryDoc & WotrHuntStory { return { type: "hunt", actions, ...this.story () }; }

  characterDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("character", ...actions); }
  eventDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("event", ...actions); }
  musterDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("muster", ...actions); }
  musterArmyDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("muster-army", ...actions); }
  armyDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("army", ...actions); }
  pass (): WotrStoryDoc & WotrPassStory { return { type: "die-pass", ...this.story () }; }
  protected actionDie (die: WotrActionDie, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, actions, ...this.story () }; }
  
  eventDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("event", card, ...actions); }
  characterDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("character", card, ...actions); }
  musterArmyDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("muster-army", card, ...actions); }
  protected actionDieCard (die: WotrActionDie, card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return { type: "die-card", die, card: labelToCardId (card), actions, ...this.story () }; }

  actionToken (token: WotrActionToken, ...actions: WotrAction[]): WotrStoryDoc & WotrTokenStory { return { type: "token", token, actions, ...this.story () }; }
  skipTokens (): WotrStoryDoc & WotrSkipTokensStory { return { type: "token-skip", ...this.story () }; }
  
  cardReaction (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrCardReactionStory { return { type: "reaction-card", card: labelToCardId (card), actions, ...this.story () }; }
  skipCardReaction (card: WotrCardLabel): WotrStoryDoc & WotrSkipCardReactionStory { return { type: "reaction-card-skip", card: labelToCardId (card), ...this.story () }; }
  combatCardReaction (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrCombatCardReactionStory { return { type: "reaction-combat-card", card: labelToCardId (card), actions, ...this.story () }; }
  skipCombatCardReaction (card: WotrCardLabel): WotrStoryDoc & WotrSkipCombatCardReactionStory { return { type: "reaction-combat-card-skip", card: labelToCardId (card), ...this.story () }; }
  characterReaction (character: WotrCharacterId, ...actions: WotrAction[]): WotrStoryDoc & WotrCharacterReactionStory { return { type: "reaction-character", character, actions, ...this.story () }; }
  skipCharacterReaction (character: WotrCharacterId, ...actions: WotrAction[]): WotrStoryDoc & WotrSkipCharacterReactionStory { return { type: "reaction-character-skip", character, ...this.story () }; }

}
export class WotrFreePeoplesStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("free-peoples", time); }
  willOfTheWestDie (...actions: WotrAction[]) { return this.actionDie ("will-of-the-west", ...actions); }
}
export class WotrShadowStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("shadow", time); }
  huntAllocation (nDice: number) { return this.phaseStory ({ type: "hunt-allocation", quantity: nDice }); }
}
