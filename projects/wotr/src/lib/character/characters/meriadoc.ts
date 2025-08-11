import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// Meriadoc Brandybuck - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Meriadoc from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Meriadoc is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

@Injectable({ providedIn: "root" })
export class WotrMeriadoc extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "meriadoc";

  override guideAbilities(): WotrCardAbility[] {
    return [new GuideAbility(this.characterStore)];
  }

  protected override eliminatedAbilities(): WotrCardAbility[] {
    return [new TakeThemAliveAbility(this.characterStore)];
  }

  override inPlayAbilities(): WotrCardAbility[] {
    return [];
  }
}

class GuideAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}

class TakeThemAliveAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
