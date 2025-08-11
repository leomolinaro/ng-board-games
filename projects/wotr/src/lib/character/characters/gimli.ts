import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Gimli - Son of Gloin (Level 2, Leadership 1)
// Captain of the West. If Gimli is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 15 Combat dice).
// Dwarf of Erebor. If Gimli is in Erebor, and Erebor is unconquered, you may use any Action die result to advance the Dwarven Nation one step on the Political Track.

@Injectable({ providedIn: "root" })
export class WotrGimli extends WotrCharacterCard {
  private regionStore = inject(WotrRegionStore);
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "gimli";

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.characterStore),
      new DwarfOfEreborAbility(this.characterStore)
    ];
  }
}

class DwarfOfEreborAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
