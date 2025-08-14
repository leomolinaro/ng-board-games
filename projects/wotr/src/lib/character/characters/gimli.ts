import { Injectable, inject } from "@angular/core";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrBattleModifiers } from "../../battle/wotr-battle-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrPlayerChoice } from "../../game/wotr-game-ui";
import { advanceNation } from "../../nation/wotr-nation-actions";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Gimli - Son of Gloin (Level 2, Leadership 1)
// Captain of the West. If Gimli is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 15 Combat dice).
// Dwarf of Erebor. If Gimli is in Erebor, and Erebor is unconquered, you may use any Action die result to advance the Dwarven Nation one step on the Political Track.

@Injectable({ providedIn: "root" })
export class WotrGimli extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private battleModifiers = inject(WotrBattleModifiers);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);

  protected override characterId: WotrCharacterId = "gimli";

  override abilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.battleModifiers),
      new DwarfOfEreborAbility(this.regionStore, this.nationStore, this.actionDieModifiers)
    ];
  }
}

class DwarfOfEreborAbility extends WotrCardAbility<WotrActionDieChoiceModifier> {
  constructor(
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    actionDieModifiers: WotrActionDieModifiers
  ) {
    super(actionDieModifiers.actionDieChoices);
  }

  protected override handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    const erebor = this.regionStore.region("erebor");
    if (
      !erebor.army?.characters?.includes("gimli") &&
      !erebor.underSiegeArmy?.characters?.includes("gimli")
    )
      return [];
    if (!this.regionStore.isUnconquered(erebor.id)) return [];
    const choice: WotrPlayerChoice = {
      label: () => "Dwarf of Erebor",
      isAvailable: () => {
        const nation = this.nationStore.nation("dwarves");
        if (nation.politicalStep === "atWar") return false;
        return true;
      },
      resolve: async () => {
        return [advanceNation("dwarves")];
      }
    };
    return [choice];
  };
}
