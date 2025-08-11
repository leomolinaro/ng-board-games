import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Legolas - Son of Thranduil (Level 2, Leadership 1)
// Captain of the West. If Legolas is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Prince of Mirkwood. If Legolas is in an unconquered Elven Stronghold, you may use any Action die result to advance the Elven Nation one step on the Political Track.

@Injectable({ providedIn: "root" })
export class WotrLegolas extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "legolas";

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.characterStore),
      new PrinceOfMirkwoodAbility(this.characterStore)
    ];
  }
}

class PrinceOfMirkwoodAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
