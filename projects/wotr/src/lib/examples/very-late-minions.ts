/* eslint-disable max-statements-per-line */
/* eslint-disable @typescript-eslint/no-shadow */
// https://www.youtube.com/watch?v=eW9mZqSWKCA&list=PL5jW5oNoeQ7ruXxk1EaQMqeJzE50eECSu&ab_channel=WaroftheRingChamp

import { discardDice } from "../action-die/wotr-action-die-actions";
import { WotrActionToken } from "../action-die/wotr-action-die-models";
import {
  advanceArmy,
  attack,
  combatCard,
  continueBattle,
  forfeitLeadership,
  noCombatCard,
  reRollCombatDice,
  retreat,
  retreatIntoSiege,
  rollCombatDice
} from "../battle/wotr-battle-actions";
import {
  discardCards,
  discardRandomCard,
  drawCards,
  playCardOnTable
} from "../card/wotr-card-actions";
import {
  eliminateCharacter,
  moveCharacters,
  playCharacter
} from "../character/wotr-character-actions";
import {
  changeGuide,
  chooseRandomCompanion,
  corruptFellowship,
  declareFellowship,
  healFellowship,
  hideFellowship,
  moveFelloswhip,
  revealFellowship,
  separateCompanions
} from "../fellowship/wotr-fellowship-actions";
import { WotrStoryDoc } from "../game/wotr-story-models";
import { addHuntTile, drawHuntTile } from "../hunt/wotr-hunt-actions";
import { advanceNation } from "../nation/wotr-nation-actions";
import { targetRegion } from "../region/wotr-region-actions";
import {
  armyMovement,
  downgradeEliteUnit,
  eliminateEliteUnit,
  eliminateLeader,
  eliminateRegularUnit,
  leftUnits,
  moveArmies,
  moveNazgul,
  recruitEliteUnit,
  recruitRegularUnit,
  upgradeRegularUnit
} from "../unit/wotr-unit-actions";
import { character, elite, nazgul, regular } from "../unit/wotr-unit-models";
import { WotrStoriesBuilder } from "./wotr-story-builder";

const b = new WotrStoriesBuilder();

