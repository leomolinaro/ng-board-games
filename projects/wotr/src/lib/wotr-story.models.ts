import { BgStoryDoc } from "@leobg/commons";
import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-elements/wotr-card.models";
import { WotrCompanionId } from "./wotr-elements/wotr-companion.models";
import { WotrActionDie, WotrActionToken, WotrCombatDie } from "./wotr-elements/wotr-dice.models";
import { WotrFrontId } from "./wotr-elements/wotr-front.models";
import { WotrHuntTile } from "./wotr-elements/wotr-hunt.models";
import { WotrMinionId } from "./wotr-elements/wotr-minion.models";
import { WotrArmyUnitType, WotrNationId, WotrUnitType } from "./wotr-elements/wotr-nation.models";
import { WotrRegionId } from "./wotr-elements/wotr-region.models";

export interface WotrStory {
  die?: WotrActionDie;
  token?: WotrActionToken;
  card?: WotrCardId;
  actions: WotrStoryAction[];
}

export type WotrStoryDoc = BgStoryDoc<WotrFrontId, WotrStory>;

export type WotrStoryAction =
  WotrCardDraw | WotrCardDiscard | WotrCardPlayOnTable | WotrCardRandomDiscard | WotrCardDiscardFromTable |
  WotrFellowshipDeclare | WotrFellowshipDeclareNot | WotrFellowhipProgress | WotrFellowhipCorruption | WotrFellowhipHide | WotrFellowhipReveal | WotrFellowshipGuide |
  WotrHuntAllocation | WotrHuntRoll | WotrHuntTileDraw | WotrHuntTileAdd |
  WotrActionRoll | WotrActionPass | WotrActionDiceDiscard |
  WotrCompanionSeparation | WotrCompanionMovement | WotrCompanionRandom | WotrCompanionElimination | WotrCompanionPlay |
  WotrMinionMovement | WotrMinionElimination | WotrNazgulMovement | WotrMinionPlay |
  WotrArmyMovement | WotrUnitRecruitment | WotrUnitElimination |
  WotrPoliticalAdvance | WotrPoliticalActivation |
  WotrArmyAttack | WotrCombatCardChoose | WotrCombatCardChooseNot | WotrCombatRoll | WotrArmyRetreatIntoSiege;

function labelsToCards (labels: WotrCardLabel[]): WotrCardId[] { return labels.map (label => labelToCardId (label)); }

export interface WotrCardDraw { type: "card-draw"; cards: WotrCardId[] }
export function drawCards (...cards: WotrCardLabel[]): WotrCardDraw { return { type: "card-draw", cards: labelsToCards (cards) }; }
export interface WotrCardDiscard { type: "card-discard"; cards: WotrCardId[] }
export function discardCards (...cards: WotrCardLabel[]): WotrCardDiscard { return { type: "card-discard", cards: labelsToCards (cards) }; }
export interface WotrCardPlayOnTable { type: "card-play-on-table"; cards: WotrCardId[] }
export function playCardOnTable (...cards: WotrCardLabel[]): WotrCardPlayOnTable { return { type: "card-play-on-table", cards: labelsToCards (cards) }; }
export interface WotrCardRandomDiscard { type: "card-random-discard"; cards: WotrCardId[] }
export function discardRandomCards (...cards: WotrCardLabel[]): WotrCardRandomDiscard { return { type: "card-random-discard", cards: labelsToCards (cards) }; }
export interface WotrCardDiscardFromTable { type: "card-discard-from-table"; cards: WotrCardId[] }
export function discardCardFromTable (...cards: WotrCardLabel[]): WotrCardDiscardFromTable { return { type: "card-discard-from-table", cards: labelsToCards (cards) }; }

