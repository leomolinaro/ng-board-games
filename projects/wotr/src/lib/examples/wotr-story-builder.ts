import { WotrActionRoll } from "../action-die/wotr-action-die-actions";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCardDiscard, WotrCardDraw } from "../card/wotr-card-actions";
import { WotrCardLabel, labelToCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFellowshipDeclare, WotrFellowshipDeclareNot } from "../fellowship/wotr-fellowship-actions";
import { WotrElvenRing, WotrFrontId } from "../front/wotr-front.models";
import { WotrBattleStory, WotrCardReactionStory, WotrCharacterReactionStory, WotrCombatCardReactionStory, WotrDieCardStory, WotrDieStory, WotrPassStory, WotrSkipCardReactionStory, WotrSkipCharacterReactionStory, WotrSkipCombatCardReactionStory, WotrSkipTokensStory, WotrStoryDoc, WotrTokenStory } from "../game/wotr-story.models";
import { WotrHuntAllocation, WotrHuntEffect, WotrHuntReRoll, WotrHuntRoll, WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrRegionId } from "../region/wotr-region.models";

export class WotrFrontStoryComposer {
  constructor (private front: WotrFrontId, private time: number) { }
  
  protected story () { return { time: this.time, playerId: this.front }; }

  rollActionDice (...dice: WotrActionDie[]): WotrStoryDoc & WotrActionRoll { return { type: "action-roll", dice, ...this.story () }; }
  battleStory (...actions: WotrAction[]): WotrStoryDoc & WotrBattleStory { return { type: "battle", actions, ...this.story () }; }

  drawCards (card1: WotrCardLabel): WotrStoryDoc & WotrCardDraw;
  drawCards (card1: WotrCardLabel, card2: WotrCardLabel): WotrStoryDoc & WotrCardDraw;
  drawCards (card1: WotrCardLabel, discarded: WotrCardDiscard): WotrStoryDoc & WotrCardDraw;
  drawCards (card1: WotrCardLabel, card2: WotrCardLabel, discarded: WotrCardDiscard): WotrStoryDoc & WotrCardDraw;
  drawCards (...args: (WotrCardLabel | WotrCardDiscard)[]): WotrCardDraw {
    const drawCardAction: WotrCardDraw = { type: "card-draw", cards: [] };
    for (const arg of args) {
      if (typeof arg === "string") {
        drawCardAction.cards.push (labelToCardId (arg));
      } else {
        drawCardAction.discarded = arg.cards;
      }
    }
    return { ...drawCardAction, ...this.story () };
  }

  characterDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("character", ...actions); }
  eventDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("event", ...actions); }
  musterDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("muster", ...actions); }
  musterArmyDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("muster-army", ...actions); }
  armyDie (...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionDie ("army", ...actions); }
  pass (): WotrStoryDoc & WotrPassStory { return { type: "die-pass", ...this.story () }; }
  protected actionDie (die: WotrActionDie, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, actions, ...this.story () }; }
  
  characterElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("character", elvenRing, ...actions); }
  eventElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("event", elvenRing, ...actions); }
  musterElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("muster", elvenRing, ...actions); }
  musterArmyElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("muster-army", elvenRing, ...actions); }
  armyElvenRingDie (elvenRing: WotrElvenRing, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionElvenRingDie ("army", elvenRing, ...actions); }
  protected actionElvenRingDie (die: WotrActionDie, elvenRing: WotrElvenRing, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, elvenRing, actions, ...this.story () }; }
  
  musterAbilityDie (character: WotrCharacterId, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionAbilityDie ("muster", character, ...actions); }
  musterArmyAbilityDie (character: WotrCharacterId, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return this.actionAbilityDie ("muster-army", character, ...actions); }
  protected actionAbilityDie (die: WotrActionDie, character: WotrCharacterId, ...actions: WotrAction[]): WotrStoryDoc & WotrDieStory { return { type: "die", die, character, actions, ...this.story () }; }

  eventDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("event", card, ...actions); }
  characterDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("character", card, ...actions); }
  musterDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("muster", card, ...actions); }
  armyDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc & WotrDieCardStory { return this.actionDieCard ("army", card, ...actions); }
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
  huntEffect (...actions: WotrAction[]): WotrStoryDoc & WotrHuntEffect { return { type: "hunt-effect", actions, ...this.story () }; }
  notDeclareFellowship (): WotrStoryDoc & WotrFellowshipDeclareNot { return { type: "fellowship-declare-not", ...this.story () }; }
  declareFellowship (region: WotrRegionId): WotrStoryDoc & WotrFellowshipDeclare { return { type: "fellowship-declare", region, ...this.story () }; }
}
export class WotrShadowStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("shadow", time); }
  huntAllocation (nDice: number): WotrStoryDoc & WotrHuntAllocation { return { type: "hunt-allocation", quantity: nDice, ...this.story () }; }
  rollHuntDice (...dice: WotrCombatDie[]): WotrStoryDoc & WotrHuntRoll { return { type: "hunt-roll", dice, ...this.story () }; }
  reRollHuntDice (...dice: WotrCombatDie[]): WotrStoryDoc & WotrHuntReRoll { return { type: "hunt-re-roll", dice, ...this.story () }; }
  drawHuntTile (tile: WotrHuntTileId): WotrStoryDoc & WotrHuntTileDraw { return { type: "hunt-tile-draw", tile, ...this.story () }; }
}

export class WotrStoriesBuilder {
  private time = 1;
  fp () { return new WotrFreePeoplesStoryComposer (this.time++); }
  s () { return new WotrShadowStoryComposer (this.time++); }
  fpT () { return new WotrFreePeoplesStoryComposer (this.time); }
  sT () { return new WotrShadowStoryComposer (this.time); }
}
