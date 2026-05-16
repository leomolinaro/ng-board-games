import { WotrAbility } from "../../../ability/wotr-ability";
import { WotrBattleModifiers } from "../../../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../../../battle/wotr-battle-store";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrLogWriter } from "../../../log/wotr-log-writer";
import { WotrRecruitmentConstraints } from "../../../unit/wotr-unit-handler";
import {
  WotrRecruitmentConstraintsModifier,
  WotrUnitModifiers
} from "../../../unit/wotr-unit-modifiers";
import { WotrCharacterHandler } from "../../wotr-character-handler";
import { SovereingFateOf } from "./commons";
import { KomeSovereignCard } from "./kome-sovereign-card";

// Thranduil - King of the Woodland Realm (Level 2, Leadership 1, Shadow Resistance 4)
// If the Elves are active and Woodland Realm is unconquered, you may spend a Muster Action
// die result, or any Ruler die result, to move Thranduil to the Woodland Realm and awaken him there.
// Elvenking. If the Elves are "At War" and Thranduil is in the Woodland Realm, you may use a Muster
// Action die result to replace one Elven Regular unit in the Army with Thranduil with one Elite unit
// (even if the Woodland Realm is under siege).
// Far-sighted. If the Fellowship is not on the Mordor Track, you may use a Character result
// on the Ruler die to move the Fellowship, reducing by 1 the number of Hunt dice rolled
// (to a minimum of one); or to move or separate Companions, moving them one extra region.
// Thranduil is a Companion.

// Thranduil - Corrupted Ruler
// If Thranduil becomes Corrupted, place him in the Woodland Realm.
// Corrupted King. The Free Peoples player cannot recruit Elite units in the Woodland Realm,
// except as an effect of an Event card.
// Fate of Mirkwood. If the Woodland Realm is under siege, you can extend a siege battle there
// by removing a Shadow Regular unit, instead of reducing an Elite unit, once per siege battle.
// When a Companion with an Elven or Free Peoples icon is in the same region as Thranduil,
// Corrupted Ruler, the Free Peoples player may use a Character Action die result to remove Thranduil
// from play. His figure is removed, this card is discarded, and his Weaknesses immediately
// cease their effect.

export class Thranduil extends KomeSovereignCard {
  constructor(
    protected q: WotrGameQuery,
    protected characterHandler: WotrCharacterHandler,
    protected logger: WotrLogWriter
  ) {
    super();
  }

  readonly sovereignId = "thranduil";
  protected readonly nation = "elves";
  protected readonly awakeningRegion = "woodland-realm";
  protected readonly corruptionRegion = "woodland-realm";
}

export class ThranduilElvenking implements WotrAbility<WotrRecruitmentConstraintsModifier> {
  constructor(private unitModifiers: WotrUnitModifiers) {}

  modifier = this.unitModifiers.recruitmentConstraintsModifier;

  handler(constraints: WotrRecruitmentConstraints): void {
    constraints.excludedRegionsForEliteUnits.add("woodland-realm");
  }
}

export class FateOfMirkwood extends SovereingFateOf {
  constructor(battleModifiers: WotrBattleModifiers, battleStore: WotrBattleStore) {
    super("woodland-realm", battleModifiers, battleStore);
  }
}
