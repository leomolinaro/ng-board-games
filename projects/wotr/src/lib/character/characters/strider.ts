import { Injectable, inject } from "@angular/core";
import { WotrBattleModifiers } from "../../battle/wotr-battle-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Strider - Ranger of the North (Level 3, Leadership 1)
// Guide. You may use any of your Action die results to hide a revealed Fellowship.
// Captain of the West. If Strider is in a battle, add one to the Combat Strength of the Free Peoples Army (you can still roll a maximum of 5 Combat dice).
// Heir to Isuldur. If Strider is not in the Fellowship, he can be replaced by Aragorn (instructions are provided on the Aragorn Character card).

@Injectable({ providedIn: "root" })
export class WotrStrider extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private battleModifiers = inject(WotrBattleModifiers);

  protected override characterId: WotrCharacterId = "strider";

  override guideAbilities(): WotrCardAbility[] {
    return [new GuideAbility(this.characterStore)];
  }

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.battleModifiers),
      new HeirToIsildurAbility(this.characterStore)
    ];
  }
}

class GuideAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}

class HeirToIsildurAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
