import { WotrAbility, WotrUiAbility } from "../../ability/wotr-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrCharacterId } from "../wotr-character-models";
import {
  WotrBeforeCharacterElimination,
  WotrCharacterModifiers
} from "../wotr-character-modifiers";

// Meriadoc Brandybuck - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Meriadoc from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Meriadoc is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

// Peregrin Took - Hobbit Companion (Level 1, Leadership 1)
// Guide. During the Hunt, if the Hunt damage is one or more, separate Peregrin from the Fellowship to reduce the Hunt damage by one.
// Take Them Alive! If Peregrin is eliminated while in the Fellowship, immediately place him in play again as if he was just separated from the Fellowship. This special
// ability cannot be used if the Fellowship is on the Mordor Track.

export class HobbitGuideAbility implements WotrAbility<unknown> {
  public modifier = null as any;
  public handler = null;
}

export class TakeThemAliveAbility implements WotrUiAbility<WotrBeforeCharacterElimination> {
  constructor(
    private q: WotrGameQuery,
    private characterModifiers: WotrCharacterModifiers
  ) {}

  name: string = "Take Them Alive!";

  modifier = this.characterModifiers.beforeCharacterElimination;

  handler: WotrBeforeCharacterElimination = async (characterId: WotrCharacterId) => {
    if (characterId !== "meriadoc") return true;
    if (!this.q.meriadoc.isInFellowship()) return true;
    return true;
  };

  play: () => Promise<WotrAction[]> = async () => {
    return [];
  };
}
