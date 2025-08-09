import { Injectable, inject } from "@angular/core";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// Strider - Ranger of the North (Level 3, Leadership 1)
// Guide. You may use any of your Action die results to hide a revealed Fellowship.
// Captain of the West. If Strider is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Heir to Isuldur. If Strider is not in the Fellowship, he can be replaced by Aragorn (instructions are provided on the Aragorn Character card).

@Injectable({ providedIn: "root" })
export class WotrStrider extends WotrCharacterCard {
  private regionStore = inject(WotrRegionStore);
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "strider";

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    throw new Error("Strider starts already in play.");
  }

  async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Strider starts already in play.");
  }

  createAbilities(): WotrCardAbility[] {
    return [
      new GuideAbility(this.characterStore),
      new CaptainOfTheWestAbility(this.characterStore),
      new HeirToIsildurAbility(this.characterStore)
    ];
  }
}

class GuideAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}

class CaptainOfTheWestAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}

class HeirToIsildurAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
