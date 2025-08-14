import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import {
  WotrBeforeCharacterElimination,
  WotrCharacterModifiers
} from "../wotr-character-modifiers";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// Meriadoc Brandybuck - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Meriadoc from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Meriadoc is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

@Injectable({ providedIn: "root" })
export class WotrMeriadoc extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private characterModifiers = inject(WotrCharacterModifiers);

  protected override characterId: WotrCharacterId = "meriadoc";

  override abilities(): WotrCardAbility[] {
    return [
      // new GuideAbility(null as any),
      new TakeThemAliveAbility(this.characterStore, this.characterModifiers)
    ];
  }
}

class GuideAbility extends WotrCardAbility<unknown> {
  protected override handler = null;
}

class TakeThemAliveAbility extends WotrCardAbility<WotrBeforeCharacterElimination> {
  constructor(
    private characterStore: WotrCharacterStore,
    characterModifiers: WotrCharacterModifiers
  ) {
    super(characterModifiers.beforeCharacterElimination);
  }

  protected override handler: WotrBeforeCharacterElimination = async (
    characterId: WotrCharacterId
  ) => {
    if (characterId !== "meriadoc") return true;
    if (!this.characterStore.isInFellowship("meriadoc")) return true;
    return true;
  };
}
