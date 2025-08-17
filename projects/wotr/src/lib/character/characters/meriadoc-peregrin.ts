import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrCharacterId } from "../wotr-character-models";
import {
  WotrBeforeCharacterElimination,
  WotrCharacterModifiers
} from "../wotr-character-modifiers";
import { WotrCharacterStore } from "../wotr-character-store";

// Meriadoc Brandybuck - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Meriadoc from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Meriadoc is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

// Peregrin Took - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Peregrin from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Peregrin is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

export class HobbitGuideAbility extends WotrCardAbility<unknown> {
  protected override handler = null;
}

export class TakeThemAliveAbility extends WotrCardAbility<WotrBeforeCharacterElimination> {
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
