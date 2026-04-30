import { WotrAbility } from "../../../ability/wotr-ability";
import { WotrBattleModifiers } from "../../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrCharacterId } from "../../wotr-character-models";
import { WotrCharacterCard } from "../wotr-character-card";

// The Shadow of Mirkwood - Chieftain of the Dark Lord (Level 3, Leadership 1, +1 Ruler Special Action Die)
// If either the Dwarves, the Elves, or the North are "At War", you may spend a Muster Action
// die result, of any Ruler die result (except an Eye), to play the Shadow of Mirkwood in a region with an Army containing a
// Sauron unit.
// Lord of the Bats. If Shadow of Mirkwood is in a battle, before revealing Combat cards,
// you may forfeit both the effects of your Combat card and the Shadow of Mirkwood's Leadership
// to add 1 to all dice on your Leader re-roll [4];
// if the Combat card is "Swarm of Bats", you also cancel the effect of the Comabt Card played
// by the Free Peoples player [0].
// The Shadow of Mirkwood is not a Minion for the purpose of playing Gandalf the White.

export class TheShadowOfMirkwood extends WotrCharacterCard {
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
    throw new Error("The Shadow of Mirkwood cannot be brought into play.");
  }
}

export class LordOfTheBats implements WotrAbility<unknown> {
  public modifier: any = null;
  public handler: unknown = null;
}
