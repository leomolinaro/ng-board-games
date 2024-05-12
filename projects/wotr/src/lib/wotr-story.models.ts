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
import { WotrActionDie, WotrActionToken } from "./wotr-elements/wotr-dice.models";

export interface WotrDieStory {
  die: WotrActionDie;
  actions: WotrAction[];
}

export interface WotrTokenStory {
  token: WotrActionToken;
  actions: WotrAction[];
}

export interface WotrCardStory {
  card: WotrCardId;
  actions: WotrAction[];
}

export interface WotrSimpleStory {
  actions: WotrAction[];
}

export type WotrDieCardStory = WotrDieStory & WotrCardStory;

export interface WotrPassStory {
  pass: true;
}

export interface WotrSkipTokensStory {
  skipTokens: true;
}

export interface WotrCombatCardStory {
  combatCard: WotrCardId;
  actions: WotrAction[];
}

export interface WotrSkipCombatCardStory {
  skipCombatCard: WotrCardId;
}

export type WotrStory =
  WotrDieStory | WotrTokenStory | WotrCardStory | WotrDieCardStory | WotrSimpleStory |
  WotrPassStory | WotrSkipTokensStory | WotrCombatCardStory | WotrSkipCombatCardStory;

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
  rollActionDice (...dice: WotrActionDie[]): WotrStoryDoc { return this.story (rollActionDice (dice)); }
  characterDie (...actions: WotrAction[]): WotrStoryDoc { return this.die ("character", ...actions); }
  eventDie (...actions: WotrAction[]): WotrStoryDoc { return this.die ("event", ...actions); }
  musterDie (...actions: WotrAction[]): WotrStoryDoc { return this.die ("muster", ...actions); }
  musterArmyDie (...actions: WotrAction[]): WotrStoryDoc { return this.die ("muster-army", ...actions); }
  armyDie (...actions: WotrAction[]): WotrStoryDoc { return this.die ("army", ...actions); }
  eventDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { die: "event", ...this.card (card, ...actions) }; }
  characterDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { die: "character", ...this.card (card, ...actions) }; }
  musterArmyDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { die: "muster-army", ...this.card (card, ...actions) }; }
  protected die (die: WotrActionDie, ...actions: WotrAction[]): WotrStoryDoc { return { die, ...this.story (...actions) }; }
  pass (): WotrStoryDoc { return { pass: true, ...this.story () }; }
  skipTokens (): WotrStoryDoc { return { skipTokens: true, ...this.story () }; }
  card (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { card: labelToCardId (card), ...this.story (...actions) }; }
  combatCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { combatCard: labelToCardId (card), ...this.story (...actions) }; }
  skipCombatCard (card: WotrCardLabel): WotrStoryDoc { return { skipCombatCard: labelToCardId (card), ...this.story () }; }
  token (token: WotrActionToken, ...actions: WotrAction[]): WotrStoryDoc { return { token, ...this.story (...actions) }; }
  story (...actions: WotrAction[]): WotrStoryDoc { return { time: this.time, playerId: this.front, actions }; }
}
export class WotrFreePeoplesStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("free-peoples", time); }
  willOfTheWestDie (...actions: WotrAction[]) { return this.die ("will-of-the-west", ...actions); }
}
export class WotrShadowStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("shadow", time); }
  huntAllocation (nDice: number) { return this.story ({ type: "hunt-allocation", quantity: nDice }); }
}
