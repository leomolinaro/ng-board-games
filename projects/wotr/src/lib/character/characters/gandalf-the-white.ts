import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegionId } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
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
    private characterStore: WotrCharacterStore,
    private regionStore: WotrRegionStore
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (!this.characterStore.isAvailable("gandalf-the-white")) return false;
    if (die !== "will-of-the-west") return false;
    const gandalf = this.characterStore.character("gandalf-the-grey");
    if (gandalf.status !== "inPlay" && gandalf.status !== "eliminated") return false;
    if (
      this.characterStore.minions().every(c => {
        return c.status !== "inPlay" && c.status !== "eliminated";
      })
    ) {
      return false;
    }
    return true;
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const gandalf = this.characterStore.character("gandalf-the-grey");
    if (gandalf.status === "inPlay") {
      const gandalfRegion = this.regionStore.characterRegion("gandalf-the-grey")!;
      return playCharacter(gandalfRegion.id, "gandalf-the-white");
    } else if (gandalf.status === "eliminated") {
      const elvenStrongholds: WotrRegionId[] = [
        "rivendell",
        "lorien",
        "woodland-realm",
        "grey-havens"
      ];
      const targetRegions: WotrRegionId[] = ["fangorn"];
      for (const regionId of elvenStrongholds) {
        if (this.regionStore.isUnconquered(regionId)) {
          targetRegions.push(regionId);
        }
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
