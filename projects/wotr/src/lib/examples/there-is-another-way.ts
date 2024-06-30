// https://www.youtube.com/watch?v=6kDLffpqd9A&ab_channel=WaroftheRingChamp

import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { attack, combatCard, noCombatCard, reRollCombatDice, rollCombatDice } from "../battle/wotr-battle-actions";
import { discardCardFromTable, drawCards, playCardOnTable } from "../card/wotr-card-actions";
import { chooseRandomCompanion, eliminateCharacter, playCharacter, separateCompanions } from "../character/wotr-character-actions";
import { changeGuide, corruptFellowship, declareFellowship, hideFellowship, moveFelloswhip, notDeclareFellowship, revealFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrFreePeoplesStoryComposer, WotrShadowStoryComposer, WotrStoryDoc } from "../game/wotr-story.models";
import { addHuntTile, drawHuntTile, reRollHuntDice, rollHuntDice } from "../hunt/wotr-hunt-actions";
import { advanceNation } from "../nation/wotr-nation-actions";
import { eliminateLeader, eliminateRegularUnit, leftUnits, moveArmy } from "../unit/wotr-unit-actions";
import { elite, nazgul, regular } from "../unit/wotr-unit.models";

let time = 1;
export const stories: WotrStoryDoc[] = [
  // Turn 1
  fp (time).phaseStory (drawCards ("Swords in Eriador", "Challenge of the King")),
  s ().phaseStory (drawCards ("Return to Valinor", "Balrog of Moria")),
  fp ().phaseStory (notDeclareFellowship ()),
  s ().huntAllocation (1),
  fp (time).rollActionDice ("character", "muster-army", "character", "character"),
  s ().rollActionDice ("muster-army", "muster-army", "muster", "character", "army", "eye"),
  fp ().pass (),
  s ().musterDie (advanceNation ("isengard")),
  fp ().characterDie (moveFelloswhip ()),
  s ().huntStory (rollHuntDice (4, 5)),
  s ().characterDie (moveArmy ("barad-dur", "gorgoroth")),
  fp ().characterDie (moveFelloswhip ()),
  s ().huntStory (rollHuntDice (2, 6)),
  s ().huntStory (drawHuntTile ("3")),
  fp ().huntStory (
    eliminateCharacter ("gandalf-the-grey"),
    changeGuide ("strider")
  ),
  s ().armyDie (
    moveArmy ("gorgoroth", "morannon", leftUnits (regular ("sauron", 3))),
    moveArmy ("north-dunland", "moria")
  ),
  fp ().musterArmyDie (
    moveArmy ("edoras", "westemnet"),
    moveArmy ("carrock", "old-forest-road")
  ),
  s ().musterArmyDie (playCharacter ("orthanc", "saruman")),
  fp ().characterDie (moveFelloswhip ()),
  s ().huntStory (rollHuntDice (6, 2)),
  s ().huntStory (drawHuntTile ("2r")),
  fp ().huntStory (corruptFellowship (2)),
  fp ().huntStory (revealFellowship ("goblins-gate")),
  s ().musterArmyDie (
    moveArmy ("moria", "dimrill-dale"),
    moveArmy ("morannon", "dagorlad")
  ),
  fp ().skipTokens (),
  // Turn 2 4:00
  s (time).phaseStory (drawCards ("Give it to Uss!", "Threats and Promises")),
  fp ().phaseStory (drawCards ("Axe and Bow", "Grimbeorn the Old, Son of Beorn")),
  s ().huntAllocation (1),
  fp (time).rollActionDice ("event", "muster", "character", "will-of-the-west"),
  s ().rollActionDice ("army", "event", "eye", "army", "muster", "army", "event"),
  fp ().musterAbilityDie ("strider", hideFellowship ()),
  s ().eventDie (drawCards ("The Shadow Lengthens")),
  fp ().willOfTheWestDie (playCharacter ("fangorn", "gandalf-the-white")),
  s ().armyDie (
    moveArmy ("dagorlad", "noman-lands"),
    moveArmy ("far-harad", "near-harad")
  ),
  fp ().pass (),
  s ().armyDie (
    moveArmy ("noman-lands", "southern-rhovanion"),
    moveArmy ("dol-guldur", "north-anduin-vale")
  ),
  fp ().pass (),
  s ().armyDie (
    moveArmy ("southern-rhovanion", "northern-rhovanion"),
    moveArmy ("north-anduin-vale", "dimrill-dale")
  ),
  fp ().characterDie (moveFelloswhip ()),
  s ().huntStory (rollHuntDice (3, 6)),
  s ().huntStory (drawHuntTile ("3")),
  fp ().huntStory (chooseRandomCompanion ("peregrin")),
  fp ().characterReaction ("peregrin", separateCompanions ("carrock", "peregrin")),
  fp ().huntStory (corruptFellowship (2)),
  s ().musterDie (advanceNation ("sauron")),
  fp ().eventDieCard ("Axe and Bow", playCardOnTable ("Axe and Bow")),
  s ().eventDieCard ("Give it to Uss!", addHuntTile ("r1rs")),
  fp ().skipTokens (),
  // Turn 3 6:57
  s (time).phaseStory (drawCards ("Lure of the Ring", "Stormcrow")),
  fp ().phaseStory (drawCards ("The Ents Awake: Treebeard", "Kindred of Glorfindel")),
  fp ().phaseStory (declareFellowship ("old-ford")),
  s ().huntAllocation (1),
  s (time).rollActionDice ("event", "character", "event", "event", "eye", "army", "character"),
  fp ().rollActionDice ("muster-army", "will-of-the-west", "will-of-the-west", "will-of-the-west", "character"),
  fp ().characterDie (moveFelloswhip ()),
  s ().huntStory (rollHuntDice (4, 6)),
  s ().huntStory (drawHuntTile ("0r")),
  fp ().huntStory (revealFellowship ("carrock")),
  s ().characterDie (attack ("northern-rhovanion", "old-forest-road")),
  s ().battleStory (noCombatCard ()),
  fp ().battleStory (combatCard ("Grimbeorn the Old, Son of Beorn")),
  fp ().combatCardReaction ("Grimbeorn the Old, Son of Beorn", moveArmy ("old-forest-road", "woodland-realm")),
  s ().battleStory (moveArmy ("northern-rhovanion", "old-forest-road")),
  fp ().musterArmyAbilityDie ("strider", hideFellowship ()),
  s ().armyDie (
    moveArmy ("old-forest-road", "carrock", leftUnits (regular ("sauron", 8), elite ("sauron"), nazgul (1))),
    moveArmy ("near-harad", "umbar", leftUnits (regular ("southrons", 1)))
  ),
  fp ().pass (),
  s ().characterDie (attack ("old-forest-road", "dale")),
  s ().battleStory (combatCard ("Stormcrow")),
  fp ().battleStory (noCombatCard ()),
  s (time).battleStory (rollCombatDice (1, 1, 1, 1, 1)),
  fp ().battleStory (rollCombatDice (6)),
  s ().battleStory (reRollCombatDice (1)),
  s ().battleStory (eliminateRegularUnit ("old-forest-road", "sauron")),
  fp ().combatCardReaction ("Stormcrow", eliminateRegularUnit ("dale", "north"), eliminateLeader ("dale", "north")),
  s ().battleStory (moveArmy ("old-forest-road", "dale", leftUnits (regular ("sauron")))),
  fp ().willOfTheWestDie (
    moveArmy ("iron-hills", "erebor"),
    moveArmy ("westemnet", "helms-deep")
  ),
  s ().eventDie (drawCards ("The Black Captain Commands")),
  fp ().willOfTheWestDie (moveFelloswhip ()),
  s ().huntStory (rollHuntDice (1, 2)),
  s ().huntStory (reRollHuntDice (1, 6)),
  s ().huntStory (drawHuntTile ("1")),
  fp ().huntStory (discardCardFromTable ("Axe and Bow")),
  s ().eventDieCard ("Balrog of Moria", playCardOnTable ("Balrog of Moria")),
  fp ().actionToken ("political-advance", advanceNation ("elves")),
  s ().eventDieCard ("The Shadow Lengthens",
    moveArmy ("south-rhun", "north-rhun"),
    moveArmy ("nurn", "minas-morgul")
  ),
  fp ().willOfTheWestDie (advanceNation ("elves")),
  fp ().skipTokens (),
  // Turn 4 17:47

];

export const fpTokens: WotrActionToken[] = ["draw-card", "political-advance"];

function fp (t?: number) { if (!t) { t = time++; } return new WotrFreePeoplesStoryComposer (t); }
function s (t?: number) { if (!t) { t = time++; } return new WotrShadowStoryComposer (t); }