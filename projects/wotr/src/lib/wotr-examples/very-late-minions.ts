/* eslint-disable max-statements-per-line */
/* eslint-disable @typescript-eslint/no-shadow */
// https://www.youtube.com/watch?v=eW9mZqSWKCA&list=PL5jW5oNoeQ7ruXxk1EaQMqeJzE50eECSu&ab_channel=WaroftheRingChamp

import { discardDice } from "../wotr-actions/action-die/wotr-action-die-actions";
import { attack, eliminateUnit, elite, leader, minion, moveArmy, nazgul, recruitUnit, regular, retreatIntoSiege } from "../wotr-actions/army/wotr-army-actions";
import { discardCards, discardRandomCard, drawCards, playCardOnTable } from "../wotr-actions/card/wotr-card-actions";
import { combatCard, noCombatCard, rollCombatDice } from "../wotr-actions/combat/wotr-combat-actions";
import { chooseRandomCompanion, eliminateCompanion } from "../wotr-actions/companion/wotr-companion-actions";
import { changeGuide, corruptFellowship, hideFellowship, moveFelloswhip, notDeclareFellowship, revealFellowship } from "../wotr-actions/fellowship/wotr-fellowship-actions";
import { addHuntTile, drawHuntTile, rollHuntDice } from "../wotr-actions/hunt/wotr-hunt-actions";
import { moveMinions, moveNazgul, playMinion } from "../wotr-actions/minion/wotr-minion-actions";
import { advanceNation } from "../wotr-actions/political/wotr-political-actions";
import { WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrFreePeoplesStoryComposer, WotrShadowStoryComposer, WotrStoryDoc } from "../wotr-story.models";