export interface WotrFellowshipDeclare { type: "fellowship-declare"; region: WotrRegionId }
export function declareFellowship (region: WotrRegionId): WotrFellowshipDeclare { return { type: "fellowship-declare", region }; }
export interface WotrFellowshipDeclareNot { type: "fellowship-declare-not" }
export function notDeclareFellowship (): WotrFellowshipDeclareNot { return { type: "fellowship-declare-not" }; }
export interface WotrFellowhipProgress { type: "fellowship-progress" }
export function moveFelloswhip (): WotrFellowhipProgress { return { type: "fellowship-progress" }; }
export interface WotrFellowhipCorruption { type: "fellowship-corruption"; quantity: number }
export function corruptFelloswhip (quantity: number): WotrFellowhipCorruption { return { type: "fellowship-corruption", quantity }; }
export interface WotrFellowhipHeal { type: "fellowship-heal"; quantity: number }
export function healFellowship (quantity: number): WotrFellowhipHeal { return { type: "fellowship-heal", quantity }; }
export interface WotrFellowhipHide { type: "fellowship-hide" }
export function hideFellowship (): WotrFellowhipHide { return { type: "fellowship-hide" }; }
export interface WotrFellowhipReveal { type: "fellowship-reveal"; region: WotrRegionId }
export function revealFellowship (region: WotrRegionId): WotrFellowhipReveal { return { type: "fellowship-reveal", region }; }
export interface WotrFellowshipGuide { type: "fellowship-guide"; companion: WotrCompanionId }
export function changeGuide (companion: WotrCompanionId): WotrFellowshipGuide { return { type: "fellowship-guide", companion }; }

export interface WotrHuntAllocation { type: "hunt-allocation"; quantity: number }
export function allocateHuntDice (quantity: number): WotrHuntAllocation { return { type: "hunt-allocation", quantity }; }
export interface WotrHuntRoll { type: "hunt-roll"; dice: WotrCombatDie[] }
export function rollHuntDice (...dice: WotrCombatDie[]): WotrHuntRoll { return { type: "hunt-roll", dice }; }
export interface WotrHuntTileDraw { type: "hunt-tile-draw"; tile: WotrHuntTile }
export function drawHuntTile (tile: WotrHuntTile): WotrHuntTileDraw { return { type: "hunt-tile-draw", tile }; }
export interface WotrHuntTileAdd { type: "hunt-tile-add"; tile: WotrHuntTile }
export function addHuntTile (tile: WotrHuntTile): WotrHuntTileAdd { return { type: "hunt-tile-add", tile }; }

export interface WotrActionRoll { type: "action-roll"; dice: WotrActionDie[] }
export function rollActionDice (dice: WotrActionDie[]): WotrActionRoll { return { type: "action-roll", dice }; }
export interface WotrActionPass { type: "action-pass" }
export function passAction (): WotrActionPass { return { type: "action-pass" }; }
export interface WotrActionDiceDiscard { type: "action-dice-discard"; front: WotrFrontId; dice: WotrActionDie[] }
export function discardDice (front: WotrFrontId, ...dice: WotrActionDie[]): WotrActionDiceDiscard { return { type: "action-dice-discard", front, dice }; }

export interface WotrCompanionSeparation { type: "companion-separation"; companions: WotrCompanionId[]; toRegion: WotrRegionId }
export function separateCompanions (toRegion: WotrRegionId, ...companions: WotrCompanionId[]): WotrCompanionSeparation { return { type: "companion-separation", companions, toRegion }; }
export interface WotrCompanionMovement { type: "companion-movement"; companions: WotrCompanionId[]; toRegion: WotrRegionId }
export function moveCompanions (toRegion: WotrRegionId, ...companions: WotrCompanionId[]): WotrCompanionMovement { return { type: "companion-movement", companions, toRegion }; }
export interface WotrCompanionRandom { type: "companion-random"; companions: WotrCompanionId[] }
export function chooseRandomCompanion (...companions: WotrCompanionId[]): WotrCompanionRandom { return { type: "companion-random", companions }; }
export interface WotrCompanionElimination { type: "companion-elimination"; companions: WotrCompanionId[] }
export function eliminateCompanion (...companions: WotrCompanionId[]): WotrCompanionElimination { return { type: "companion-elimination", companions }; }
export interface WotrCompanionPlay { type: "companion-play"; companions: WotrCompanionId[]; region: WotrRegionId }
export function playCompanion (region: WotrRegionId, ...companions: WotrCompanionId[]): WotrCompanionPlay { return { type: "companion-play", region, companions }; }