export const stories: WotrStoryDoc[] = [
  // Turn 1
  b.fpT().phaseStory(drawCards("The Power of Tom Bombadil", "Elven Cloaks")),
  b.s().phaseStory(drawCards("The Day Without Dawn", "Worn with Sorrow and Toil")),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b.fpT().rollActionDice("character", "character", "muster-army", "muster"),
  b.s().rollActionDice("army", "character", "army", "character", "event", "eye"),
  b.fp().pass(),
  b.s().characterDie(moveArmies(armyMovement("barad-dur", "gorgoroth"))),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(1, 6),
  b.s().drawHuntTile("3"),
  b.fp().huntEffect(eliminateCharacter("gandalf-the-grey"), changeGuide("strider")),
  b.s().eventDieCard("Worn with Sorrow and Toil", playCardOnTable("Worn with Sorrow and Toil")),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(5, 2),
  b.s().drawHuntTile("1"),
  b.fp().huntEffect(corruptFellowship(1)),
  b
    .s()
    .characterDie(
      moveArmies(armyMovement("gorgoroth", "morannon", leftUnits(regular("sauron", 3))))
    ),
  b
    .fp()
    .musterArmyDie(
      moveArmies(armyMovement("carrock", "old-forest-road"), armyMovement("edoras", "westemnet"))
    ),
  b
    .s()
    .armyDie(
      moveArmies(
        armyMovement("dol-guldur", "north-anduin-vale", leftUnits(regular("sauron", 1))),
        armyMovement("morannon", "dagorlad")
      )
    ),
  b.fp().musterDie(advanceNation("elves", 1)),
  b
    .s()
    .armyDie(
      moveArmies(
        armyMovement("north-anduin-vale", "dimrill-dale"),
        armyMovement("dagorlad", "noman-lands")
      )
    ),
  b.fp().actionToken("political-advance", advanceNation("elves", 1)),
  b.fp().skipTokens(),
  // Turn 2
  b.fpT().phaseStory(drawCards("The Ents Awake: Entmoot", "Kindred of Glorfindel")),
  b.s().phaseStory(drawCards("Return to Valinor", "Nazgul Search")),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b.fpT().rollActionDice("muster-army", "character", "event", "will-of-the-west"),
  b.s().rollActionDice("event", "muster-army", "event", "army", "event"),
  b.fp().pass(),
  b.s().eventDie(drawCards("Rage of the Dunledings")),
  b.fp().eventDieCard("Elven Cloaks", addHuntTile("b0")),
  b.s().eventDie(drawCards("The Fighting Uruk-hai")),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(6, 2),
  b.s().drawHuntTile("er"),
  b.fp().huntEffect(corruptFellowship(1)),
  b.fp().huntEffect(revealFellowship("goblins-gate")),
  b.s().musterArmyDie(advanceNation("isengard")),
  b.fp().musterArmyDie(hideFellowship()),
  b
    .s()
    .eventDieCard(
      "Rage of the Dunledings",
      recruitRegularUnit("moria", "isengard", 2),
      moveArmies(armyMovement("south-dunland", "moria"), armyMovement("north-dunland", "moria"))
    ),
  b.fp().willOfTheWestDie(moveFelloswhip()),
  b.s().rollHuntDice(2, 6),
  b.s().drawHuntTile("3"),
  b.fp().huntEffect(chooseRandomCompanion("strider")),
  b.fp().huntEffect(eliminateCharacter("strider"), changeGuide("legolas")),
  b.s().cardReaction("Worn with Sorrow and Toil", discardRandomCard("The Ents Awake: Entmoot")),
  b
    .s()
    .armyDie(
      moveArmies(
        armyMovement("moria", "dimrill-dale", leftUnits(regular("sauron", 1))),
        armyMovement("noman-lands", "southern-rhovanion")
      )
    ),
  b.fp().skipTokens(),
  // Turn 3
  b.fpT().phaseStory(drawCards("Celeborn's Galadhrim", "Mithril Coat and Sting")),
  b.s().phaseStory(drawCards("Half-orcs and Goblin-men", "Wormtongue")),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b.fpT().rollActionDice("will-of-the-west", "muster-army", "character", "event"),
  b.s().rollActionDice("muster", "muster", "event", "event", "muster-army", "army"),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(1),
  b.s().musterDie(advanceNation("sauron")),
  b.fp().pass(),
  b
    .s()
    .armyDie(
      moveArmies(
        armyMovement("southern-rhovanion", "northern-rhovanion"),
        armyMovement("far-harad", "near-harad")
      )
    ),
  b
    .fp()
    .eventDieCard(
      "Celeborn's Galadhrim",
      recruitEliteUnit("lorien", "elves"),
      drawCards("Riders of Theoden")
    ),
  b.s().eventDieCard("Nazgul Search", moveNazgul("minas-morgul", "goblins-gate")),
  b.fp().cardReaction("Nazgul Search", revealFellowship("carrock")),
  b.fp().pass(),
  b.s().musterArmyDie(attack("northern-rhovanion", "old-forest-road")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(combatCard("The Power of Tom Bombadil")),
  b.fpT().battleStory(rollCombatDice(6)),
  b.s().battleStory(rollCombatDice(4, 2, 3, 4, 6)),
  b.s().battleStory(eliminateRegularUnit("northern-rhovanion", "sauron")),
  b.fp().battleStory(eliminateRegularUnit("old-forest-road", "north")),
  b.s().battleStory(advanceArmy()),
  b.fp().actionToken("draw-card", drawCards("Thranduil's Archers")),
  b.s().musterDie(advanceNation("southrons")),
  b.fp().musterArmyDie(advanceNation("elves")),
  b.s().eventDieCard("Half-orcs and Goblin-men", recruitEliteUnit("old-forest-road", "isengard")),
  b.fp().willOfTheWestDie(recruitEliteUnit("woodland-realm", "elves")),
  // Turn 4
  b.sT().phaseStory(drawCards("Isildur's Bane", "Hill-trolls")),
  b.fp().phaseStory(drawCards("The Ents Awake: Huorns", "The Red Arrow")),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b.fpT().rollActionDice("muster", "muster-army", "muster-army", "will-of-the-west"),
  b.s().rollActionDice("eye", "eye", "eye", "event", "muster-army", "army"),
  b.fp().musterDie(recruitEliteUnit("woodland-realm", "elves")),
  b.s().armyDie(attack("dimrill-dale", "lorien")),
  b.fp().battleStory(retreatIntoSiege("lorien")),
  b.s().battleStory(advanceArmy()),
  b.fp().musterArmyDie(recruitEliteUnit("woodland-realm", "elves")),
  b.s().eventDieCard("Hill-trolls", upgradeRegularUnit("lorien", "sauron", 2)),
  b.fp().musterArmyDie(advanceNation("north")),
  b.s().musterArmyDie(advanceNation("southrons")),
  b.fp().willOfTheWestDie(advanceNation("north")),
  // Turn 5
  b
    .fpT()
    .phaseStory(
      drawCards("I Will Go Alone", "The Last Battle"),
      discardCards("Kindred of Glorfindel", "The Ents Awake: Huorns")
    ),
  b
    .s()
    .phaseStory(
      drawCards("The Black Captain Commands", "Corsairs of Umbar"),
      discardCards("Wormtongue")
    ),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(0),
  b.fpT().rollActionDice("muster", "will-of-the-west", "will-of-the-west", "character"),
  b
    .s()
    .rollActionDice("muster", "muster-army", "event", "muster", "army", "character", "muster-army"),
  b.fp().willOfTheWestDie(hideFellowship()),
  b
    .s()
    .armyDie(
      moveArmies(
        armyMovement(
          "old-forest-road",
          "carrock",
          leftUnits(regular("sauron", 7), elite("sauron", 1), elite("isengard", 1), nazgul(2))
        ),
        armyMovement("near-harad", "umbar", leftUnits(regular("southrons", 1)))
      )
    ),
  b.fp().musterDie(recruitEliteUnit("dale", "north")),
  b.s().eventDieCard("The Day Without Dawn", discardDice("free-peoples", "will-of-the-west")),
  b.fp().pass(),
  b.s().musterDie(playCharacter("orthanc", "saruman")),
  b.fp().pass(),
  b.s().musterDie(playCharacter("old-forest-road", "the-witch-king")),
  b.fp().pass(),
  b.s().musterArmyDie(attack("old-forest-road", "dale")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(combatCard("The Red Arrow")),
  b.fp().combatCardReaction("The Red Arrow", moveArmies(armyMovement("dale", "erebor"))),
  b.s().battleStory(advanceArmy()),
  b.fp().pass(),
  b.s().musterArmyDieCard("Corsairs of Umbar", attack("umbar", "dol-amroth")),
  b.fp().battleStory(retreatIntoSiege("dol-amroth")),
  b.s().battleStory(advanceArmy(leftUnits(regular("southrons", 1)))),
  b.fp().characterDie(moveFelloswhip()),
  b
    .s()
    .characterDieCard(
      "The Black Captain Commands",
      moveCharacters("dale", "dol-amroth", "the-witch-king"),
      moveNazgul("dale", "dol-amroth", 2),
      moveNazgul("goblins-gate", "dol-amroth"),
      attack("dol-amroth", "dol-amroth")
    ),
  b.s().battleStory(combatCard("Return to Valinor")),
  b.fp().battleStory(combatCard("The Last Battle")),
  b.sT().battleStory(rollCombatDice(5, 1, 4)),
  b.fp().battleStory(rollCombatDice(2, 4, 4)),
  b.s().battleStory(reRollCombatDice(5)),
  b.s().battleStory(eliminateRegularUnit("dol-amroth", "southrons", 2)),
  b.fp().battleStory(eliminateRegularUnit("dol-amroth", "gondor", 3)),
  b.s().characterReaction("the-witch-king", drawCards("Orcs Multiplying Again")),
  // Turn 6 30:00
  b.fpT().phaseStory(drawCards("There and Back Again", "Grimbeorn the Old, Son of Beorn")),
  b.s().phaseStory(drawCards("Grond, Hammer of the Unnderworld", "Shadows on the Misty Mountains")),
  b.fp().fellowshipPhase(declareFellowship("old-forest-road")),
  b.s().huntAllocation(1),
  b
    .sT()
    .rollActionDice(
      "eye",
      "muster",
      "army",
      "event",
      "muster",
      "muster",
      "character",
      "muster-army"
    ),
  b.fp().rollActionDice("character", "event", "character", "muster"),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(2, 6),
  b.s().drawHuntTile("2"),
  b.fp().huntEffect(eliminateCharacter("legolas"), changeGuide("gimli")),
  b.s().skipCardReaction("Worn with Sorrow and Toil"),
  b
    .s()
    .characterDie(
      moveCharacters("dol-amroth", "orthanc", "the-witch-king"),
      moveNazgul("dol-amroth", "old-forest-road"),
      moveNazgul("dol-amroth", "southern-rhovanion"),
      moveNazgul("dol-amroth", "noman-lands")
    ),
  b.fp().pass(),
  b
    .s()
    .musterDie(
      recruitRegularUnit("orthanc", "isengard"),
      recruitRegularUnit("north-dunland", "isengard"),
      recruitRegularUnit("south-dunland", "isengard")
    ),
  b.fp().pass(),
  b.s().musterDie(upgradeRegularUnit("orthanc", "isengard", 2)),
  b.fp().pass(),
  b.s().musterDie(upgradeRegularUnit("orthanc", "isengard", 2)),
  b
    .fp()
    .musterElvenRingDie(
      "narya",
      moveArmies(
        armyMovement("fords-of-isen", "helms-deep"),
        armyMovement("westemnet", "helms-deep")
      )
    ),
  b
    .s()
    .armyDie(
      moveArmies(
        armyMovement("orthanc", "fords-of-isen", leftUnits(character("saruman"))),
        armyMovement("south-rhun", "east-rhun")
      )
    ),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(2, 2),
  b.s().reRollHuntDice(1),
  b.s().musterArmyDie(attack("fords-of-isen", "helms-deep")),
  b.fp().battleStory(retreatIntoSiege("helms-deep")),
  b.s().battleStory(advanceArmy()),
  b
    .fp()
    .eventDieCard(
      "I Will Go Alone",
      separateCompanions("druadan-forest", "boromir"),
      healFellowship(1)
    ),
  b.s().eventDieCard("Isildur's Bane", drawHuntTile("0r")),
  b.fp().huntEffect(revealFellowship("southern-rhovanion")),
  // Turn 7 42:05
  b.sT().phaseStory(drawCards("The Nazgul Strike", "Olog-hai")),
  b
    .fp()
    .phaseStory(
      drawCards("Bilbo's Song", "Paths of the Woses"),
      discardCards("Paths of the Woses")
    ),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b
    .sT()
    .rollActionDice(
      "event",
      "character",
      "muster",
      "muster",
      "event",
      "character",
      "muster",
      "army"
    ),
  b.fp().rollActionDice("character", "character", "muster", "character"),
  b.fp().characterDie(hideFellowship()),
  b.s().eventDieCard("Olog-hai", recruitEliteUnit("helms-deep", "sauron")),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(6),
  b.s().drawHuntTile("1r"),
  b.fp().huntEffect(corruptFellowship(1)),
  b.fp().huntEffect(revealFellowship("noman-lands")),
  b.s().eventDie(drawCards("A New Power is Rising")),
  b.fp().pass(),
  b.s().armyDieCard("The Fighting Uruk-hai", attack("helms-deep", "helms-deep")),
  b.s().battleStory(combatCard("Grond, Hammer of the Unnderworld")),
  b.fp().battleStory(noCombatCard()),
  b
    .s()
    .combatCardReaction(
      "Grond, Hammer of the Unnderworld",
      forfeitLeadership(character("the-witch-king"))
    ),
  b.sT().battleStory(rollCombatDice(2, 5, 5, 4, 6)),
  b.fp().battleStory(rollCombatDice(4, 6, 4)),
  b.sT().battleStory(reRollCombatDice(2, 2, 4, 5)),
  b.fp().battleStory(reRollCombatDice(2)),
  b.s().battleStory(eliminateRegularUnit("helms-deep", "isengard")),
  b.fp().battleStory(downgradeEliteUnit("helms-deep", "rohan")),
  b.s().battleStory(continueBattle("helms-deep")),
  b.s().characterReaction("the-witch-king", drawCards("The Breaking of the Fellowship")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(2, 6, 3, 2, 6)),
  b.fp().battleStory(rollCombatDice(2, 4, 4, 2, 3)),
  b.sT().battleStory(reRollCombatDice(2, 5, 5)),
  b.fp().battleStory(reRollCombatDice(1)),
  b.fp().battleStory(eliminateRegularUnit("helms-deep", "rohan", 2)),
  b.s().battleStory(continueBattle("helms-deep")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(4, 2, 4, 1, 2)),
  b.fp().battleStory(rollCombatDice(1, 2, 6)),
  b.sT().battleStory(reRollCombatDice(1, 5, 5, 5, 4)),
  b.fp().battleStory(reRollCombatDice(4)),
  b.s().battleStory(downgradeEliteUnit("helms-deep", "isengard")),
  b.s().battleStory(continueBattle("helms-deep"), downgradeEliteUnit("helms-deep", "isengard")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(3, 2, 3, 1, 5)),
  b.fp().battleStory(rollCombatDice(2, 4, 6)),
  b.sT().battleStory(reRollCombatDice(6, 4, 2, 6, 5)),
  b.fp().battleStory(reRollCombatDice(5)),
  b.s().battleStory(eliminateEliteUnit("helms-deep", "isengard")),
  b.fp().battleStory(eliminateRegularUnit("helms-deep", "rohan", 2)),
  b.s().battleStory(continueBattle("helms-deep"), downgradeEliteUnit("helms-deep", "isengard")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(combatCard("Riders of Theoden")),
  b.sT().battleStory(rollCombatDice(6, 3, 2)),
  b.fp().battleStory(rollCombatDice(5)),
  b.s().battleStory(downgradeEliteUnit("helms-deep", "sauron")),
  b
    .fp()
    .battleStory(
      eliminateRegularUnit("helms-deep", "rohan"),
      eliminateLeader("helms-deep", "rohan")
    ),
  b.fp().musterDie(recruitRegularUnit("edoras", "rohan"), recruitRegularUnit("westemnet", "rohan")),
  b.s().characterDieCard("The Breaking of the Fellowship", drawHuntTile("3")),
  b
    .fp()
    .huntEffect(
      separateCompanions("noman-lands", "gimli", "meriadoc", "peregrin"),
      changeGuide("gollum")
    ),
  b.fp().pass(),
  b.s().characterDie(attack("helms-deep", "westemnet")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(6, 6, 6, 5, 6)),
  b.fp().battleStory(rollCombatDice(4)),
  b.fp().battleStory(eliminateRegularUnit("westemnet", "rohan")),
  b.s().battleStory(advanceArmy(leftUnits(regular("sauron", 1)))),
  b.fp().pass(),
  b.s().musterDie(recruitEliteUnit("north-rhun", "southrons")),
  b.fp().pass(),
  b.s().musterDie(recruitEliteUnit("north-rhun", "southrons")),
  b.fp().characterDie(hideFellowship()),
  b.s().musterElvenRingDie("narya", attack("westemnet", "edoras")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(5, 2, 3, 4)),
  b.fp().battleStory(rollCombatDice(3)),
  b.s().battleStory(reRollCombatDice(1, 1, 2)),
  b.s().battleStory(continueBattle("edoras")),
  b.fp().battleStory(retreat("folde")),
  b.s().battleStory(advanceArmy()),
  // Turn 8 54:32
  b
    .fpT()
    .phaseStory(drawCards("Horn of Gondor", "Fear! Fire! Foes!"), discardCards("Horn of Gondor")),
  b.s().phaseStory(drawCards("Dreadful Spells", "Musterings of Long-planned War")),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b
    .sT()
    .rollActionDice(
      "eye",
      "army",
      "muster-army",
      "army",
      "muster-army",
      "character",
      "eye",
      "muster"
    ),
  b.fp().rollActionDice("event", "character", "character", "event"),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(5, 1, 2),
  b.s().reRollHuntDice(2),
  b.s().armyDie(attack("edoras", "folde")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(5, 6, 6, 5)),
  b.fp().battleStory(rollCombatDice(2)),
  b.fp().battleStory(eliminateRegularUnit("folde", "rohan")),
  b.s().battleStory(advanceArmy()),
  b.fp().characterDie(moveFelloswhip()),
  b.s().rollHuntDice(5, 4, 1),
  b.s().reRollHuntDice(1), // missing in the video
  b.s().drawHuntTile("2r"),
  b.fp().characterReaction("gollum", corruptFellowship(1), revealFellowship("morannon")),
  b.s().drawHuntTile("er"),
  b.fp().huntEffect(corruptFellowship(1)),
  b
    .s()
    .armyDie(
      moveArmies(armyMovement("dol-amroth", "lamedon"), armyMovement("north-rhun", "east-rhun"))
    ),
  b.fp().pass(),
  b.s().musterArmyDie(attack("east-rhun", "iron-hills")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(combatCard("Grimbeorn the Old, Son of Beorn")),
  b.fp().combatCardReaction("Grimbeorn the Old, Son of Beorn", retreat("vale-of-the-carnen")),
  b.s().battleStory(advanceArmy()),
  b.fp().pass(),
  b.s().musterArmyDie(attack("iron-hills", "erebor")),
  b.fp().battleStory(retreatIntoSiege("erebor")),
  b.s().battleStory(advanceArmy()),
  b.fp().eventDieCard("Bilbo's Song", healFellowship(2)),
  b.s().musterDie(playCharacter("minas-morgul", "the-mouth-of-sauron")),
  b.fp().eventDieCard("Mithril Coat and Sting", playCardOnTable("Mithril Coat and Sting")),
  b
    .s()
    .characterDie(
      moveCharacters("minas-morgul", "pelargir", "the-mouth-of-sauron"),
      moveCharacters("folde", "lorien", "the-witch-king"),
      moveNazgul("old-forest-road", "lorien"),
      moveNazgul("southern-rhovanion", "lorien"),
      moveNazgul("noman-lands", "erebor")
    ),
  // Turn 9 56:34
  b.fpT().phaseStory(drawCards("Smeagol Helps Nice Master", "A Power too Great")),
  b
    .s()
    .phaseStory(
      drawCards("Cruel Weather", "Many Kings to the Service of Mordor"),
      discardCards("The Nazgul Strike", "Orcs Multiplying Again")
    ),
  b.fp().fellowshipPhase(),
  b.s().huntAllocation(1),
  b
    .sT()
    .rollActionDice(
      "event",
      "muster",
      "eye",
      "army",
      "eye",
      "army",
      "character",
      "event",
      "muster-army"
    ),
  b.fp().rollActionDice("muster-army", "will-of-the-west", "character", "will-of-the-west"),
  b.fp().characterDie(hideFellowship()),
  b.s().armyDie(attack("lorien", "lorien")),
  b.s().battleStory(combatCard("Cruel Weather")),
  b.fp().battleStory(combatCard("Fear! Fire! Foes!")),
  b.s().cardReaction("Cruel Weather", forfeitLeadership(nazgul(2))),
  b.sT().battleStory(rollCombatDice(6, 6, 1, 4, 6)),
  b.fp().battleStory(rollCombatDice(3, 1, 6, 4)),
  b.sT().battleStory(reRollCombatDice(3, 1)),
  b.fp().battleStory(reRollCombatDice(4)),
  b.s().battleStory(eliminateRegularUnit("lorien", "isengard")),
  b.fp().battleStory(downgradeEliteUnit("lorien", "elves", 2)),
  b.s().battleStory(continueBattle("lorien"), downgradeEliteUnit("lorien", "sauron")),
  b.s().characterReaction("the-witch-king", drawCards("On, On They Went")),
  b.s().battleStory(combatCard("Musterings of Long-planned War")),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(2, 6, 3, 1, 2)),
  b.fp().battleStory(rollCombatDice(4, 5, 2, 6)),
  b.sT().battleStory(reRollCombatDice(6, 2, 2, 3)),
  b.fp().battleStory(reRollCombatDice(4)),
  b
    .s()
    .battleStory(
      eliminateRegularUnit("lorien", "isengard", 3),
      eliminateRegularUnit("lorien", "sauron")
    ),
  b.fp().battleStory(eliminateEliteUnit("lorien", "elves")),
  b.s().battleStory(continueBattle("lorien"), downgradeEliteUnit("lorien", "sauron")),
  b.s().battleStory(combatCard("Many Kings to the Service of Mordor")),
  b.fp().battleStory(combatCard("A Power too Great")),
  b.sT().battleStory(rollCombatDice(6, 3, 2, 4, 5)),
  b.fp().battleStory(rollCombatDice(6, 4, 1)),
  b.sT().battleStory(reRollCombatDice(2, 6, 3, 3)),
  b.fp().battleStory(reRollCombatDice(1)),
  b.s().battleStory(eliminateEliteUnit("lorien", "sauron")),
  b
    .fp()
    .battleStory(eliminateRegularUnit("lorien", "elves", 3), eliminateLeader("lorien", "elves")),
  b.fp().willOfTheWestDie(moveFelloswhip()),
  b.s().drawHuntTile("er"),
  b.fp().huntEffect(corruptFellowship(3)),
  b
    .s()
    .characterDie(
      moveNazgul("lorien", "erebor", 3),
      moveCharacters("lorien", "erebor", "the-witch-king"),
      moveCharacters("pelargir", "lamedon", "the-mouth-of-sauron")
    ),
  b.fp().pass(),
  b.s().eventDieCard("Dreadful Spells", targetRegion("erebor")),
  b.s().cardReaction("Dreadful Spells", rollCombatDice(5, 2, 6, 3, 3)),
  b.fp().cardReaction("Dreadful Spells", downgradeEliteUnit("erebor", "dwarves", 2)),
  b.fp().willOfTheWestDie(hideFellowship()),
  b.s().eventDieCard("On, On They Went", addHuntTile("r3s")),
  b.fp().pass(),
  b.s().armyDie(attack("lamedon", "pelargir")),
  b.s().battleStory(noCombatCard()),
  b.fp().battleStory(noCombatCard()),
  b.sT().battleStory(rollCombatDice(4, 1, 4, 3, 1)),
  b.fp().battleStory(rollCombatDice(3)),
  b.s().battleStory(reRollCombatDice(3)),
  b.s().battleStory(continueBattle("pelargir")),
  b.fp().battleStory(retreat("lossarnach")),
  b.s().battleStory(advanceArmy()),
  b.fp().pass(),
  b
    .s()
    .musterAbilityDie(
      "the-mouth-of-sauron",
      moveArmies(
        armyMovement("dale", "erebor", leftUnits(regular("sauron", 7))),
        armyMovement("minas-morgul", "south-ithilien")
      )
    ),
  b.fp().musterArmyElvenRingDie("nenya", moveFelloswhip()),
  b.s().drawHuntTile("b0"),
  b.s().musterArmyDie(attack("erebor", "erebor")),
  b.s().battleStory(combatCard("A New Power is Rising")),
  b.fp().battleStory(combatCard("Thranduil's Archers")),
  b.sT().battleStory(rollCombatDice(3, 2, 5, 3, 4)),
  b.fp().battleStory(rollCombatDice(6, 6, 6, 3, 2)),
  b.sT().battleStory(reRollCombatDice(3, 3, 6, 5, 6)),
  b.fp().battleStory(reRollCombatDice(2, 2)),
  b
    .s()
    .battleStory(
      eliminateRegularUnit("erebor", "southrons"),
      eliminateEliteUnit("erebor", "sauron")
    ),
  b.fp().battleStory(eliminateEliteUnit("erebor", "north")),
  b.fp().cardReaction("A New Power is Rising", eliminateRegularUnit("erebor", "north")),
  b.s().battleStory(continueBattle("erebor"), downgradeEliteUnit("erebor", "southrons")),
  b.s().characterReaction("the-witch-king", drawCards("The King is Revealed")),
  b.s().battleStory(combatCard("The King is Revealed")),
  b.fp().battleStory(noCombatCard()),
  b.s().combatCardReaction("The King is Revealed", eliminateRegularUnit("erebor", "southrons", 2)),
  b.sT().battleStory(rollCombatDice(5, 2, 1, 5, 5)),
  // end not in the video
  b.fp().battleStory(rollCombatDice(1, 1, 1)),
  b.fp().battleStory(reRollCombatDice(1, 1)),
  b
    .fp()
    .battleStory(
      eliminateRegularUnit("erebor", "dwarves", 3),
      eliminateLeader("erebor", "dwarves"),
      eliminateLeader("erebor", "north")
    )
];

export const fpTokens: WotrActionToken[] = ["draw-card", "political-advance"];
