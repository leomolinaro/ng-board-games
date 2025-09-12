import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegionId } from "../../region/wotr-region-models";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterCard } from "./wotr-character-card";

// Gandalf the White - Emissary from the West (Level 3, Leadership 1, +1 Action Die)
// If Gandalf the Grey has been eliminated or has left the Fellowship, and any Minion is (or has been) in play, you may use one Will of the West Action die result to
// play Gandalf the White.
// If Gandalf the Grey is in play, replace him; otherwise, place Gandalf the White in Fangorn or in an unconquered Elven Stronghold.
// Shadowfax. If Gandalf the White is moving alone or with one Hobbit, his Level is considered 4 (for purposes of movement only).
// The White Rider. If Gandalf the White is in a battle, at the start of the battle you can forfeit his Leadership to negate all Nazgul Leadership (including that of the
// Witch-king) for the duration of that battle.

export class WotrGandalfTheWhite extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private q: WotrGameQuery
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (!this.q.gandalfTheWhite.isAvailable()) return false;
    if (die !== "will-of-the-west") return false;
    const gandalf = this.q.gandalfTheGrey;
    if (!gandalf.isInPlay() && !gandalf.isEliminated()) return false;
    if (this.q.minions.every(c => !c.isInPlay() && !c.isEliminated())) return false;
    return true;
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const gandalf = this.q.gandalfTheGrey;
    if (gandalf.isInPlay()) {
      const gandalfRegion = gandalf.region()!;
      return playCharacter(gandalfRegion.id, "gandalf-the-white");
    } else if (gandalf.isEliminated()) {
      const elvenStrongholds: WotrRegionId[] = [
        "rivendell",
        "lorien",
        "woodland-realm",
        "grey-havens"
      ];
      const targetRegions: WotrRegionId[] = ["fangorn"];
      for (const regionId of elvenStrongholds) {
        if (this.q.region(regionId).isUnconquered()) targetRegions.push(regionId);
      }
      const region = await ui.askRegion(
        "Select a region to bring Gandalf the White into play",
        targetRegions
      );
      return playCharacter(region, "gandalf-the-white");
    }
    throw new Error(
      "Gandalf the Grey is not in a valid state to bring Gandalf the White into play."
    );
  }
}

export class ShadowfaxAbility implements WotrAbility<unknown> {
  public modifier = null as any;
  public handler = null;
}

export class TheWhiteRiderAbility implements WotrAbility<unknown> {
  public modifier = null as any;
  public handler = null;
}
