import { BgStoryDoc } from "@leobg/commons";
import { WotrActionDiceAction, rollActionDice } from "./wotr-actions/wotr-action-dice-actions";
import { WotrArmyAction } from "./wotr-actions/wotr-army-actions";
import { WotrCardAction } from "./wotr-actions/wotr-card-actions";
import { WotrCombatAction } from "./wotr-actions/wotr-combat-actions";
import { WotrCompanionAction } from "./wotr-actions/wotr-companion-actions";
import { WotrFellowshipAction } from "./wotr-actions/wotr-fellowship-actions";
import { WotrHuntAction } from "./wotr-actions/wotr-hunt-actions";
import { WotrMinionAction } from "./wotr-actions/wotr-minion-actions";
import { WotrPoliticalAction } from "./wotr-actions/wotr-political-actions";
import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-elements/wotr-card.models";
import { WotrCompanionId } from "./wotr-elements/wotr-companion.models";
import { WotrActionDie, WotrActionToken } from "./wotr-elements/wotr-dice.models";
import { WotrFrontId } from "./wotr-elements/wotr-front.models";
import { WotrMinionId } from "./wotr-elements/wotr-minion.models";
import { WotrArmyUnitType, WotrNationId } from "./wotr-elements/wotr-nation.models";

export interface WotrStory {
  die?: WotrActionDie;
  token?: WotrActionToken;
  card?: WotrCardId;
  pass?: boolean;
  actions: WotrAction[];
}

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrStory>;

export type WotrAction =
  WotrCardAction |
  WotrFellowshipAction |
  WotrHuntAction |
  WotrActionDiceAction |
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
  rollActionDice (...dice: WotrActionDie[]) { return this.story (rollActionDice (dice)); }
  characterDie (...actions: WotrAction[]) { return this.die ("character", ...actions); }
  eventDie (...actions: WotrAction[]) { return this.die ("event", ...actions); }
  musterDie (...actions: WotrAction[]) { return this.die ("muster", ...actions); }
  musterArmyDie (...actions: WotrAction[]) { return this.die ("muster-army", ...actions); }
  armyDie (...actions: WotrAction[]) { return this.die ("army", ...actions); }
  eventDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { die: "event", ...this.card (card, ...actions) }; }
  characterDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { die: "character", ...this.card (card, ...actions) }; }
  musterArmyDieCard (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { die: "muster-army", ...this.card (card, ...actions) }; }
  protected die (die: WotrActionDie, ...actions: WotrAction[]): WotrStoryDoc { return { die, ...this.story (...actions) }; }
  pass () { return { pass: true, ...this.story () }; }
  card (card: WotrCardLabel, ...actions: WotrAction[]): WotrStoryDoc { return { card: labelToCardId (card), ...this.story (...actions) }; }
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
