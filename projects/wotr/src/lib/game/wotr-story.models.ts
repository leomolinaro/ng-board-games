import { BgStoryDoc } from "@leobg/commons";
import { WotrActionDieAction, rollActionDice } from "../action-die/wotr-action-die-actions";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrBattleAction } from "../battle/wotr-battle-actions";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCardAction } from "../card/wotr-card-actions";
import { WotrCardId, WotrCardLabel, labelToCardId } from "../card/wotr-card.models";
import { WotrCharacterAction } from "../character/wotr-character-actions";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrFellowshipAction } from "../fellowship/wotr-fellowship-actions";
import { WotrElvenRing, WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntAction, WotrHuntAllocationStory, WotrHuntEffectStory, WotrHuntReRollStory, WotrHuntRollStory, WotrHuntStory, WotrHuntTileDrawStory } from "../hunt/wotr-hunt-actions";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrNationAction } from "../nation/wotr-nation-actions";
import { WotrRegionAction } from "../region/wotr-region-actions";
import { WotrUnitAction } from "../unit/wotr-unit-actions";

export interface WotrPhaseStory { type: "phase"; actions: WotrGameAction[] }
export interface WotrBattleStory { type: "battle"; actions: WotrGameAction[] }
// export interface WotrHuntStory { type: "hunt"; actions: WotrGameAction[] }
export interface WotrDieStory { type: "die"; die: WotrActionDie; elvenRing?: WotrElvenRing; character?: WotrCharacterId; actions: WotrGameAction[] }
export interface WotrDieCardStory { type: "die-card"; die: WotrActionDie; elvenRing?: WotrElvenRing; card: WotrCardId; actions: WotrGameAction[] }
export interface WotrPassStory { type: "die-pass" }
export interface WotrTokenStory { type: "token"; token: WotrActionToken; actions: WotrGameAction[] }
export interface WotrSkipTokensStory { type: "token-skip" }
export interface WotrCardReactionStory { type: "reaction-card"; card: WotrCardId; actions: WotrGameAction[] }
export interface WotrSkipCardReactionStory { type: "reaction-card-skip"; card: WotrCardId }
export interface WotrCombatCardReactionStory { type: "reaction-combat-card"; card: WotrCardId; actions: WotrGameAction[] }
export interface WotrSkipCombatCardReactionStory { type: "reaction-combat-card-skip"; card: WotrCardId }
export interface WotrCharacterReactionStory { type: "reaction-character"; character: WotrCharacterId; actions: WotrGameAction[] }
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

export type WotrGameAction =
  WotrCardAction |
  WotrFellowshipAction |
  WotrHuntAction |
  WotrActionDieAction |
  WotrCharacterAction |
  WotrUnitAction |
  WotrNationAction |
  WotrBattleAction |
  WotrRegionAction;

export class WotrFrontStoryComposer {
  constructor (private front: WotrFrontId, private time: number) { }
  
  protected story () { return { time: this.time, playerId: this.front }; }

  phaseStory (...actions: WotrGameAction[]): WotrStoryDoc & WotrPhaseStory { return { type: "phase", actions, ...this.story () }; }
  rollActionDice (...dice: WotrActionDie[]): WotrStoryDoc { return this.phaseStory (rollActionDice (dice)); }
  battleStory (...actions: WotrGameAction[]): WotrStoryDoc & WotrBattleStory { return { type: "battle", actions, ...this.story () }; }

