import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

// Peregrin Took - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Peregrin from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Peregrin is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

@Injectable({ providedIn: "root" })
export class WotrPeregrin extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "peregrin";

  override abilities(): WotrCardAbility[] {
    return [
      /* new GuideAbility(null as any), */
      /* new TakeThemAliveAbility(null as any) */
    ];
  }
}

class GuideAbility extends WotrCardAbility<unknown> {
  protected override handler = null;
}

class TakeThemAliveAbility extends WotrCardAbility<unknown> {
  protected override handler = null;
}
