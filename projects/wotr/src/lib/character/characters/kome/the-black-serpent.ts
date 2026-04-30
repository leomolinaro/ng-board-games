import { WotrAbility } from "../../../ability/wotr-ability";
import { WotrBattleModifiers } from "../../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrCharacterId } from "../../wotr-character-models";
import { WotrCharacterCard } from "../wotr-character-card";

// The Black Serpent - Chieftain of the Haradrim (Level 2, Leadership 2, +1 Ruler Special Action Die)
// If Gondor is "At War", you may spend a Muster Action or any Ruler die result
// (except an Eye), to play the Black Serpent in a region with an Army containing a
// Southrons & Esterling unit.
// Red Wrath. If the Black Serpent is in a battle, before revealing Combat cards,
// you may forfeit the effects of your Combat card, and inflict and apply one hit against
// your units, to add 1 to all dice on your Combat roll;
// if the Combat card is "Relentless Assault", add 2 to all dice on your Combat roll instead [3].
// The Black Serpent is not a Minion for the purpose of playing Gandalf the White.

export class TheBlackSerpent extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private q: WotrGameQuery,
    protected battleModifiers: WotrBattleModifiers
  ) {
    super();
  }

  override canBeBroughtIntoPlay(): boolean {
    return false;
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("The Black Serpent cannot be brought into play.");
  }
}

export class RedWrath implements WotrAbility<unknown> {
  public modifier: any = null;
  public handler: unknown = null;
}
