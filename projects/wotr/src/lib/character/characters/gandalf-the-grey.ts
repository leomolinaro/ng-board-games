import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Gandalf the Grey - The Grey Wanderer (Level 3, Leadership 1) Guide. After you use an Action die result to play an Event card, you may immediately draw an Event card from the deck matching the type of that card.
// Captain of the West. If Gandalf is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Emissary from the West. If Gandalf is not in the Fellowship, he can be replaced by Gandalf the White (instructions are provided on the Gandalf the White Character
// card).

@Injectable({ providedIn: "root" })
export class WotrGandalfTheGrey extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "gandalf-the-grey";

  override guideAbilities(): WotrCardAbility[] {
    return [new GuideAbility(this.characterStore)];
  }

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.characterStore),
      new EmissaryFromTheWestAbility(this.characterStore)
    ];
  }
}

class GuideAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}

class EmissaryFromTheWestAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
