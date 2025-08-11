import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Boromir - Son of Denethor (Level 2, Leadership 1)
// Captain of the West. If Boromir is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// High Warden of the White Tower. If Boromir is in an unconquered Gondor City or Stronghold, use any Action die result to advance the Gondor Nation one step on
// the Political Track.

@Injectable({ providedIn: "root" })
export class WotrBoromir extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "boromir";

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.characterStore),
      new HighWardenOfTheWhiteTowerAbility(this.characterStore)
    ];
  }
}

class HighWardenOfTheWhiteTowerAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
