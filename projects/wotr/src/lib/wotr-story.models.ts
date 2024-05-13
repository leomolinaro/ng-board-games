import { BgStoryDoc } from "@leobg/commons";
import { WotrActionDieAction, rollActionDice } from "./wotr-actions/action-die/wotr-action-die-actions";
import { WotrArmyAction } from "./wotr-actions/army/wotr-army-actions";
import { WotrCardAction } from "./wotr-actions/card/wotr-card-actions";
import { WotrCombatAction } from "./wotr-actions/combat/wotr-combat-actions";
import { WotrCompanionAction } from "./wotr-actions/companion/wotr-companion-actions";
import { WotrFellowshipAction } from "./wotr-actions/fellowship/wotr-fellowship-actions";
import { WotrHuntAction } from "./wotr-actions/hunt/wotr-hunt-actions";
import { WotrMinionAction } from "./wotr-actions/minion/wotr-minion-actions";
import { WotrPoliticalAction } from "./wotr-actions/political/wotr-political-actions";
import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-elements/card/wotr-card.models";
import { WotrCompanionId } from "./wotr-elements/companion/wotr-companion.models";
import { WotrFrontId } from "./wotr-elements/front/wotr-front.models";
import { WotrMinionId } from "./wotr-elements/minion/wotr-minion.models";
import { WotrArmyUnitType, WotrNationId } from "./wotr-elements/nation/wotr-nation.models";
import { WotrCharacterId } from "./wotr-elements/wotr-character.models";
import { WotrActionDie, WotrActionToken } from "./wotr-elements/wotr-dice.models";

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