  characterDie (...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("character", ...actions); }
  eventDie (...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("event", ...actions); }
  musterDie (...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("muster", ...actions); }
  musterArmyDie (...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("muster-army", ...actions); }
  armyDie (...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("army", ...actions); }
  pass (): WotrStoryDoc & WotrPassStory { return { type: "die-pass", ...this.story () }; }
  protected actionDie (die: WotrActionDie, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, actions, ...this.story () }; }
  
  characterElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("character", elvenRing, ...actions); }
  eventElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("event", elvenRing, ...actions); }
  musterElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("muster", elvenRing, ...actions); }
  musterArmyElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("muster-army", elvenRing, ...actions); }
  armyElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("army", elvenRing, ...actions); }
  protected actionElvenRingDie (die: WotrActionDie, elvenRing: WotrElvenRing, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, elvenRing, actions, ...this.story () }; }
  
  musterAbilityDie (character: WotrCharacterId, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionAbilityDie ("muster", character, ...actions); }
  musterArmyAbilityDie (character: WotrCharacterId, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return this.actionAbilityDie ("muster-army", character, ...actions); }
  protected actionAbilityDie (die: WotrActionDie, character: WotrCharacterId, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, character, actions, ...this.story () }; }

  eventDieCard (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("event", card, ...actions); }
  characterDieCard (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("character", card, ...actions); }
  musterDieCard (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("muster", card, ...actions); }
  armyDieCard (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("army", card, ...actions); }
  musterArmyDieCard (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("muster-army", card, ...actions); }
  protected actionDieCard (die: WotrActionDie, card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrDieCardStory { return { type: "die-card", die, card: labelToCardId (card), actions, ...this.story () }; }

  actionToken (token: WotrActionToken, ...actions: WotrGameAction[]): WotrStoryDoc & WotrTokenStory { return { type: "token", token, actions, ...this.story () }; }
  skipTokens (): WotrStoryDoc & WotrSkipTokensStory { return { type: "token-skip", ...this.story () }; }
  
  cardReaction (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrCardReactionStory { return { type: "reaction-card", card: labelToCardId (card), actions, ...this.story () }; }
  skipCardReaction (card: WotrCardLabel): WotrStoryDoc & WotrSkipCardReactionStory { return { type: "reaction-card-skip", card: labelToCardId (card), ...this.story () }; }
  combatCardReaction (card: WotrCardLabel, ...actions: WotrGameAction[]): WotrStoryDoc & WotrCombatCardReactionStory { return { type: "reaction-combat-card", card: labelToCardId (card), actions, ...this.story () }; }
  skipCombatCardReaction (card: WotrCardLabel): WotrStoryDoc & WotrSkipCombatCardReactionStory { return { type: "reaction-combat-card-skip", card: labelToCardId (card), ...this.story () }; }
  characterReaction (character: WotrCharacterId, ...actions: WotrGameAction[]): WotrStoryDoc & WotrCharacterReactionStory { return { type: "reaction-character", character, actions, ...this.story () }; }
  skipCharacterReaction (character: WotrCharacterId, ...actions: WotrGameAction[]): WotrStoryDoc & WotrSkipCharacterReactionStory { return { type: "reaction-character-skip", character, ...this.story () }; }

}
export class WotrFreePeoplesStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("free-peoples", time); }
  willOfTheWestDie (...actions: WotrGameAction[]) { return this.actionDie ("will-of-the-west", ...actions); }
  huntEffect (...actions: WotrGameAction[]): WotrStoryDoc & WotrHuntEffectStory { return { type: "hunt-effect", actions, ...this.story () }; }
}
export class WotrShadowStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("shadow", time); }
  huntAllocation (nDice: number): WotrStoryDoc & WotrHuntAllocationStory { return { type: "hunt-allocation", quantity: nDice, ...this.story () }; }
  rollHuntDice (...dice: WotrCombatDie[]): WotrStoryDoc & WotrHuntRollStory { return { type: "hunt-roll", dice, ...this.story () }; }
  reRollHuntDice (...dice: WotrCombatDie[]): WotrStoryDoc & WotrHuntReRollStory { return { type: "hunt-re-roll", dice, ...this.story () }; }
  drawHuntTile (tile: WotrHuntTileId): WotrStoryDoc & WotrHuntTileDrawStory { return { type: "hunt-tile-draw", tile, ...this.story () }; }
}

export class WotrStoriesBuilder {
  private time = 1;
  fp () { return new WotrFreePeoplesStoryComposer (this.time++); }
  s () { return new WotrShadowStoryComposer (this.time++); }
  fpT () { return new WotrFreePeoplesStoryComposer (this.time); }
  sT () { return new WotrShadowStoryComposer (this.time); }
}
