import { WotrActionDieModifiers } from "../../action-die/wotr-action-die-modifiers";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrRegion } from "../../region/wotr-region-models";
import { AdvanceAnyDieAbility } from "./commons";

// Boromir - Son of Denethor (Level 2, Leadership 1)
// Captain of the West. If Boromir is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// High Warden of the White Tower. If Boromir is in an unconquered Gondor City or Stronghold, use any Action die result to advance the Gondor Nation one step on
// the Political Track.

export class HighWardenOfTheWhiteTowerAbility extends AdvanceAnyDieAbility {
  constructor(q: WotrGameQuery, actionDieModifiers: WotrActionDieModifiers) {
    super(
      "boromir",
      "Advance Gondor (Boromir, High Warden of the White Tower)",
      "gondor",
      q,
      actionDieModifiers
    );
  }

  protected override isValidRegion(region: WotrRegion): boolean {
    if (region.nationId !== "gondor") return false;
    return region.settlement === "city" || region.settlement === "stronghold";
  }
}

// Gimli - Son of Gloin (Level 2, Leadership 1)
// Captain of the West. If Gimli is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 15 Combat dice).
// Dwarf of Erebor. If Gimli is in Erebor, and Erebor is unconquered, you may use any Action die result to advance the Dwarven Nation one step on the Political Track.

export class DwarfOfEreborAbility extends AdvanceAnyDieAbility {
  constructor(q: WotrGameQuery, actionDieModifiers: WotrActionDieModifiers) {
    super("gimli", "Advance Dwarves (Gimli, Dwarf of Erebor)", "dwarves", q, actionDieModifiers);
  }

  protected override isValidRegion(region: WotrRegion): boolean {
    return region.id === "erebor";
  }
}

// Legolas - Son of Thranduil (Level 2, Leadership 1)
// Captain of the West. If Legolas is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Prince of Mirkwood. If Legolas is in an unconquered Elven Stronghold, you may use any Action die result to advance the Elven Nation one step on the Political Track.

export class PrinceOfMirkwoodAbility extends AdvanceAnyDieAbility {
  constructor(q: WotrGameQuery, actionDieModifiers: WotrActionDieModifiers) {
    super("legolas", "Advance Elves (Legolas, Prince of Mirkwood)", "elves", q, actionDieModifiers);
  }

  protected override isValidRegion(region: WotrRegion): boolean {
    return region.settlement === "stronghold" && region.nationId === "elves";
  }
}
