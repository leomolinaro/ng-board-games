// https://www.youtube.com/watch?v=6kDLffpqd9A&ab_channel=WaroftheRingChamp

import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { advanceArmy, attack, combatCard, noCombatCard, reRollCombatDice, retreat, rollCombatDice } from "../battle/wotr-battle-actions";
import { discardCardFromTable, drawCards, playCardOnTable } from "../card/wotr-card-actions";
import { chooseRandomCompanion, eliminateCharacter, playCharacter, separateCompanions } from "../character/wotr-character-actions";
import { changeGuide, corruptFellowship, declareFellowship, hideFellowship, moveFelloswhip, notDeclareFellowship, revealFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrStoryDoc } from "../game/wotr-story.models";
import { addHuntTile } from "../hunt/wotr-hunt-actions";
import { advanceNation } from "../nation/wotr-nation-actions";
import { armyMovement, eliminateLeader, eliminateRegularUnit, leftUnits, moveArmies } from "../unit/wotr-unit-actions";
import { elite, nazgul, regular } from "../unit/wotr-unit.models";
import { WotrStoriesBuilder } from "./wotr-story-builder";

const b = new WotrStoriesBuilder ();

export const stories: WotrStoryDoc[] = [
  // Turn 1
  b.fpT ().phaseStory (drawCards ("Swords in Eriador", "Challenge of the King")),
  b.s ().phaseStory (drawCards ("Return to Valinor", "Balrog of Moria")),
  b.fp ().phaseStory (notDeclareFellowship ()),
  b.s ().huntAllocation (1),
  b.fpT ().rollActionDice ("character", "muster-army", "character", "character"),
  b.s ().rollActionDice ("muster-army", "muster-army", "muster", "character", "army", "eye"),
  b.fp ().pass (),
  b.s ().musterDie (advanceNation ("isengard")),
  b.fp ().characterDie (moveFelloswhip ()),
  b.s ().rollHuntDice (4, 5),
  b.s ().characterDie (moveArmies (armyMovement ("barad-dur", "gorgoroth"))),
  b.fp ().characterDie (moveFelloswhip ()),
  b.s ().rollHuntDice (2, 6),
  b.s ().drawHuntTile ("3"),
  b.fp ().huntEffect (
    eliminateCharacter ("gandalf-the-grey"),
    changeGuide ("strider")
  ),
  b.s ().armyDie (moveArmies (armyMovement ("gorgoroth", "morannon", leftUnits (regular ("sauron", 3))), armyMovement ("north-dunland", "moria"))),
  b.fp ().musterArmyDie (moveArmies (armyMovement ("edoras", "westemnet"), armyMovement ("carrock", "old-forest-road"))),
  b.s ().musterArmyDie (playCharacter ("orthanc", "saruman")),
  b.fp ().characterDie (moveFelloswhip ()),
  b.s ().rollHuntDice (6, 2),
  b.s ().drawHuntTile ("2r"),
  b.fp ().huntEffect (corruptFellowship (2)),
  b.fp ().huntEffect (revealFellowship ("goblins-gate")),
  b.s ().musterArmyDie (moveArmies (armyMovement ("moria", "dimrill-dale"), armyMovement ("morannon", "dagorlad"))),
  b.fp ().skipTokens (),
  // Turn 2 4:00
  b.sT ().phaseStory (drawCards ("Give it to Uss!", "Threats and Promises")),
  b.fp ().phaseStory (drawCards ("Axe and Bow", "Grimbeorn the Old, Son of Beorn")),
  b.s ().huntAllocation (1),
  b.fpT ().rollActionDice ("event", "muster", "character", "will-of-the-west"),
  b.s ().rollActionDice ("army", "event", "eye", "army", "muster", "army", "event"),
  b.fp ().musterAbilityDie ("strider", hideFellowship ()),
  b.s ().eventDie (drawCards ("The Shadow Lengthens")),
  b.fp ().willOfTheWestDie (playCharacter ("fangorn", "gandalf-the-white")),
  b.s ().armyDie (moveArmies (armyMovement ("dagorlad", "noman-lands"), armyMovement ("far-harad", "near-harad"))),
  b.fp ().pass (),
  b.s ().armyDie (moveArmies (armyMovement ("noman-lands", "southern-rhovanion"), armyMovement ("dol-guldur", "north-anduin-vale"))),
  b.fp ().pass (),
  b.s ().armyDie (moveArmies (armyMovement ("southern-rhovanion", "northern-rhovanion"), armyMovement ("north-anduin-vale", "dimrill-dale"))),
  b.fp ().characterDie (moveFelloswhip ()),
  b.s ().rollHuntDice (3, 6),
  b.s ().drawHuntTile ("3"),
  b.fp ().huntEffect (chooseRandomCompanion ("peregrin")),
  b.fp ().characterReaction ("peregrin", separateCompanions ("carrock", "peregrin")),
  b.fp ().huntEffect (corruptFellowship (2)),
  b.s ().musterDie (advanceNation ("sauron")),
  b.fp ().eventDieCard ("Axe and Bow", playCardOnTable ("Axe and Bow")),
  b.s ().eventDieCard ("Give it to Uss!", addHuntTile ("r1rs")),
  b.fp ().skipTokens (),
  // Turn 3 6:57
  b.sT ().phaseStory (drawCards ("Lure of the Ring", "Stormcrow")),
  b.fp ().phaseStory (drawCards ("The Ents Awake: Treebeard", "Kindred of Glorfindel")),
  b.fp ().phaseStory (declareFellowship ("old-ford")),
  b.s ().huntAllocation (1),
  b.sT ().rollActionDice ("event", "character", "event", "event", "eye", "army", "character"),
  b.fp ().rollActionDice ("muster-army", "will-of-the-west", "will-of-the-west", "will-of-the-west", "character"),
  b.fp ().characterDie (moveFelloswhip ()),
  b.s ().rollHuntDice (4, 6),
  b.s ().drawHuntTile ("0r"),
  b.fp ().huntEffect (revealFellowship ("carrock")),
  b.s ().characterDie (attack ("northern-rhovanion", "old-forest-road")),
  b.s ().battleStory (noCombatCard ()),
  b.fp ().battleStory (combatCard ("Grimbeorn the Old, Son of Beorn")),
  b.fp ().combatCardReaction ("Grimbeorn the Old, Son of Beorn", retreat ("woodland-realm")),
  b.s ().battleStory (advanceArmy ()),
  b.fp ().musterArmyAbilityDie ("strider", hideFellowship ()),
  b.s ().armyDie (moveArmies (armyMovement ("old-forest-road", "carrock", leftUnits (regular ("sauron", 8), elite ("sauron"), nazgul (1))), armyMovement ("near-harad", "umbar", leftUnits (regular ("southrons", 1))))),
  b.fp ().pass (),
  b.s ().characterDie (attack ("old-forest-road", "dale")),
  b.s ().battleStory (combatCard ("Stormcrow")),
  b.fp ().battleStory (noCombatCard ()),
  b.sT ().battleStory (rollCombatDice (1, 1, 1, 1, 1)),
  b.fp ().battleStory (rollCombatDice (6)),
  b.s ().battleStory (reRollCombatDice (1)),
  b.s ().battleStory (eliminateRegularUnit ("old-forest-road", "sauron")),
  b.fp ().combatCardReaction ("Stormcrow", eliminateRegularUnit ("dale", "north"), eliminateLeader ("dale", "north")),
  b.s ().battleStory (advanceArmy (leftUnits (regular ("sauron")))),
  b.fp ().willOfTheWestDie (moveArmies (armyMovement ("iron-hills", "erebor"), armyMovement ("westemnet", "helms-deep"))),
  b.s ().eventDie (drawCards ("The Black Captain Commands")),
  b.fp ().willOfTheWestDie (moveFelloswhip ()),
  b.s ().rollHuntDice (1, 2),
  b.s ().reRollHuntDice (1, 6),
  b.s ().drawHuntTile ("1"),
  b.fp ().huntEffect (discardCardFromTable ("Axe and Bow")),
  b.s ().eventDieCard ("Balrog of Moria", playCardOnTable ("Balrog of Moria")),
  b.fp ().actionToken ("political-advance", advanceNation ("elves")),
  b.s ().eventDieCard ("The Shadow Lengthens", moveArmies (armyMovement ("south-rhun", "north-rhun"), armyMovement ("nurn", "minas-morgul"))),
  b.fp ().willOfTheWestDie (advanceNation ("elves")),
  b.fp ().skipTokens (),
  // Turn 4 17:47

];

export const fpTokens: WotrActionToken[] = ["draw-card", "political-advance"];
