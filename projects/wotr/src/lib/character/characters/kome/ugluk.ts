import { WotrAbility } from "../../../ability/wotr-ability";
import { WotrBattleModifiers } from "../../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrCharacterId } from "../../wotr-character-models";
import { WotrCharacterCard } from "../wotr-character-card";

// Ugluk - Chieftain of the Uruk-hai (Level 2, Leadership 1, +1 Ruler Special Action Die)
// If Rohan is "At War", or the Fellowship is revealed, you may spend a Muster Action die result,
// or any Ruler die result (except an Eye), to play Ugluk in a region with an Army containing
// an Isengard unit, or in a free region with, or adjacent to, the revealed Fellowship.
// I Command. If Ugluk is in a battle, before revealing Combat cards you may forfeit the effects
// of your Combat card to add 1 to all dice on the Combat roll and Leader re-roll of both Armies;
// if the Combat card is "Desperate Battle", add 1 to your dice only [3].
// We March Day and Night. If Ugluk is in the region with, or in a region adjiacent to, the Fellowship,
// add 1 to all dice on your Hunt re-roll.
// Ugluk is not a Minion for the purpose of playing Gandalf the White.

export class Ugluk extends WotrCharacterCard {
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
    throw new Error("Ugluk cannot be brought into play.");
  }
}

export class ICommandAbility implements WotrAbility<unknown> {
  public modifier: any = null;
  public handler: unknown = null;
}

export class WeMarchDayAndNightAbility implements WotrAbility<unknown> {
  public modifier: any = null;
  public handler: unknown = null;
}