export interface WotrMinionMovement { type: "minion-movement"; minions: WotrMinionId[]; fromRegion: WotrRegionId, toRegion: WotrRegionId }
export function moveMinions (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...minions: WotrMinionId[]): WotrMinionMovement { return { type: "minion-movement", minions, fromRegion, toRegion }; }
export interface WotrMinionElimination { type: "minion-elimination"; minions: WotrMinionId[] }
export function eliminateMinion (...minions: WotrMinionId[]): WotrMinionElimination { return { type: "minion-elimination", minions }; }
export interface WotrNazgulMovement { type: "nazgul-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; nNazgul: number }
export function moveNazguls (fromRegion: WotrRegionId, toRegion: WotrRegionId, nNazgul: number = 1): WotrNazgulMovement { return { type: "nazgul-movement", fromRegion, toRegion, nNazgul }; }
export interface WotrMinionPlay { type: "minion-play"; minions: WotrMinionId[]; region: WotrRegionId }
export function playMinion (region: WotrRegionId, ...minions: WotrMinionId[]): WotrMinionPlay { return { type: "minion-play", region, minions }; }

export interface WotrArmyMovement { type: "army-movement"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export function moveArmy (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyMovement { return { type: "army-movement", fromRegion, toRegion, army: army (...comp) }; }
export interface WotrUnitRecruitment { type: "unit-recruitment"; region: WotrRegionId; unitType: WotrUnitType; quantity: number; nation: WotrNationId }
export function recruitUnit (region: WotrRegionId, comp: WotrGenericUnitsComposer): WotrUnitRecruitment { return { type: "unit-recruitment", region, ...comp.recruited () }; }
export interface WotrUnitElimination { type: "unit-elimination"; region: WotrRegionId; unitType: WotrUnitType; quantity: number; nation: WotrNationId }
export function eliminateUnit (region: WotrRegionId, comp: WotrGenericUnitsComposer): WotrUnitElimination { return { type: "unit-elimination", region, ...comp.recruited () }; }

export interface WotrArmyAttack { type: "army-attack"; fromRegion: WotrRegionId; toRegion: WotrRegionId; army: WotrArmy }
export function attack (fromRegion: WotrRegionId, toRegion: WotrRegionId, ...comp: WotrUnitComposer[]): WotrArmyAttack { return { type: "army-attack", fromRegion, toRegion, army: army (...comp) }; }
export interface WotrCombatCardChoose { type: "combat-card-choose"; card: WotrCardId }
export function combatCard (card: WotrCardLabel): WotrCombatCardChoose { return { type: "combat-card-choose", card: labelToCardId (card) }; }
export interface WotrCombatCardChooseNot { type: "combat-card-choose-not" }
export function noCombatCard (): WotrCombatCardChooseNot { return { type: "combat-card-choose-not" }; }
export interface WotrCombatRoll { type: "combat-roll"; dice: WotrCombatDie[] }
export function rollCombatDice (...dice: WotrCombatDie[]): WotrCombatRoll { return { type: "combat-roll", dice }; }
export interface WotrArmyRetreatIntoSiege { type: "army-retreat-into-siege"; region: WotrRegionId }
export function retreatIntoSiege (region: WotrRegionId): WotrArmyRetreatIntoSiege { return { type: "army-retreat-into-siege", region }; }

export interface WotrPoliticalAdvance { type: "political-advance"; nation: WotrNationId; quantity: number }
export function advanceNation (nation: WotrNationId, nSteps: number = 1): WotrPoliticalAdvance { return { type: "political-advance", nation, quantity: nSteps }; }
export interface WotrPoliticalActivation { type: "political-activation"; nation: WotrNationId }
export function activateNation (nation: WotrNationId): WotrPoliticalActivation { return { type: "political-activation", nation }; }

export interface WotrArmy {
  minions?: WotrMinionId[];
  companions?: WotrCompanionId[];
  units: {
    quantity: number;
    type: WotrArmyUnitType | "leader" | "nazgul";
    nation: WotrNationId;
  }[];
}

function army (...comp: WotrUnitComposer[]): WotrArmy {
  const a: WotrArmy = { units: [] }; comp.forEach (c => c.addTo (a)); return a; }
export function regular (nation: WotrNationId, quantity: number = 1) { return new WotrGenericUnitsComposer ("regular", nation, quantity); }
export function elite (nation: WotrNationId, quantity: number = 1) { return new WotrGenericUnitsComposer ("elite", nation, quantity); }
export function leader (nation: WotrNationId, quantity: number = 1) { return new WotrLeaderComposer (nation, quantity); }
export function nazgul (quantity: number = 1) { return new WotrNazgulComposer (quantity); }
export function companion (...companions: WotrCompanionId[]) { return new WotrCompanionComposer (companions); }
export function minion (...minions: WotrMinionId[]) { return new WotrMinionComposer (minions); }

interface WotrUnitComposer {
  addTo (a: WotrArmy): void;
}
class WotrGenericUnitsComposer implements WotrUnitComposer {
  constructor (private type: WotrArmyUnitType | "leader" | "nazgul", private nationId: WotrNationId, private quantity: number) { }
  addTo (a: WotrArmy) { a.units?.push ({ quantity: this.quantity, nation: this.nationId, type: this.type }); }
  recruited () { return { unitType: this.type, quantity: this.quantity, nation: this.nationId }; }
}
class WotrLeaderComposer extends WotrGenericUnitsComposer { constructor (nation: WotrNationId, quantity: number) { super ("nazgul", nation, quantity); } }
class WotrNazgulComposer extends WotrGenericUnitsComposer { constructor (quantity: number) { super ("nazgul", "sauron", quantity); } }
class WotrCompanionComposer implements WotrUnitComposer {
  constructor (private companions: WotrCompanionId[]) { }
  addTo (a: WotrArmy) { if (!a.companions) { a.companions = []; } this.companions.forEach (m => a.companions!.push (m)); }
}
class WotrMinionComposer implements WotrUnitComposer {
  constructor (private minions: WotrMinionId[]) { }
  addTo (a: WotrArmy) { if (!a.minions) { a.minions = []; } this.minions.forEach (m => a.minions!.push (m)); }
}

export class WotrFrontStoryComposer {
  constructor (private front: WotrFrontId, private time: number) { }
  rollActionDice (...dice: WotrActionDie[]) { return this.story (rollActionDice (dice)); }
  pass () { return this.story (passAction ()); }
  characterDie (...actions: WotrStoryAction[]) { return this.die ("character", ...actions); }
  eventDie (...actions: WotrStoryAction[]) { return this.die ("event", ...actions); }
  musterDie (...actions: WotrStoryAction[]) { return this.die ("muster", ...actions); }
  musterArmyDie (...actions: WotrStoryAction[]) { return this.die ("muster-army", ...actions); }
  armyDie (...actions: WotrStoryAction[]) { return this.die ("army", ...actions); }
  eventDieCard (card: WotrCardLabel, ...actions: WotrStoryAction[]): WotrStoryDoc { return { die: "event", ...this.card (card, ...actions) }; }
  characterDieCard (card: WotrCardLabel, ...actions: WotrStoryAction[]): WotrStoryDoc { return { die: "character", ...this.card (card, ...actions) }; }
  musterArmyDieCard (card: WotrCardLabel, ...actions: WotrStoryAction[]): WotrStoryDoc { return { die: "muster-army", ...this.card (card, ...actions) }; }
  protected die (die: WotrActionDie, ...actions: WotrStoryAction[]): WotrStoryDoc { return { die, ...this.story (...actions) }; }
  card (card: WotrCardLabel, ...actions: WotrStoryAction[]): WotrStoryDoc { return { card: labelToCardId (card), ...this.story (...actions) }; }
  token (token: WotrActionToken, ...actions: WotrStoryAction[]): WotrStoryDoc { return { token, ...this.story (...actions) }; }
  story (...actions: WotrStoryAction[]): WotrStoryDoc { return { time: this.time, playerId: this.front, actions }; }
}
export class WotrFreePeoplesStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("free-peoples", time); }
  willOfTheWestDie (...actions: WotrStoryAction[]) { return this.die ("will-of-the-west", ...actions); }
}
export class WotrShadowStoryComposer extends WotrFrontStoryComposer {
  constructor (time: number) { super ("shadow", time); }
  huntAllocation (nDice: number) { return this.story ({ type: "hunt-allocation", quantity: nDice }); }
}