let time = 1;
export const stories: WotrStoryDoc[] = [
  // Turn 1
  fp (time).story (drawCards ("The Power of Tom Bombadil", "Elven Cloaks")),
  s ().story (drawCards ("The Day Without Dawn", "Worn with Sorrow and Toil")),
  fp ().story (notDeclareFellowship ()),
  s ().huntAllocation (1),
  fp (time).rollActionDice ("character", "character", "muster-army", "muster"),
  s ().rollActionDice ("army", "character", "army", "character", "event", "eye"),
  fp ().pass (),
  s ().characterDie (moveArmy ("barad-dur", "gorgoroth", regular ("sauron", 4), elite ("sauron"), nazgul ())),
  fp ().characterDie (moveFelloswhip ()),
  s ().story (rollHuntDice (1, 6)),
  s ().story (drawHuntTile ("3")),
  fp ().story (eliminateCompanion ("gandalf-the-grey"), changeGuide ("strider")),
  s ().eventDieCard ("Worn with Sorrow and Toil", playCardOnTable ("Worn with Sorrow and Toil")),
  fp ().characterDie (moveFelloswhip ()),
  s ().story (rollHuntDice (5, 2)),
  s ().story (drawHuntTile ("1")),
  fp ().story (corruptFellowship (1)),
  s ().characterDie (moveArmy ("gorgoroth", "morannon", regular ("sauron", 4), elite ("sauron"), nazgul ())),
  fp ().musterArmyDie (
    moveArmy ("carrock", "old-forest-road", regular ("north")),
    moveArmy ("edoras", "westemnet", regular ("rohan"), elite ("rohan"))),
  s ().armyDie (
    moveArmy ("dol-guldur", "north-anduin-vale", regular ("sauron", 4), elite ("sauron"), nazgul ()),
    moveArmy ("morannon", "dagorlad", regular ("sauron", 9), elite ("sauron"), nazgul (2))),
  fp ().musterDie (advanceNation ("elves", 1)),
  s ().armyDie (
    moveArmy ("north-anduin-vale", "dimrill-dale", regular ("sauron", 4), elite ("sauron"), nazgul ()),
    moveArmy ("dagorlad", "noman-lands", regular ("sauron", 9), elite ("sauron"), nazgul (2))),
  fp ().token ("political-advance", advanceNation ("elves", 1)),
  fp ().skipTokens (),
  // Turn 2
  fp (time).story (drawCards ("The Ents Awake: Entmoot", "Kindred of Glorfindel")),
  s ().story (drawCards ("Return to Valinor", "Nazgul Search")),
  fp ().story (notDeclareFellowship ()),
  s ().huntAllocation (1),
  fp (time).rollActionDice ("muster-army", "character", "event", "will-of-the-west"),
  s ().rollActionDice ("event", "muster-army", "event", "army", "event"),
  fp ().pass (),
  s ().eventDie (drawCards ("Rage of the Dunledings")),
  fp ().eventDieCard ("Elven Cloaks", addHuntTile ("b0")),
  s ().eventDie (drawCards ("The Fighting Uruk-hai")),
  fp ().characterDie (moveFelloswhip ()),
  s ().story (rollHuntDice (6, 2)),
  s ().story (drawHuntTile ("er")),
  fp ().story (corruptFellowship (1), revealFellowship ("goblins-gate")),
  s ().musterArmyDie (advanceNation ("isengard")),
  fp ().musterArmyDie (hideFellowship ()),
  s ().eventDieCard ("Rage of the Dunledings",
    recruitUnit ("moria", regular ("isengard", 2)),
    moveArmy ("south-dunland", "moria", regular ("isengard")),
    moveArmy ("north-dunland", "moria", regular ("isengard"))),
  fp ().willOfTheWestDie (moveFelloswhip ()),
  s ().story (rollHuntDice (2, 6)),
  s ().story (drawHuntTile ("3")),
  fp ().story (chooseRandomCompanion ("strider")),
  fp ().story (eliminateCompanion ("strider"), changeGuide ("legolas")),
  s ().card ("Worn with Sorrow and Toil", discardRandomCard ("The Ents Awake: Entmoot")),
  s ().armyDie (
    moveArmy ("moria", "dimrill-dale", regular ("sauron", 1), regular ("isengard", 4)),
    moveArmy ("noman-lands", "southern-rhovanion", regular ("sauron", 9), elite ("sauron"), nazgul (2))),
  fp ().skipTokens (),
  // Turn 3
  fp (time).story (drawCards ("Celeborn's Galadhrim", "Mithril Coat and Sting")),
  s ().story (drawCards ("Half-orcs and Goblin-men", "Wormtongue")),
  fp ().story (notDeclareFellowship ()),
  s ().huntAllocation (1),
  fp (time).rollActionDice ("will-of-the-west", "muster-army", "character", "event"),
  s ().rollActionDice ("muster", "muster", "event", "event", "muster-army", "army"),
  fp ().characterDie (moveFelloswhip ()),
  s ().story (rollHuntDice (1)),
  s ().musterDie (advanceNation ("sauron")),
  fp ().pass (),
  s ().armyDie (
    moveArmy ("southern-rhovanion", "northern-rhovanion", regular ("sauron", 9), elite ("sauron"), nazgul (2)),
    moveArmy ("far-harad", "near-harad", regular ("southrons", 3), elite ("southrons"))),
  fp ().eventDieCard ("Celeborn's Galadhrim",
    recruitUnit ("lorien", elite ("elves")),
    drawCards ("Riders of Theoden")),
  s ().eventDieCard ("Nazgul Search", moveNazgul ("minas-morgul", "old-ford")),
  fp ().story (revealFellowship ("carrock")),
  fp ().pass (),
  s ().musterArmyDie (
    attack ("northern-rhovanion", "old-forest-road", regular ("sauron", 9), elite ("sauron"), nazgul (2)),
    noCombatCard ()),
  fp ().story (combatCard ("The Power of Tom Bombadil")),
  s (time).story (rollCombatDice (4, 2, 3, 4, 6)),
  fp ().story (rollCombatDice (6)),
  s ().story (eliminateUnit ("northern-rhovanion", regular ("sauron"))),
  fp ().story (eliminateUnit ("old-forest-road", regular ("north"))),
  s ().story (moveArmy ("northern-rhovanion", "old-forest-road", regular ("sauron", 8), elite ("sauron"), nazgul (2))),
  fp ().token ("draw-card", drawCards ("Thranduil's Archers")),
  s ().musterDie (advanceNation ("southrons")),
  fp ().musterArmyDie (advanceNation ("elves")),
  s ().eventDieCard ("Half-orcs and Goblin-men", recruitUnit ("old-forest-road", elite ("isengard"))),
  fp ().willOfTheWestDie (recruitUnit ("woodland-realm", elite ("elves"))),
  // Turn 4
  s (time).story (drawCards ("Isildur's Bane", "Hill-trolls")),
  fp ().story (drawCards ("The Ents Awake: Entmoot", "The Red Arrow")),
  s ().huntAllocation (1),
  fp (time).rollActionDice ("muster", "muster-army", "muster-army", "will-of-the-west"),
  s ().rollActionDice ("eye", "eye", "eye", "event", "muster-army", "army"),
  fp ().musterDie (recruitUnit ("woodland-realm", elite ("elves"))),
  s ().armyDie (attack ("dimrill-dale", "lorien", regular ("sauron", 5), regular ("isengard", 4), elite ("sauron"), nazgul ())),
  fp ().story (retreatIntoSiege ("lorien")),
  s ().story (moveArmy ("dimrill-dale", "lorien", regular ("sauron", 5), regular ("isengard", 4), elite ("sauron"), nazgul ())),
  fp ().musterArmyDie (recruitUnit ("woodland-realm", elite ("elves"))),
  s ().eventDieCard ("Hill-trolls",
    eliminateUnit ("lorien", regular ("sauron", 2)),
    recruitUnit ("lorien", elite ("sauron", 2))),
  fp ().musterArmyDie (advanceNation ("north")),
  s ().musterArmyDie (advanceNation ("southrons")),
  fp ().willOfTheWestDie (advanceNation ("north")),
  // Turn 5
  fp (time).story (
    drawCards ("The Last Battle"),
    discardCards ("The Ents Awake: Entmoot")),
  s ().story (
    drawCards ("The Black Captain Commands", "Corsairs of Umbar"),
    discardCards ("Wormtongue")),
  s ().huntAllocation (0),
  fp (time).rollActionDice ("muster", "will-of-the-west", "will-of-the-west", "character"),
  s ().rollActionDice ("muster", "muster-army", "event", "muster", "army", "character", "muster-army"),
  fp ().willOfTheWestDie (hideFellowship ()),
  s ().armyDie (
    moveArmy ("old-forest-road", "carrock", regular ("sauron")),
    moveArmy ("near-harad", "umbar", regular ("southrons", 5), elite ("southrons", 2))),
  fp ().musterDie (recruitUnit ("dale", elite ("north"))),
  s ().eventDieCard ("The Day Without Dawn", discardDice ("free-peoples", "will-of-the-west")),
  fp ().pass (),
  s ().musterDie (playMinion ("orthanc", "saruman")),
  fp ().pass (),
  s ().musterDie (playMinion ("old-forest-road", "the-witch-king")),
  fp ().pass (),
  s ().musterArmyDie (
    attack ("old-forest-road", "dale", regular ("sauron", 7), elite ("sauron"), elite ("isengard", 1), nazgul (2), minion ("the-witch-king")),
    noCombatCard ()),
  fp ().story (
    combatCard ("The Red Arrow"),
    moveArmy ("dale", "erebor", regular ("north"), elite ("north"), leader ("north"))),
  fp ().pass (),
  s ().musterArmyDieCard ("Corsairs of Umbar", attack ("umbar", "dol-amroth")),
  fp ().story (retreatIntoSiege ("dol-amroth")),
  fp ().characterDie (moveFelloswhip ()),
  s ().characterDieCard ("The Black Captain Commands",
    moveMinions ("dale", "dol-amroth", "the-witch-king"),
    moveNazgul ("dale", "dol-amroth", 2),
    moveNazgul ("old-ford", "dol-amroth"))
  // Turn 6 30:00

];

export const fpTokens: WotrActionToken[] = ["draw-card", "political-advance"];

function fp (t?: number) { if (!t) { t = time++; } return new WotrFreePeoplesStoryComposer (t); }
function s (t?: number) { if (!t) { t = time++; } return new WotrShadowStoryComposer (t); }
